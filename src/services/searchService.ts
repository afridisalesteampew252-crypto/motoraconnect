import { supabase } from '../lib/supabase';

export interface SearchFilters {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  bodyType?: string;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: string;
  transmission?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Search vehicles with filters
 */
export async function searchVehicles(filters: SearchFilters): Promise<SearchResult> {
  try {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    // Start with base query
    let query = supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .eq('is_listed', true);

    // Apply filters
    if (filters.make) {
      query = query.ilike('make', `%${filters.make}%`);
    }

    if (filters.model) {
      query = query.ilike('model', `%${filters.model}%`);
    }

    if (filters.minYear) {
      query = query.gte('year', filters.minYear);
    }

    if (filters.maxYear) {
      query = query.lte('year', filters.maxYear);
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }

    if (filters.minMileage !== undefined) {
      query = query.gte('mileage', filters.minMileage);
    }

    if (filters.maxMileage !== undefined) {
      query = query.lte('mileage', filters.maxMileage);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'year_desc':
          query = query.order('year', { ascending: false });
          break;
        case 'mileage_asc':
          query = query.order('mileage', { ascending: true });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      vehicles: data || [],
      total: count || 0,
      page: Math.floor(offset / limit),
      pageSize: limit,
      hasMore: (offset + limit) < (count || 0),
    };
  } catch (error) {
    console.error('Error searching vehicles:', error);
    throw error;
  }
}

/**
 * Get vehicle by ID with details
 */
export async function getVehicleDetails(vehicleId: string) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select(
        `
        *,
        seller:user_id(
          id,
          email,
          full_name,
          phone
        )
      `
      )
      .eq('id', vehicleId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting vehicle details:', error);
    throw error;
  }
}

/**
 * Get featured vehicles
 */
export async function getFeaturedVehicles(limit: number = 6) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_listed', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting featured vehicles:', error);
    throw error;
  }
}

/**
 * Get similar vehicles
 */
export async function getSimilarVehicles(vehicleId: string, limit: number = 5) {
  try {
    // Get the target vehicle
    const { data: targetVehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (vehicleError) throw vehicleError;
    if (!targetVehicle) throw new Error('Vehicle not found');

    // Find similar vehicles (same make, similar year, similar price)
    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('is_listed', true)
      .ilike('make', targetVehicle.make)
      .neq('id', vehicleId);

    // Filter by price range (±20%)
    if (targetVehicle.price) {
      const minPrice = targetVehicle.price * 0.8;
      const maxPrice = targetVehicle.price * 1.2;
      query = query.gte('price', minPrice).lte('price', maxPrice);
    }

    // Filter by year range (±3 years)
    const minYear = targetVehicle.year - 3;
    const maxYear = targetVehicle.year + 3;
    query = query.gte('year', minYear).lte('year', maxYear);

    const { data, error } = await query
      .order('price', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting similar vehicles:', error);
    throw error;
  }
}

/**
 * Save buyer search for future matching
 */
export async function saveBuyerSearch(
  userId: string,
  filters: SearchFilters,
  searchName: string
) {
  try {
    const { data, error } = await supabase
      .from('vehicle_searches')
      .insert([
        {
          user_id: userId,
          make: filters.make,
          model: filters.model,
          min_year: filters.minYear,
          max_year: filters.maxYear,
          min_price: filters.minPrice,
          max_price: filters.maxPrice,
          condition: filters.condition,
          search_name: searchName,
          is_active: true,
          last_matched_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving buyer search:', error);
    throw error;
  }
}

/**
 * Get buyer's saved searches
 */
export async function getBuyerSearches(userId: string) {
  try {
    const { data, error } = await supabase
      .from('vehicle_searches')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_matched_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting buyer searches:', error);
    throw error;
  }
}
