'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TourDetailsPage() {
  const router = useRouter();
  const [tourDetails, setTourDetails] = useState({
    tourName: '',
    startDate: '',
    endDate: '',
    invoiceNumber: `INV-${Math.floor(Math.random() * 1000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tour Details:', tourDetails);
    router.push('/rider-info');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">New Invoice</h1>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">1</div>
          <span className="ml-2 font-medium">Tour Details</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex items-center text-gray-400">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">2</div>
          <span className="ml-2">Rider Info</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex items-center text-gray-400">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">3</div>
          <span className="ml-2">Rates</span>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="flex items-center text-gray-400">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">4</div>
          <span className="ml-2">Preview</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tour Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tour Name
              </label>
              <input
                type="text"
                required
                value={tourDetails.tourName}
                onChange={(e) => setTourDetails({...tourDetails, tourName: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="E.g. Tanzania E-Bike Adventure"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                required
                value={tourDetails.invoiceNumber}
                onChange={(e) => setTourDetails({...tourDetails, invoiceNumber: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={tourDetails.startDate}
                onChange={(e) => setTourDetails({...tourDetails, startDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={tourDetails.endDate}
                onChange={(e) => setTourDetails({...tourDetails, endDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                required
                value={tourDetails.invoiceDate}
                onChange={(e) => setTourDetails({...tourDetails, invoiceDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Next: Rider Information
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 