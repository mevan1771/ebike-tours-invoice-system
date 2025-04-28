'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RiderInfoPage() {
  const router = useRouter();
  const [groupInfo, setGroupInfo] = useState({
    numberOfRiders: 1,
    singleRooms: 0,
    doubleRooms: 1,
    tourLeaderName: '',
    tourLeaderDiscount: 0,
    additionalRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Group Info:', groupInfo);
    router.push('/rates');
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img 
            src="/images/logo.jpg" 
            alt="E-Bike Tours" 
            className="w-24 h-24 object-cover rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">E-Bike Tour Invoice Generator</h1>
            <p className="text-gray-600">Create professional invoices for your e-bike tours</p>
          </div>
        </div>
        <Link 
          href="/invoices"
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <span className="text-lg">☰</span>
          View All Invoices
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 text-gray-400">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">1</div>
            <span>Tour Details</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">2</div>
          <span className="font-medium">Group Details</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">3</div>
          <span>Rates</span>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">4</div>
          <span>Preview</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Group Size & Accommodation</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Riders
              </label>
              <input
                type="number"
                min="1"
                value={groupInfo.numberOfRiders}
                onChange={(e) => setGroupInfo({...groupInfo, numberOfRiders: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Single Rooms Required
              </label>
              <input
                type="number"
                min="0"
                value={groupInfo.singleRooms}
                onChange={(e) => setGroupInfo({...groupInfo, singleRooms: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Double Rooms Required
              </label>
              <input
                type="number"
                min="0"
                value={groupInfo.doubleRooms}
                onChange={(e) => setGroupInfo({...groupInfo, doubleRooms: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tour Leader Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={groupInfo.tourLeaderDiscount}
                onChange={(e) => setGroupInfo({...groupInfo, tourLeaderDiscount: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Tour Leader Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tour Leader Name
            </label>
            <input
              type="text"
              value={groupInfo.tourLeaderName}
              onChange={(e) => setGroupInfo({...groupInfo, tourLeaderName: e.target.value})}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tour leader's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Requests or Notes
            </label>
            <textarea
              value={groupInfo.additionalRequests}
              onChange={(e) => setGroupInfo({...groupInfo, additionalRequests: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any special requirements or notes about the group"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            href="/"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <span>←</span>
            Back to Tour Details
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            Next: Rates
            <span>→</span>
          </button>
        </div>
      </form>
    </main>
  );
} 