'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    async function checkAPIs() {
      setIsLoading(true);
      setError(null);
      
      const testStatus = {
        customers: false,
        products: false,
        hotels: false,
        transport: false,
        invoices: false,
      };
      
      try {
        // Test customers API
        const customersResponse = await fetch('/api/customers');
        testStatus.customers = customersResponse.ok;
        
        // Test products API
        const productsResponse = await fetch('/api/products');
        testStatus.products = productsResponse.ok;
        
        // Test hotels API
        const hotelsResponse = await fetch('/api/hotels');
        testStatus.hotels = hotelsResponse.ok;
        
        // Test transport API
        const transportResponse = await fetch('/api/transport');
        testStatus.transport = transportResponse.ok;
        
        // Test invoices API
        const invoicesResponse = await fetch('/api/invoices');
        testStatus.invoices = invoicesResponse.ok;
        
        setDataStatus(testStatus);
      } catch (err) {
        setError('Error checking API endpoints. See console for details.');
        console.error('API test error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAPIs();
  }, []);

  const allAPIsWorking = Object.values(dataStatus).every(status => status);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mock Data Status</h1>
      
      <div className="bg-yellow-100 p-4 mb-6 rounded-md border border-yellow-300">
        <p className="font-medium text-yellow-800">
          ⚠️ This app is using mock data which persists during your session but resets on page refresh.
          No database connection is required for deployment.
        </p>
      </div>
      
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
            <h2 className="text-xl font-semibold mb-4">API Status</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className={`inline-block w-5 h-5 rounded-full mr-3 ${dataStatus.customers ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Customers API: {dataStatus.customers ? 'Working' : 'Not Working'}</span>
              </li>
              <li className="flex items-center">
                <span className={`inline-block w-5 h-5 rounded-full mr-3 ${dataStatus.products ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Products API: {dataStatus.products ? 'Working' : 'Not Working'}</span>
              </li>
              <li className="flex items-center">
                <span className={`inline-block w-5 h-5 rounded-full mr-3 ${dataStatus.hotels ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Hotels API: {dataStatus.hotels ? 'Working' : 'Not Working'}</span>
              </li>
              <li className="flex items-center">
                <span className={`inline-block w-5 h-5 rounded-full mr-3 ${dataStatus.transport ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Transport API: {dataStatus.transport ? 'Working' : 'Not Working'}</span>
              </li>
              <li className="flex items-center">
                <span className={`inline-block w-5 h-5 rounded-full mr-3 ${dataStatus.invoices ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Invoices API: {dataStatus.invoices ? 'Working' : 'Not Working'}</span>
              </li>
            </ul>
            
            <div className={`mt-6 p-4 rounded-md ${allAPIsWorking ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <p className={allAPIsWorking ? 'text-green-700' : 'text-red-700'}>
                {allAPIsWorking 
                  ? '✅ All APIs are working correctly with mock data!' 
                  : '❌ Some APIs are not working correctly. Check implementation.'}
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