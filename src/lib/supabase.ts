import { mockAPI } from './mockData';

// Placeholder Supabase client for Vercel deployment
// This will be replaced with a real Supabase client when needed
export const supabase = {
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