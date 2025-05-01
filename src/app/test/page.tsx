'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [dataStatus, setDataStatus] = useState<{
    customers: boolean;
    products: boolean;
    hotels: boolean;
    transport: boolean;
    invoices: boolean;
  }>({
    customers: false,
    products: false,
    hotels: false,
    transport: false,
    invoices: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean | null>(null);
  const [tableData, setTableData] = useState<Record<string, number>>({});

  useEffect(() => {
    async function checkSupabase() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if using mock data
        const mockStatus = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
        setUsingMockData(mockStatus);
        
        // Initialize status object
        const testStatus = {
          customers: false,
          products: false,
          hotels: false,
          transport: false,
          invoices: false,
        };
        
        // Initialize table counts object
        const tables: Record<string, number> = {};
        
        // Test each table
        for (const table of ['customers', 'products', 'hotels', 'transport', 'invoices']) {
          try {
            const { data, error } = await supabase.from(table).select('*');
            testStatus[table as keyof typeof testStatus] = !error;
            tables[table] = data?.length || 0;
          } catch (err) {
            console.error(`Error fetching ${table}:`, err);
          }
        }
        
        setDataStatus(testStatus);
        setTableData(tables);
      } catch (err) {
        setError('Error checking Supabase connection. See console for details.');
        console.error('Supabase test error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSupabase();
  }, []);

  const allAPIsWorking = Object.values(dataStatus).every(status => status);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Status</h1>
      
      {usingMockData ? (
        <div className="bg-yellow-100 p-4 mb-6 rounded-md border border-yellow-300">
          <p className="font-medium text-yellow-800">
            ⚠️ Using mock data mode. Data persists during your session but resets on page refresh.
          </p>
        </div>
      ) : (
        <div className="bg-green-100 p-4 mb-6 rounded-md border border-green-300">
          <p className="font-medium text-green-800">
            ✅ Connected to Supabase database. Any changes will persist in the database.
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-md border border-red-300 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Table Status</h2>
            <ul className="space-y-3">
              {Object.entries(dataStatus).map(([table, status]) => (
                <li key={table} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-block w-5 h-5 rounded-full mr-3 ${status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="capitalize">{table} Table: {status ? 'Connected' : 'Not Connected'}</span>
                  </div>
                  {status && (
                    <span className="text-gray-500">
                      {tableData[table] || 0} records found
                    </span>
                  )}
                </li>
              ))}
            </ul>
            
            <div className={`mt-6 p-4 rounded-md ${allAPIsWorking ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <p className={allAPIsWorking ? 'text-green-700' : 'text-red-700'}>
                {allAPIsWorking 
                  ? '✅ Supabase connection working for all tables!' 
                  : '❌ Some tables cannot be accessed. Check Supabase configuration.'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/hotels" 
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-md border border-blue-200 flex flex-col items-center justify-center"
              >
                <span className="text-lg font-medium">Hotels</span>
                <span className="text-sm text-blue-600 mt-1">Manage hotel information</span>
              </Link>
              
              <Link 
                href="/transport" 
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-md border border-blue-200 flex flex-col items-center justify-center"
              >
                <span className="text-lg font-medium">Transport</span>
                <span className="text-sm text-blue-600 mt-1">Manage transport options</span>
              </Link>
              
              <Link 
                href="/rates" 
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-md border border-blue-200 flex flex-col items-center justify-center"
              >
                <span className="text-lg font-medium">Rates</span>
                <span className="text-sm text-blue-600 mt-1">Calculate tour rates</span>
              </Link>
              
              <Link 
                href="/" 
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-md border border-blue-200 flex flex-col items-center justify-center"
              >
                <span className="text-lg font-medium">Dashboard</span>
                <span className="text-sm text-blue-600 mt-1">Return to main dashboard</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 