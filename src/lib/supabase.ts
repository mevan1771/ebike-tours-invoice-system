import { createClient } from '@supabase/supabase-js';

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Use placeholder values during build if environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock Supabase client for build/testing
export const getMockData = (table: string) => {
  const mockData = {
    hotels: [
      { id: '1', name: 'Grand Hotel', location: 'City Center', stars: 4, single_room_rate: 120, double_room_rate: 180 },
      { id: '2', name: 'Mountain Lodge', location: 'Alps', stars: 3, single_room_rate: 90, double_room_rate: 140 },
    ],
    transport: [
      { id: '1', name: 'Luxury Bus', type: 'Bus', capacity: 40, rate_per_day: 450, description: 'Air-conditioned luxury coach' },
      { id: '2', name: 'Van', type: 'Van', capacity: 8, rate_per_day: 180, description: 'Support vehicle for equipment' },
    ],
    customers: [
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    ],
    invoices: [
      { id: '1', invoice_number: 'INV-2025-001', status: 'PENDING', customer_id: '1', total_amount: 1250 },
    ],
    invoice_items: [
      { id: '1', invoice_id: '1', product_id: '1', description: 'Tour Package', quantity: 1, unit_price: 1250, total_price: 1250 },
    ],
  };
  
  return mockData[table as keyof typeof mockData] || [];
};

// Wrapper functions to handle both real and mock data
export const fetchData = async (table: string, options = {}) => {
  if (useMockData) {
    return { data: getMockData(table), error: null };
  }
  
  try {
    return await supabase.from(table).select().order('created_at', { ascending: false });
  } catch (error) {
    console.error(`Error fetching from ${table}:`, error);
    return { data: null, error };
  }
}; 