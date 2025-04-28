import { createClient } from '@supabase/supabase-js';
import { GET, POST } from '../products/route';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

describe('Products API', () => {
  const mockProduct = {
    id: '123',
    name: 'Test E-Bike',
    description: 'A test e-bike',
    price: 1999.99,
    stock: 10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(),
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('GET /api/products', () => {
    it('should return products successfully', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: [mockProduct],
        error: null
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockProduct]);
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('name');
    });

    it('should handle database errors', async () => {
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
      expect(data).toEqual({ error: 'Failed to fetch products' });
    });
  });

  describe('POST /api/products', () => {
    it('should create a product successfully', async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockProduct,
        error: null
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle
      });

      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          stock: mockProduct.stock,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockProduct);
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockInsert).toHaveBeenCalledWith([{
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        stock: mockProduct.stock,
      }]);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Name and price are required' });
    });

    it('should handle database errors', async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle
      });

      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mockProduct.name,
          price: mockProduct.price,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create product' });
    });
  });
}); 