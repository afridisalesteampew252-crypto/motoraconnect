import { supabase } from '../lib/supabase';

export interface AuctionVerificationRequest {
  lotNumber: string;
  notes?: string;
  sheetFile?: File;
}

export async function submitAuctionVerification(
  userId: string,
  request: AuctionVerificationRequest
) {
  try {
    let sheetUrl = '';

    if (request.sheetFile) {
      const fileExt = request.sheetFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      // FIX: removed "auction-sheets/" prefix

      const { error: uploadError } = await supabase.storage
        .from('auction-sheets')
        .upload(fileName, request.sheetFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('auction-sheets')
        .getPublicUrl(fileName);

      sheetUrl = urlData.publicUrl;
    }

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
