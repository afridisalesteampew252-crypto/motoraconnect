import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  matchId?: string;
  content: string;
  attachmentUrl?: string;
  read: boolean;
  createdAt: string;
}

/**
 * Send a message between buyer and seller
 */
export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
  matchId?: string,
  attachmentUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          match_id: matchId,
          content,
          attachment_url: attachmentUrl,
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Get conversation between two users
 */
export async function getConversation(
  userId1: string,
  userId2: string,
  limit: number = 50
) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`
      )
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        *,
        sender:sender_id(
          id,
          full_name,
          email
        ),
        receiver:receiver_id(
          id,
          full_name,
          email
        )
      `
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by conversation partner
    const conversations = new Map();
    for (const message of data || []) {
      const partnerId =
        message.sender_id === userId ? message.receiver_id : message.sender_id;
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, []);
      }
      conversations.get(partnerId).push(message);
    }

    return conversations;
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

/**
 * Get unread message count
 */
export async function getUnreadMessageCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time messages
 */
export function subscribeToMessages(
  userId: string,
  callback: (message: Message) => void
) {
  const subscription = supabase
    .channel(`messages:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload: any) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return subscription;
}
