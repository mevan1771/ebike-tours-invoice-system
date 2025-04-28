'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Transport {
  id: string;
  name: string;
  type: string;
  capacity: number;
  rate_per_day: number;
  description: string;
}

export default function TransportPage() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    rate_per_day: '',
    description: ''
  });

  useEffect(() => {
    console.log('TransportPage component mounted');
    fetchTransports();
  }, []);

  async function fetchTransports() {
    console.log('Fetching transports...');
    try {
      const { data, error } = await supabase
        .from('transport')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setTransports(data || []);
      console.log('Transports loaded:', data);
    } catch (error) {
      console.error('Error fetching transport:', error);
      toast.error('Failed to load transport options');
    } finally {
      setIsLoading(false);
      console.log('Loading state set to false');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transport')
        .insert([{
          name: formData.name,
          type: formData.type,
          capacity: parseInt(formData.capacity),
          rate_per_day: parseFloat(formData.rate_per_day),
          description: formData.description
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success('Transport option added successfully');
      setFormData({
        name: '',
        type: '',
        capacity: '',
        rate_per_day: '',
        description: ''
      });
      
      // Refresh the transport list
      fetchTransports();
    } catch (error) {
      console.error('Error adding transport:', error);
      toast.error('Failed to add transport option');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('transport')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransports(transports.filter(t => t.id !== id));
      toast.success('Transport option deleted successfully');
    } catch (error) {
      console.error('Error deleting transport:', error);
      toast.error('Failed to delete transport option');
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transport Management</h1>
          <p className="text-gray-600">Add and manage transport options for tours</p>
        </div>
      </div>

      {/* Add Transport Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Transport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Toyota Hiace"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Minibus">Minibus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (persons)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate per Day
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.rate_per_day}
              onChange={(e) => setFormData({...formData, rate_per_day: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter vehicle description, features, etc."
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Transport
          </button>
        </div>
      </form>

      {/* Transport List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Transport Options</h2>
          <div className="space-y-4">
            {transports.map(transport => (
              <div
                key={transport.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{transport.name}</h3>
                  <p className="text-sm text-gray-600">
                    {transport.type} • Capacity: {transport.capacity} persons • 
                    Rate: €{transport.rate_per_day}/day
                  </p>
                  {transport.description && (
                    <p className="text-sm text-gray-500 mt-1">{transport.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(transport.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {transports.length === 0 && (
              <p className="text-center text-gray-500 py-4">No transport options available</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 