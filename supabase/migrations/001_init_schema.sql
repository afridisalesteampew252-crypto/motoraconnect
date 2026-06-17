-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & Authentication
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  country TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL, -- 'pro', 'enterprise'
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(stripe_subscription_id)
);

-- Vehicles
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT UNIQUE NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  price DECIMAL,
  mileage INTEGER,
  condition TEXT, -- 'excellent', 'good', 'fair', 'poor'
  auction_source TEXT, -- 'copart', 'iaa', 'manual'
  preview_url TEXT,
  data_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Vehicle Searches (Pro feature - data storage)
CREATE TABLE public.vehicle_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  search_params JSONB,
  notes TEXT,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buyer Profiles
CREATE TABLE public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  location TEXT,
  country TEXT,
  budget_min DECIMAL,
  budget_max DECIMAL,
  preferred_vehicles JSONB, -- { makes: [], models: [], years: [] }
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seller Profiles
CREATE TABLE public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  location TEXT,
  country TEXT,
  company_name TEXT,
  inventory_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches (Buyer + Seller + Vehicle)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  match_score DECIMAL, -- 0-100
  status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'matched', 'completed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions (for commission tracking)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  commission_percent DECIMAL DEFAULT 5, -- 5% commission
  commission_amount DECIMAL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  stripe_payment_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX idx_vehicle_searches_user_id ON public.vehicle_searches(user_id);
CREATE INDEX idx_matches_buyer_id ON public.matches(buyer_id);
CREATE INDEX idx_matches_seller_id ON public.matches(seller_id);
CREATE INDEX idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_buyers_user_id ON public.buyers(user_id);
CREATE INDEX idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX idx_matches_vehicle_id ON public.matches(vehicle_id);
CREATE INDEX idx_transactions_vehicle_id ON public.transactions(vehicle_id);
