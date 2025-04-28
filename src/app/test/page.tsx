'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [anonKey, setAnonKey] = useState<string>('');

  useEffect(() => {
    // Show environment variables (safe to display in development)
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
    setAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set');
    
    async function testConnection() {
      try {
        setLoading(true);
        // Test with a simple query
        const { data: testData, error: testError } = await supabase
          .from('hotels')
          .select('*')
          .limit(1);
        
        if (testError) {
          throw testError;
        }
        
        setData(testData);
      } catch (err: any) {
        console.error('Test connection error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {anonKey}</p>
      </div>
      
      {loading ? (
        <div className="text-blue-600">Testing connection...</div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          <h2 className="font-bold">Success!</h2>
          <p>Connected to Supabase successfully</p>
          <pre className="mt-4 p-2 bg-white rounded border overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <button 
          onClick={() => window.location.href = '/transport'} 
          className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
        >
          Go to Transport Page
        </button>
        <button 
          onClick={() => window.location.href = '/'} 
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
} 