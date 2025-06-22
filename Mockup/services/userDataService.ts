import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  risk_level?: number | null;
  date_of_birth?: string;
  city?: string;
  zip_code?: string;
  created_at?: string;
  avatar_url?: string | null;
  membership_level?: string | null;
  total_orders?: number;
  favorite_items?: number;
}

export const upsertUserData = async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...userData }, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting user data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in upsertUserData:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

export const getUserStats = async (userId: string): Promise<{ totalOrders: number; favoriteItems: number }> => {
  try {
    // Get total orders count
    const { count: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (ordersError) {
      console.error('Error fetching orders count:', ordersError);
    }

    // Get favorite items count
    const { count: favoritesCount, error: favoritesError } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (favoritesError) {
      console.error('Error fetching favorites count:', favoritesError);
    }

    return {
      totalOrders: ordersCount || 0,
      favoriteItems: favoritesCount || 0
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return { totalOrders: 0, favoriteItems: 0 };
  }
}; 