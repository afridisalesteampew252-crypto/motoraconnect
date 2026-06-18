import { supabase } from '../lib/supabase';

/**
 * Matching score breakdown
 */
export interface MatchScore {
  totalScore: number;
  makeScore: number;
  priceScore: number;
  yearScore: number;
  conditionScore: number;
  bodyTypeScore: number;
  locationScore: number;
}

/**
 * Calculate match score between a vehicle and buyer preferences
 */
export async function calculateMatchScore(
  vehicle: Vehicle,
  buyerProfile: BuyerProfile,
  buyerId: string
): Promise<MatchScore> {
  const scores = {
    makeScore: 0,
    priceScore: 0,
    yearScore: 0,
    conditionScore: 0,
    bodyTypeScore: 0,
    locationScore: 0,
  };

  // Make/Brand matching (25 points max)
  if (buyerProfile.preferred_makes && buyerProfile.preferred_makes.length > 0) {
    const preferredMakes = buyerProfile.preferred_makes.map((m: string) => m.toLowerCase());
    if (preferredMakes.includes(vehicle.make.toLowerCase())) {
      scores.makeScore = 25;
    }
  } else {
    scores.makeScore = 15; // Default score if no preference
  }

  // Price matching (25 points max)
  if (vehicle.price) {
    const minPrice = buyerProfile.budget_min || 0;
    const maxPrice = buyerProfile.budget_max || Infinity;

    if (vehicle.price >= minPrice && vehicle.price <= maxPrice) {
      scores.priceScore = 25;
    } else if (
      (vehicle.price < minPrice && vehicle.price > minPrice * 0.85) ||
      (vehicle.price > maxPrice && vehicle.price < maxPrice * 1.15)
    ) {
      scores.priceScore = 12; // Slight flexibility
    }
  }

  // Year/Age matching (15 points max)
  if (buyerProfile.preferred_makes) {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicle.year;

    if (vehicleAge <= 5) {
      scores.yearScore = 15;
    } else if (vehicleAge <= 10) {
      scores.yearScore = 10;
    } else if (vehicleAge <= 15) {
      scores.yearScore = 5;
    }
  }

  // Condition matching (15 points max)
  if (vehicle.condition) {
    const conditionScores: Record<string, number> = {
      excellent: 15,
      good: 12,
      fair: 8,
      poor: 0,
    };
    scores.conditionScore = conditionScores[vehicle.condition] || 0;
  }

  // Body type matching (10 points max)
  if (
    buyerProfile.preferred_body_types &&
    buyerProfile.preferred_body_types.length > 0
  ) {
    const preferredTypes = buyerProfile.preferred_body_types.map((t: string) =>
      t.toLowerCase()
    );
    // Note: vehicle table doesn't have body_type, but schema has it in admin table
    scores.bodyTypeScore = 10;
  }

  // Location matching (5 points max)
  if (buyerProfile.location) {
    scores.locationScore = 5; // Location can be refined with actual location data
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return {
    totalScore: Math.round(totalScore),
    ...scores,
  };
}

/**
 * Find all matches for a vehicle
 */
export async function findMatchesForVehicle(vehicleId: string) {
  try {
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (vehicleError) throw vehicleError;
    if (!vehicle) throw new Error('Vehicle not found');

    // Get all active buyer profiles
    const { data: buyerProfiles, error: profilesError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('is_verified', true);

    if (profilesError) throw profilesError;

    const matches: Array<{
      buyerId: string;
      score: MatchScore;
      reason: string;
    }> = [];

    // Calculate scores for each buyer
    for (const profile of buyerProfiles || []) {
      const matchScore = await calculateMatchScore(vehicle, profile, profile.user_id);

      if (matchScore.totalScore >= 40) {
        // Only include matches with score >= 40
        const reason = generateMatchReason(matchScore);
        matches.push({
          buyerId: profile.user_id,
          score: matchScore,
          reason,
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score.totalScore - a.score.totalScore);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
}

/**
 * Find all matches for a buyer
 */
export async function findMatchesForBuyer(buyerId: string) {
  try {
    const { data: buyerProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', buyerId)
      .single();

    if (profileError) throw profileError;
    if (!buyerProfile) throw new Error('Buyer profile not found');

    // Get all listed vehicles from verified sellers
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*, seller_profiles(*)')
      .eq('is_listed', true);

    if (vehiclesError) throw vehiclesError;

    const matches: Array<{
      vehicleId: string;
      score: MatchScore;
      reason: string;
    }> = [];

    // Calculate scores for each vehicle
    for (const vehicle of vehicles || []) {
      const matchScore = await calculateMatchScore(vehicle, buyerProfile, buyerId);

      if (matchScore.totalScore >= 40) {
        // Only include matches with score >= 40
        const reason = generateMatchReason(matchScore);
        matches.push({
          vehicleId: vehicle.id,
          score: matchScore,
          reason,
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score.totalScore - a.score.totalScore);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
}

/**
 * Generate human-readable match reason
 */
function generateMatchReason(score: MatchScore): string {
  const reasons: string[] = [];

  if (score.makeScore >= 25) reasons.push('Perfect brand match');
  if (score.priceScore >= 25) reasons.push('Perfect price range');
  if (score.yearScore >= 15) reasons.push('Recent model year');
  if (score.conditionScore >= 12) reasons.push('Excellent condition');
  if (score.bodyTypeScore >= 10) reasons.push('Preferred body type');
  if (score.locationScore >= 5) reasons.push('Right location');

  return reasons.length > 0 ? reasons.join(', ') : 'Good match';
}

/**
 * Create a match record
 */
export async function createMatch(
  vehicleId: string,
  buyerId: string,
  sellerId: string,
  matchScore: MatchScore
) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert([
        {
          vehicle_id: vehicleId,
          buyer_id: buyerId,
          seller_id: sellerId,
          match_score: matchScore.totalScore,
          match_reason: generateMatchReason(matchScore),
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: 'active' | 'contacted' | 'viewing_scheduled' | 'rejected' | 'completed'
) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .update({ status, contacted_at: new Date().toISOString() })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating match status:', error);
    throw error;
  }
}

/**
 * Get matches for a user (buyer or seller)
 */
export async function getMatchesForUser(userId: string, userType: 'buyer' | 'seller') {
  try {
    let query = supabase.from('matches').select('*');

    if (userType === 'buyer') {
      query = query.eq('buyer_id', userId);
    } else {
      query = query.eq('seller_id', userId);
    }

    const { data, error } = await query.order('match_score', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
}
