// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

// Create a mock Supabase client that can be configured per test
const mockSupabaseResponse = {
  data: null,
  error: null
};

const createMockQueryBuilder = () => {
  const queryBuilder = {
    select: jest.fn(() => queryBuilder),
    insert: jest.fn(() => queryBuilder),
    update: jest.fn(() => queryBuilder),
    delete: jest.fn(() => queryBuilder),
    eq: jest.fn(() => queryBuilder),
    neq: jest.fn(() => queryBuilder),
    gt: jest.fn(() => queryBuilder),
    gte: jest.fn(() => queryBuilder),
    lt: jest.fn(() => queryBuilder),
    lte: jest.fn(() => queryBuilder),
    order: jest.fn(() => queryBuilder),
    single: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    then: jest.fn((callback) => Promise.resolve(callback(mockSupabaseResponse))),
  };
  return queryBuilder;
};

const mockSupabaseClient = {
  from: jest.fn(() => createMockQueryBuilder()),
  auth: {
    signUp: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    signIn: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    signOut: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
  },
};

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

// Export the mock response and client for use in tests
global.mockSupabaseResponse = mockSupabaseResponse;
global.mockSupabaseClient = mockSupabaseClient; 