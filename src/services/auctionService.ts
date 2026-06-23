import { supabase } from '../lib/supabase';

export interface AuctionVerificationRequest {
  lotNumber: string;
  notes?: string;
  sheetFile?: File;
}

/**
 * Submit an auction sheet for verification
 */
export async function submitAuctionVerification(
  userId: string,
  request: AuctionVerificationRequest
) {
  try {
    let sheetUrl = '';

    // 1. Upload file if provided
    if (request.sheetFile) {
      const fileExt = request.sheetFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `auction-sheets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('auction-sheets')
        .upload(filePath, request.sheetFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('auction-sheets')
        .getPublicUrl(filePath);
      
      sheetUrl = urlData.publicUrl;
    }

    // 2. Create verification record
    const { data, error } = await supabase
      .from('auction_verifications')
      .insert([
        {
          user_id: userId,
          lot_number: request.lotNumber,
          notes: request.notes,
          sheet_url: sheetUrl,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting auction verification:', error);
    throw error;
  }
}

/**
 * Get user's auction verification requests
 */
export async function getUserAuctionRequests(userId: string) {
  try {
    const { data, error } = await supabase
      .from('auction_verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting auction requests:', error);
    throw error;
  }
}
