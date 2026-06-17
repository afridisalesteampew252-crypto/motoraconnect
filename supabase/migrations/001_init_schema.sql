-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  profile_type TEXT NOT NULL CHECK (profile_type IN ('buyer', 'seller', 'both')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Subscriptions table (Stripe integration)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_product_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table (with VIN lookup)
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vin TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT,
  mileage INTEGER,
  condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  price DECIMAL(10, 2),
  description TEXT,
  is_listed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vin, user_id),
  CONSTRAINT year_range CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  CONSTRAINT mileage_positive CHECK (mileage >= 0),
  CONSTRAINT price_positive CHECK (price > 0)
);

-- Vehicle searches table (Pro feature)
CREATE TABLE public.vehicle_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  make TEXT,
  model TEXT,
  min_year INTEGER,
  max_year INTEGER,
  min_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  condition TEXT,
  search_name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_matched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buyers profiles
CREATE TABLE public.buyer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_makes TEXT[],
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  preferred_body_types TEXT[],
  desired_features TEXT[],
  location TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sellers profiles
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT,
  is_dealer BOOLEAN DEFAULT false,
  license_number TEXT,
  license_expiry DATE,
  average_rating DECIMAL(3, 2),
  total_sales INTEGER DEFAULT 0,
  location TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT rating_range CHECK (average_rating IS NULL OR (average_rating >= 0 AND average_rating <= 5))
);

-- Matches table (buyer-seller matching)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_score DECIMAL(5, 2) NOT NULL,
  match_reason TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'viewing_scheduled', 'rejected', 'completed')),
  contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT match_score_range CHECK (match_score >= 0 AND match_score <= 100),
  CONSTRAINT seller_not_buyer CHECK (seller_id != buyer_id)
);

-- Transactions table (commission tracking)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  sale_price DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'completed', 'disputed', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT sale_price_positive CHECK (sale_price > 0),
  CONSTRAINT commission_rate_valid CHECK (commission_rate >= 0 AND commission_rate <= 100),
  CONSTRAINT commission_amount_non_negative CHECK (commission_amount >= 0)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX idx_vehicles_is_listed ON public.vehicles(is_listed);
CREATE INDEX idx_vehicles_created_at ON public.vehicles(created_at);
CREATE INDEX idx_vehicle_searches_user_id ON public.vehicle_searches(user_id);
CREATE INDEX idx_vehicle_searches_is_active ON public.vehicle_searches(is_active);
CREATE INDEX idx_buyer_profiles_user_id ON public.buyer_profiles(user_id);
CREATE INDEX idx_seller_profiles_user_id ON public.seller_profiles(user_id);
CREATE INDEX idx_matches_vehicle_id ON public.matches(vehicle_id);
CREATE INDEX idx_matches_buyer_id ON public.matches(buyer_id);
CREATE INDEX idx_matches_seller_id ON public.matches(seller_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_created_at ON public.matches(created_at);
CREATE INDEX idx_transactions_match_id ON public.transactions(match_id);
CREATE INDEX idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON public.transactions(seller_id);
CREATE INDEX idx_transactions_vehicle_id ON public.transactions(vehicle_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read seller profiles" ON public.users
  FOR SELECT USING (
    profile_type IN ('seller', 'both') OR 
    auth.uid() = id
  );

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can read own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for vehicles
CREATE POLICY "Users can read own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read public listed vehicles" ON public.vehicles
  FOR SELECT USING (is_listed = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for vehicle_searches
CREATE POLICY "Users can read own searches" ON public.vehicle_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON public.vehicle_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches" ON public.vehicle_searches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches" ON public.vehicle_searches
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for buyer_profiles
CREATE POLICY "Users can read own buyer profile" ON public.buyer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buyer profile" ON public.buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buyer profile" ON public.buyer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for seller_profiles
CREATE POLICY "Users can read own seller profile" ON public.seller_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read verified seller profiles" ON public.seller_profiles
  FOR SELECT USING (is_verified = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own seller profile" ON public.seller_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seller profile" ON public.seller_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Buyers can read their matches" ON public.matches
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can read their matches" ON public.matches
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can insert matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Matches can be updated by participants" ON public.matches
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS Policies for transactions
CREATE POLICY "Buyers can read their transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can read their transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Only system can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (false); -- Will be enabled via service role

CREATE POLICY "Transactions can be updated by participants" ON public.transactions
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
