import { createClient } from '@supabase/supabase-js';
import { GET, POST } from '../invoices/route';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

describe('Invoices API', () => {
  const mockInvoice = {
    id: '123',
    invoice_number: 'INV-2024-001',
    customer_id: 'cust-123',
    user_id: 'user-123',
    status: 'PENDING',
    total_amount: 1000.00,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    customer: {
      name: 'John Doe'
    },
    invoice_items: [
      {
        quantity: 1,
        unit_price: 1000.00,
        total_price: 1000.00,
        product: {
          name: 'Test E-Bike'
        }
      }
    ]
  };

  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(),
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('GET /api/invoices', () => {
    it('should return invoices successfully', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: [mockInvoice],
        error: null
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockInvoice]);
      expect(mockSupabase.from).toHaveBeenCalledWith('invoices');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        customer:customers(name),
        invoice_items(
          quantity,
          unit_price,
          total_price,
          product:products(name)
        )
      `);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should handle errors', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch invoices' });
    });
  });

  describe('POST /api/invoices', () => {
    const newInvoice = {
      customer_id: 'cust-123',
      items: [
        {
          product_id: 'prod-123',
          quantity: 1,
          unit_price: 1000.00
        }
      ]
    };

    it('should create an invoice successfully', async () => {
      // Mock count query for invoice number generation
      const mockCountSelect = jest.fn().mockReturnThis();
      const mockGte = jest.fn().mockReturnThis();
      const mockLte = jest.fn().mockReturnThis();
      const mockCountSingle = jest.fn().mockResolvedValue({
        data: { count: 0 },
        error: null
      });

      mockSupabase.from.mockReturnValueOnce({
        select: mockCountSelect,
        gte: mockGte,
        lte: mockLte,
        single: mockCountSingle
      });

      // Mock invoice creation
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockInvoice,
        error: null
      });

      mockSupabase.from.mockReturnValueOnce({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle
      });

      // Mock invoice items creation
      const mockItemsInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null
      });

      mockSupabase.from.mockReturnValueOnce({
        insert: mockItemsInsert
      });

      // Mock fetch full invoice
      const mockFinalSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockFinalSingle = jest.fn().mockResolvedValue({
        data: mockInvoice,
        error: null
      });

      mockSupabase.from.mockReturnValueOnce({
        select: mockFinalSelect,
        eq: mockEq,
        single: mockFinalSingle
      });

      const request = new Request('http://localhost/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockInvoice);
      expect(mockSupabase.from).toHaveBeenCalledWith('invoices');
      expect(mockCountSelect).toHaveBeenCalledWith('*', { count: 'exact' });
      expect(mockGte).toHaveBeenCalledWith('created_at', '2024-01-01');
      expect(mockLte).toHaveBeenCalledWith('created_at', '2024-12-31');
      expect(mockInsert).toHaveBeenCalled();
      expect(mockItemsInsert).toHaveBeenCalled();
      expect(mockFinalSelect).toHaveBeenCalledWith(`
        *,
        customer:customers(name),
        invoice_items(
          quantity,
          unit_price,
          total_price,
          product:products(name)
        )
      `);
    });

    it('should handle validation errors', async () => {
      const request = new Request('http://localhost/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid invoice data' });
    });
  });
}); 