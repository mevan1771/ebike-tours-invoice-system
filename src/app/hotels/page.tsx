'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Hotel } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    stars: 3,
    single_room_rate: 0,
    double_room_rate: 0,
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    setIsLoading(true);
    try {
      console.log('Fetching hotels from Supabase...');
      const { data, error } = await supabase.from('hotels').select('*');
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        throw error;
      }
      
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to load hotels');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newHotel = {
        name: formData.name,
        location: formData.location, 
        stars: formData.stars,
        single_room_rate: formData.single_room_rate,
        double_room_rate: formData.double_room_rate,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null
      };

      console.log('Inserting new hotel:', newHotel);
      
      const { data, error } = await supabase
        .from('hotels')
        .insert([newHotel])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Hotel added successfully');
      setFormData({
        name: '',
        location: '',
        stars: 3,
        single_room_rate: 0,
        double_room_rate: 0,
        contact_email: '',
        contact_phone: ''
      });
      fetchHotels();
    } catch (error) {
      console.error('Error adding hotel:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add hotel');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      console.log('Deleting hotel with ID:', id);
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Hotel deleted successfully');
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-100 p-4 mb-6 rounded-md border border-green-300">
        <p className="font-medium text-green-800">
          ✅ Connected to Supabase database. Any changes will persist in the database.
        </p>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Hotel Management</h1>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Hotel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Grand Hotel"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Paris, France"
                  />
                </div>

                <div>
                  <label htmlFor="stars" className="block text-sm font-medium text-gray-700 mb-1">
                    Star Rating
                  </label>
                  <select
                    id="stars"
                    name="stars"
                    value={formData.stars}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="single_room_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Single Room Rate ($ per night)
                  </label>
                  <input
                    type="number"
                    id="single_room_rate"
                    name="single_room_rate"
                    value={formData.single_room_rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="double_room_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Double Room Rate ($ per night)
                  </label>
                  <input
                    type="number"
                    id="double_room_rate"
                    name="double_room_rate"
                    value={formData.double_room_rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contact@hotel.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Hotel
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Hotels ({hotels.length})</h2>
            {hotels.length === 0 ? (
              <p className="text-gray-500">No hotels available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Single Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Double Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hotels.map((hotel) => (
                      <tr key={hotel.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{hotel.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{'⭐'.repeat(hotel.stars)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${hotel.single_room_rate.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${hotel.double_room_rate.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {hotel.contact_email && (
                            <div className="text-sm">{hotel.contact_email}</div>
                          )}
                          {hotel.contact_phone && (
                            <div className="text-sm">{hotel.contact_phone}</div>
                          )}
                          {!hotel.contact_email && !hotel.contact_phone && '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(hotel.id)}
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