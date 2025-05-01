import { createClient } from '@supabase/supabase-js';
import { mockAPI } from './mockData';

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbpqzaagbtxpnwbbrttk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicHF6YWFnYnR4cG53YmJydHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjAxNzQsImV4cCI6MjA2MDk5NjE3NH0.mXvP-EsGTLbS7k_Aro1oIiNmw14bk3A0A-1WglM2KxM';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Create real Supabase client
const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback mock implementation for development/demo
const mockSupabase = {
  from: (table: string) => {
    return {
      select: (query?: string) => {
        // Map table names to their corresponding mock API functions
        const tableActions: Record<string, () => Promise<any>> = {
          'customers': mockAPI.getCustomers,
          'products': mockAPI.getProducts,
          'invoices': mockAPI.getInvoices,
          'invoice_items': mockAPI.getInvoiceItems,
          'hotels': mockAPI.getHotels,
          'transport': mockAPI.getTransports
        };

        // Return a structure similar to Supabase response
        return {
          eq: () => ({
            single: async () => {
              // This is a simplified implementation
              const data = await tableActions[table]();
              return { data: data[0], error: null };
            }
          }),
          order: () => ({
            then: async (callback: (result: { data: any[], error: null }) => void) => {
              const data = await tableActions[table]();
              callback({ data, error: null });
              return { data, error: null };
            }
          }),
          limit: () => ({
            then: async (callback: (result: { data: any[], error: null }) => void) => {
              const data = await tableActions[table]();
              callback({ data: data.slice(0, 1), error: null });
              return { data: data.slice(0, 1), error: null };
            }
          }),
          then: async (callback: (result: { data: any[], error: null }) => void) => {
            const data = await tableActions[table]();
            callback({ data, error: null });
            return { data, error: null };
          }
        };
      },
      insert: (items: any[]) => {
        // Map table names to their corresponding mock API create functions
        const createFunctions: Record<string, (item: any) => Promise<any>> = {
          'customers': mockAPI.createCustomer,
          'products': mockAPI.createProduct,
          'invoices': mockAPI.createInvoice,
          'invoice_items': mockAPI.createInvoiceItem,
          'hotels': mockAPI.createHotel,
          'transport': mockAPI.createTransport
        };

        // Return a structure similar to Supabase response
        return {
          select: () => ({
            single: async () => {
              const item = items[0];
              const data = await createFunctions[table](item);
              return { data, error: null };
            },
            then: async (callback: (result: { data: any[], error: null }) => void) => {
              const results = await Promise.all(items.map(item => createFunctions[table](item)));
              callback({ data: results, error: null });
              return { data: results, error: null };
            }
          })
        };
      },
      delete: () => ({
        eq: (field: string, value: string) => ({
          then: async (callback: (result: { error: null }) => void) => {
            if (field === 'id') {
              const deleteFunctions: Record<string, (id: string) => Promise<any>> = {
                'customers': mockAPI.deleteCustomer,
                'products': mockAPI.deleteProduct,
                'invoices': mockAPI.deleteInvoice,
                'invoice_items': mockAPI.deleteInvoiceItem,
                'hotels': mockAPI.deleteHotel,
                'transport': mockAPI.deleteTransport
              };
              
              await deleteFunctions[table](value);
              callback({ error: null });
              return { error: null };
            }
            return { error: new Error('Delete operation not implemented') };
          }
        })
      })
    };
  }
};

// Export the appropriate Supabase client
export const supabase = useMockData ? mockSupabase : realSupabase; 