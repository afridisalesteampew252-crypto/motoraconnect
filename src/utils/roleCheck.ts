import type { UserProfile } from '@/context/AuthContext';

/**
 * Subscription tier hierarchy
 */
const TIER_HIERARCHY: Record<'free' | 'pro' | 'premium', number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

/**
 * Check if a subscription tier can access a required feature
 * @param userTier - User's current subscription tier
 * @param requiredTier - Minimum tier required for the feature
 */
export const canAccessFeature = (
  userTier: 'free' | 'pro' | 'premium',
  requiredTier: 'free' | 'pro' | 'premium'
): boolean => {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
};

/**
 * Get list of available features for a subscription tier
 */
export const getFeaturesByTier = (tier: 'free' | 'pro' | 'premium') => {
  const features = {
    free: {
      maxVehicles: 5,
      maxSearches: 1,
      canViewMatches: true,
      canContact: true,
      maxContactsPerMonth: 5,
      advancedFilters: false,
      vinLookup: false,
    },
    pro: {
      maxVehicles: 50,
      maxSearches: 10,
      canViewMatches: true,
      canContact: true,
      maxContactsPerMonth: 100,
      advancedFilters: true,
      vinLookup: true,
    },
    premium: {
      maxVehicles: 999,
      maxSearches: 999,
      canViewMatches: true,
      canContact: true,
      maxContactsPerMonth: 9999,
      advancedFilters: true,
      vinLookup: true,
    },
  };

  return features[tier];
};

/**
 * Check if user can perform an action based on their profile
 */
export const canPerformAction = (
  userProfile: UserProfile,
  action: 'view_listings' | 'post_listing' | 'contact_user' | 'advanced_search'
): boolean => {
  const features = getFeaturesByTier(userProfile.subscription_tier);

  switch (action) {
    case 'view_listings':
      return userProfile.is_active;
    case 'post_listing':
      return userProfile.is_active && ['seller', 'both'].includes(userProfile.profile_type);
    case 'contact_user':
      return userProfile.is_active && features.canContact;
    case 'advanced_search':
      return userProfile.is_active && features.advancedFilters;
    default:
      return false;
  }
};

/**
 * Check if user is a seller
 */
export const isSeller = (userProfile: UserProfile): boolean => {
  return ['seller', 'both'].includes(userProfile.profile_type);
};

/**
 * Check if user is a buyer
 */
export const isBuyer = (userProfile: UserProfile): boolean => {
  return ['buyer', 'both'].includes(userProfile.profile_type);
};

/**
 * Check if subscription is active and valid
 */
export const isSubscriptionActive = (status: string): boolean => {
  return ['active', 'trialing'].includes(status);
};

/**
 * Get days remaining in subscription period
 */
export const getDaysRemaining = (currentPeriodEnd: string | null): number | null => {
  if (!currentPeriodEnd) return null;

  const endDate = new Date(currentPeriodEnd);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, daysRemaining);
};

/**
 * Get upgrade recommendation based on usage
 */
export const getUpgradeRecommendation = (
  userProfile: UserProfile,
  currentVehicleCount: number,
  currentSearchCount: number
): 'none' | 'pro' | 'premium' => {
  const features = getFeaturesByTier(userProfile.subscription_tier);

  // If at 80% capacity, recommend upgrade
  if (
    currentVehicleCount >= features.maxVehicles * 0.8 ||
    currentSearchCount >= features.maxSearches * 0.8
  ) {
    return userProfile.subscription_tier === 'free' ? 'pro' : 'premium';
  }

  return 'none';
};
