import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  userId: string;
  type: 'match_found' | 'message' | 'viewing_scheduled' | 'offer_received';
  title: string;
  message: string;
  relatedId?: string; // matchId, messageId, etc.
  read: boolean;
  createdAt: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  relatedId?: string
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          related_id: relatedId,
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * Send match notification to buyer
 */
export async function notifyBuyerOfMatch(
  buyerId: string,
  vehicleMake: string,
  vehicleModel: string,
  matchScore: number,
  matchId: string
) {
  return createNotification(
    buyerId,
    'match_found',
    '🎉 New Vehicle Match!',
    `We found a ${vehicleMake} ${vehicleModel} that matches your preferences (${matchScore}% match)`,
    matchId
  );
}

/**
 * Send match notification to seller
 */
export async function notifySellerOfMatch(
  sellerId: string,
  vehicleMake: string,
  vehicleModel: string,
  buyerName: string,
  matchId: string
) {
  return createNotification(
    sellerId,
    'match_found',
    '👤 Buyer Found!',
    `${buyerName} is interested in your ${vehicleMake} ${vehicleModel}`,
    matchId
  );
}

/**
 * Subscribe to real-time notifications
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
) {
  const subscription = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload: any) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return subscription;
}
