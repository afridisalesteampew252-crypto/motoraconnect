export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          country?: string | null
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          tier?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
        }
      }
      vehicles: {
        Row: {
          id: string
          vin: string
          make: string | null
          model: string | null
          year: number | null
          price: number | null
          mileage: number | null
          condition: string | null
          auction_source: string | null
          preview_url: string | null
          data_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          vin: string
          make?: string | null
          model?: string | null
          year?: number | null
          price?: number | null
          mileage?: number | null
          condition?: string | null
          auction_source?: string | null
          preview_url?: string | null
          data_json?: Json | null
          created_at?: string
        }
        Update: {
          make?: string | null
          model?: string | null
          year?: number | null
          price?: number | null
          mileage?: number | null
          condition?: string | null
          auction_source?: string | null
          preview_url?: string | null
          data_json?: Json | null
        }
      }
      vehicle_searches: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          search_params: Json | null
          notes: string | null
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          search_params?: Json | null
          notes?: string | null
          saved_at?: string
        }
        Update: {
          search_params?: Json | null
          notes?: string | null
        }
      }
      buyers: {
        Row: {
          id: string
          user_id: string
          location: string | null
          country: string | null
          budget_min: number | null
          budget_max: number | null
          preferred_vehicles: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location?: string | null
          country?: string | null
          budget_min?: number | null
          budget_max?: number | null
          preferred_vehicles?: Json | null
          created_at?: string
        }
        Update: {
          location?: string | null
          country?: string | null
          budget_min?: number | null
          budget_max?: number | null
          preferred_vehicles?: Json | null
        }
      }
      sellers: {
        Row: {
          id: string
          user_id: string
          location: string | null
          country: string | null
          company_name: string | null
          inventory_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location?: string | null
          country?: string | null
          company_name?: string | null
          inventory_count?: number
          created_at?: string
        }
        Update: {
          location?: string | null
          country?: string | null
          company_name?: string | null
          inventory_count?: number
        }
      }
      matches: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          vehicle_id: string
          match_score: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          seller_id: string
          vehicle_id: string
          match_score?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          match_score?: number | null
          status?: string
        }
      }
      transactions: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          vehicle_id: string
          amount: number
          commission_percent: number
          commission_amount: number | null
          status: string
          stripe_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          seller_id: string
          vehicle_id: string
          amount: number
          commission_percent?: number
          commission_amount?: number | null
          status?: string
          stripe_payment_id?: string | null
          created_at?: string
        }
        Update: {
          amount?: number
          commission_percent?: number
          commission_amount?: number | null
          status?: string
          stripe_payment_id?: string | null
        }
      }
    }
  }
}
