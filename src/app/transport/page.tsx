'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Transport } from '@/lib/mockData';

export default function TransportPage() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'van',
    capacity: 1,
    rate_per_day: 0,
    description: ''
  });

  useEffect(() => {
    fetchTransports();
  }, []);

  async function fetchTransports() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transport');
      if (!response.ok) {
        throw new Error('Failed to fetch transports');
      }
      const data = await response.json();
      setTransports(data);
    } catch (error) {
      console.error('Error fetching transports:', error);
      toast.error('Failed to load transport options');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/transport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transport option');
      }

      toast.success('Transport option added successfully');
      setFormData({
        name: '',
        type: 'van',
        capacity: 1,
        rate_per_day: 0,
        description: ''
      });
      fetchTransports();
    } catch (error) {
      console.error('Error adding transport:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add transport option');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this transport option?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transport?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transport option');
      }

      toast.success('Transport option deleted successfully');
      fetchTransports();
    } catch (error) {
      console.error('Error deleting transport:', error);
      toast.error('Failed to delete transport option');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-100 p-4 mb-6 rounded-md border border-yellow-300">
        <p className="font-medium text-yellow-800">
          ⚠️ Using mock data: Information will persist during your session but will reset on page refresh.
        </p>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Transport Management</h1>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Transport Option</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Executive Van"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                    <option value="car">Car</option>
                    <option value="boat">Boat</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (people)
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="rate_per_day" className="block text-sm font-medium text-gray-700 mb-1">
                    Rate Per Day ($)
                  </label>
                  <input
                    type="number"
                    id="rate_per_day"
                    name="rate_per_day"
                    value={formData.rate_per_day}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional description of the vehicle"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Transport Option
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Transport Options</h2>
            {transports.length === 0 ? (
              <p className="text-gray-500">No transport options available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate/Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transports.map((transport) => (
                      <tr key={transport.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{transport.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{transport.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{transport.capacity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${transport.rate_per_day.toFixed(2)}</td>
                        <td className="px-6 py-4">{transport.description || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(transport.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}