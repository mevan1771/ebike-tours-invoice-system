import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GET, POST } from '../customers/route';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

describe('Customers API', () => {
  const mockCustomer = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
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

  describe('GET /api/customers', () => {
    it('should return customers successfully', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: [mockCustomer],
        error: null
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockCustomer]);
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
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
      expect(data).toEqual({ error: 'Failed to fetch customers' });
    });
  });

  describe('POST /api/customers', () => {
    it('should create a customer successfully', async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockCustomer,
        error: null
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle
      });

      const request = new Request('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mockCustomer.name,
          email: mockCustomer.email,
          phone: mockCustomer.phone,
          address: mockCustomer.address,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockCustomer);
      expect(mockSupabase.from).toHaveBeenCalledWith('customers');
      expect(mockInsert).toHaveBeenCalledWith([{
        name: mockCustomer.name,
        email: mockCustomer.email,
        phone: mockCustomer.phone,
        address: mockCustomer.address,
      }]);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const request = new Request('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Name and email are required' });
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

      const request = new Request('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mockCustomer.name,
          email: mockCustomer.email,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create customer' });
    });
  });
}); 