'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  single_room_rate: number;
  double_room_rate: number;
}

interface DailyHotel {
  date: string;
  hotelId: string;
}

interface Transport {
  id: string;
  name: string;
  type: string;
  capacity: number;
  rate_per_day: number;
  description?: string;
}

// Currency conversion rates (as of a recent date)
const CURRENCY_RATES = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  LKR: 312.50
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  LKR: 'Rs.'
};

export default function RatesPage() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tourDates, setTourDates] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<DailyHotel[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [selectedTransport, setSelectedTransport] = useState('');
  const [transportDays, setTransportDays] = useState(1);
  const [rates, setRates] = useState({
    // Bike Rental Rates
    bikeRentalDaily: 50,
    numberOfBikes: 1,
    numberOfDays: 0,
    
    // Additional Services
    tourGuideRate: 200,
    supportVehicle: 150,
    equipmentRental: 30,
    
    // Insurance and Extras
    insurancePerPerson: 15,
    extraServices: [
      { name: 'Airport Transfer', rate: 50, selected: false },
      { name: 'Bike Maintenance Package', rate: 30, selected: false },
      { name: 'GPS Rental', rate: 10, selected: false },
      { name: 'Welcome Package', rate: 25, selected: false }
    ]
  });

  useEffect(() => {
    fetchHotels();
    fetchTransports();
    // Add the first day automatically
    addNewDay();
  }, []);

  async function fetchHotels() {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('name');

      if (error) throw error;
      setHotels(data || []);
      
      // Initialize selected hotels with first hotel as default
      if (data && data.length > 0) {
        const initialHotels = tourDates.map(date => ({
          date,
          hotelId: data[0].id
        }));
        setSelectedHotels(initialHotels);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTransports() {
    try {
      const { data, error } = await supabase
        .from('transport')
        .select('*')
        .order('name');

      if (error) throw error;
      setTransports(data || []);
    } catch (error) {
      console.error('Error fetching transport options:', error);
    }
  }

  const addNewDay = () => {
    let newDate;
    if (selectedHotels.length === 0) {
      // If no days exist yet, start with today
      newDate = new Date().toISOString().split('T')[0];
    } else {
      // Get the last day and add one day to it
      const lastDay = selectedHotels[selectedHotels.length - 1];
      const lastDate = new Date(lastDay.date);
      lastDate.setDate(lastDate.getDate() + 1);
      newDate = lastDate.toISOString().split('T')[0];
    }
    
    setSelectedHotels(prev => [...prev, { date: newDate, hotelId: '' }]);
    setRates(prev => ({ ...prev, numberOfDays: prev.numberOfDays + 1 }));
  };

  const removeDay = (index: number) => {
    if (selectedHotels.length > 1) {
      setSelectedHotels(prev => prev.filter((_, i) => i !== index));
      setRates(prev => ({ ...prev, numberOfDays: prev.numberOfDays - 1 }));
    }
  };

  const generateTourDates = (startDate: Date, endDate: Date) => {
    const dates: string[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setTourDates(dates);
    setRates(prev => ({ ...prev, numberOfDays: dates.length }));
  };

  const handleHotelChange = (date: string, hotelId: string) => {
    setSelectedHotels(prev => {
      const existing = prev.find(h => h.date === date);
      if (existing) {
        return prev.map(h => h.date === date ? { ...h, hotelId } : h);
      }
      return [...prev, { date, hotelId }];
    });
  };

  const getHotelRates = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? {
      single: hotel.single_room_rate,
      double: hotel.double_room_rate
    } : { single: 0, double: 0 };
  };

  const formatCurrency = (amount: number, skipConversion = false) => {
    const symbol = CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS];
    const convertedAmount = skipConversion ? amount : convertAmount(amount);
    return `${symbol}${convertedAmount.toFixed(2)}`;
  };

  const calculateAccommodationTotal = () => {
    return selectedHotels.reduce((total, dailyHotel) => {
      const rates = getHotelRates(dailyHotel.hotelId);
      return total + rates.single + rates.double;
    }, 0);
  };

  const convertAmount = (amount: number) => {
    return (amount * CURRENCY_RATES[selectedCurrency as keyof typeof CURRENCY_RATES]);
  };

  const calculateTotal = () => {
    const bikeTotal = rates.bikeRentalDaily * rates.numberOfBikes * rates.numberOfDays;
    const accommodationTotal = calculateAccommodationTotal();
    const servicesTotal = rates.tourGuideRate + rates.supportVehicle + rates.equipmentRental;
    const insuranceTotal = rates.insurancePerPerson * rates.numberOfBikes;
    const extrasTotal = rates.extraServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.rate, 0);
    
    // Add transport total to the calculation
    const transportTotal = calculateTransportTotal();

    return bikeTotal + accommodationTotal + servicesTotal + insuranceTotal + extrasTotal + transportTotal;
  };

  const calculateTransportTotal = () => {
    if (!selectedTransport) return 0;
    
    const transport = transports.find(t => t.id === selectedTransport);
    if (!transport) return 0;
    
    return transport.rate_per_day * transportDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rates:', rates);
    console.log('Selected Hotels:', selectedHotels);
    console.log('Total:', calculateTotal());
    router.push('/preview');
  };

  const toggleExtraService = (index: number) => {
    const updatedServices = [...rates.extraServices];
    updatedServices[index] = {
      ...updatedServices[index],
      selected: !updatedServices[index].selected
    };
    setRates({ ...rates, extraServices: updatedServices });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
          <Link href="/rider-info" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">2</div>
            <span>Group Details</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">3</div>
          <span className="font-medium">Rates</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">4</div>
          <span>Preview</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Currency Selector */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Select Currency</h2>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD (US Dollar)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="LKR">LKR (Sri Lankan Rupee)</option>
            </select>
          </div>
        </div>

        {/* Accommodation Selection */}
        <div className="bg-white rounded-lg border p-6 space-y-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Accommodation Selection</h2>
            <button
              type="button"
              onClick={addNewDay}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Day
            </button>
          </div>
          <div className="space-y-4">
            {selectedHotels.map((hotel, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-700 font-medium">
                  Day {index + 1}: {new Date(hotel.date).toLocaleDateString()}
                </div>
                <div className="md:col-span-2">
                  <select
                    value={hotel.hotelId}
                    onChange={(e) => handleHotelChange(hotel.date, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} - {h.location} ({h.stars}★)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    {hotel.hotelId && (
                      <>
                        Single: {formatCurrency(getHotelRates(hotel.hotelId).single, true)}<br />
                        Double: {formatCurrency(getHotelRates(hotel.hotelId).double, true)}
                      </>
                    )}
                  </div>
                  {selectedHotels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Remove day"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-right font-semibold mt-4">
            Total Accommodation: {formatCurrency(calculateAccommodationTotal(), true)}
          </div>
        </div>

        {/* Bike Rental Rates */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Bike Rental Rates</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate per Bike ({CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS]})
              </label>
              <input
                type="number"
                min="0"
                value={rates.bikeRentalDaily}
                onChange={(e) => setRates({...rates, bikeRentalDaily: parseFloat(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Bikes
              </label>
              <input
                type="number"
                min="1"
                value={rates.numberOfBikes}
                onChange={(e) => setRates({...rates, numberOfBikes: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                value={rates.numberOfDays}
                onChange={(e) => setRates({...rates, numberOfDays: parseInt(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Transport Section */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Transport Options</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Transport
              </label>
              <select
                value={selectedTransport}
                onChange={(e) => setSelectedTransport(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No transport needed</option>
                {transports.map(transport => (
                  <option key={transport.id} value={transport.id}>
                    {transport.name} - {transport.type} ({transport.capacity} persons) - {formatCurrency(transport.rate_per_day, true)}/day
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                value={transportDays}
                onChange={(e) => setTransportDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!selectedTransport}
              />
            </div>
          </div>
          
          {selectedTransport && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  {transports.find(t => t.id === selectedTransport)?.name} - 
                  {transports.find(t => t.id === selectedTransport)?.type} •
                  Capacity: {transports.find(t => t.id === selectedTransport)?.capacity} persons
                  {transports.find(t => t.id === selectedTransport)?.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {transports.find(t => t.id === selectedTransport)?.description}
                    </p>
                  )}
                </div>
                <div className="text-lg font-semibold">
                  Transport Total: {formatCurrency(calculateTransportTotal(), true)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Additional Services</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tour Guide Rate
              </label>
              <input
                type="number"
                min="0"
                value={rates.tourGuideRate}
                onChange={(e) => setRates({...rates, tourGuideRate: parseFloat(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Vehicle
              </label>
              <input
                type="number"
                min="0"
                value={rates.supportVehicle}
                onChange={(e) => setRates({...rates, supportVehicle: parseFloat(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Rental
              </label>
              <input
                type="number"
                min="0"
                value={rates.equipmentRental}
                onChange={(e) => setRates({...rates, equipmentRental: parseFloat(e.target.value)})}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Insurance and Extras */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Insurance and Extras</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Rate per Person
            </label>
            <input
              type="number"
              min="0"
              value={rates.insurancePerPerson}
              onChange={(e) => setRates({...rates, insurancePerPerson: parseFloat(e.target.value)})}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Optional Services</h3>
            <div className="grid grid-cols-2 gap-4">
              {rates.extraServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-500">{formatCurrency(service.rate, true)}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.selected}
                      onChange={() => toggleExtraService(index)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between text-xl font-semibold">
            <span>Total Amount:</span>
            <span>{formatCurrency(calculateTotal(), true)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/rider-info"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Next: Preview
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </main>
  );
} 