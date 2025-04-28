'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Invoices</h3>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
          <p className="text-3xl font-bold mt-2">€0.00</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Rentals</h3>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">Currently ongoing</p>
        </div>
      </div>
      
      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Recent Invoices</h2>
        </div>
        <div className="border-t">
          <div className="p-6 text-center text-gray-500">
            No invoices found. Create your first invoice to get started.
          </div>
        </div>
      </div>
    </div>
  );
}
