'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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

// Mock data for demonstration - in a real app, this would come from state management or API
const mockTourData = {
  tourName: 'E-Bike Safari Adventure',
  invoiceNumber: 'INV-752',
  startDate: '2023-07-15',
  endDate: '2023-07-20',
  invoiceDate: '2023-07-01',
  
  groupInfo: {
    numberOfRiders: 4,
    singleRooms: 2,
    doubleRooms: 1,
    tourLeaderName: 'John Smith',
    tourLeaderEmail: 'john.smith@example.com',
    tourLeaderPhone: '+1-555-123-4567',
    tourLeaderDiscount: 10,
    additionalRequests: 'Extra water bottles for all riders'
  },
  
  rates: {
    bikeRentalDaily: 50,
    numberOfBikes: 4,
    numberOfDays: 6,
    
    selectedTransport: {
      name: 'Luxury Van',
      type: 'Van',
      capacity: 8,
      rate_per_day: 120
    },
    transportDays: 6,
    
    tourGuideRate: 200,
    supportVehicle: 150,
    equipmentRental: 30,
    
    insurancePerPerson: 15,
    travelInsurance: 25,
    equipmentInsurance: 15,
    
    extraServices: [
      { name: 'Airport Transfer', rate: 50, selected: true },
      { name: 'Bike Maintenance Package', rate: 30, selected: true },
      { name: 'GPS Rental', rate: 10, selected: false },
      { name: 'Welcome Package', rate: 25, selected: true }
    ]
  },
  
  accommodation: [
    { 
      date: '2023-07-15', 
      hotel: { 
        name: 'Safari Lodge', 
        location: 'Nairobi',
        single_room_rate: 100,
        double_room_rate: 150
      } 
    },
    { 
      date: '2023-07-16', 
      hotel: { 
        name: 'Mountain View Resort', 
        location: 'Mt. Kenya',
        single_room_rate: 120,
        double_room_rate: 180
      } 
    },
    { 
      date: '2023-07-17', 
      hotel: { 
        name: 'Mountain View Resort', 
        location: 'Mt. Kenya',
        single_room_rate: 120,
        double_room_rate: 180
      } 
    },
    { 
      date: '2023-07-18', 
      hotel: { 
        name: 'Lakeside Retreat', 
        location: 'Lake Naivasha',
        single_room_rate: 90,
        double_room_rate: 140
      } 
    },
    { 
      date: '2023-07-19', 
      hotel: { 
        name: 'Lakeside Retreat', 
        location: 'Lake Naivasha',
        single_room_rate: 90,
        double_room_rate: 140
      } 
    },
    { 
      date: '2023-07-20', 
      hotel: { 
        name: 'Safari Lodge', 
        location: 'Nairobi',
        single_room_rate: 100,
        double_room_rate: 150
      } 
    }
  ]
};

export default function PreviewPage() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [tourData, setTourData] = useState(mockTourData);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount: number) => {
    const symbol = CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS];
    const convertedAmount = amount * CURRENCY_RATES[selectedCurrency as keyof typeof CURRENCY_RATES];
    return `${symbol}${convertedAmount.toFixed(2)}`;
  };
  
  const calculateAccommodationTotal = () => {
    return tourData.accommodation.reduce((total, day) => {
      return total + 
        (day.hotel.single_room_rate * tourData.groupInfo.singleRooms) + 
        (day.hotel.double_room_rate * tourData.groupInfo.doubleRooms);
    }, 0);
  };
  
  const calculateBikeRentalTotal = () => {
    return tourData.rates.bikeRentalDaily * tourData.rates.numberOfBikes * tourData.rates.numberOfDays;
  };
  
  const calculateTransportTotal = () => {
    return tourData.rates.selectedTransport.rate_per_day * tourData.rates.transportDays;
  };
  
  const calculateServicesTotal = () => {
    return tourData.rates.tourGuideRate + tourData.rates.supportVehicle + tourData.rates.equipmentRental;
  };
  
  const calculateInsuranceTotal = () => {
    // Calculate both travel insurance and equipment insurance
    const travelInsuranceCost = tourData.rates.travelInsurance * tourData.groupInfo.numberOfRiders;
    const equipmentInsuranceCost = tourData.rates.equipmentInsurance * tourData.rates.numberOfBikes;
    return travelInsuranceCost + equipmentInsuranceCost;
  };
  
  const calculateExtrasTotal = () => {
    return tourData.rates.extraServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.rate, 0);
  };
  
  const calculateSubtotal = () => {
    return (
      calculateAccommodationTotal() +
      calculateBikeRentalTotal() +
      calculateTransportTotal() +
      calculateServicesTotal() +
      calculateInsuranceTotal() +
      calculateExtrasTotal()
    );
  };
  
  const calculateDiscount = () => {
    return calculateSubtotal() * (tourData.groupInfo.tourLeaderDiscount / 100);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };
  
  const handleSubmit = async () => {
    try {
      toast.loading('Saving invoice...');
      
      // First create or get the customer
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tourData.groupInfo.tourLeaderName,
          email: tourData.groupInfo.tourLeaderEmail,
          phone: tourData.groupInfo.tourLeaderPhone
        }),
      });
      
      if (!customerResponse.ok) {
        throw new Error('Failed to create customer');
      }
      
      const customer = await customerResponse.json();
      
      // Prepare invoice items
      const items = [];
      
      // Add accommodation
      tourData.accommodation.forEach(day => {
        items.push({
          product_id: 'accommodation',
          description: `${day.hotel.name} - ${formatDate(day.date)}`,
          quantity: 1,
          unit_price: (day.hotel.single_room_rate * tourData.groupInfo.singleRooms) +
                      (day.hotel.double_room_rate * tourData.groupInfo.doubleRooms)
        });
      });
      
      // Add bike rental
      items.push({
        product_id: 'bikes',
        description: `E-Bike Rental (${tourData.rates.numberOfBikes} bikes for ${tourData.rates.numberOfDays} days)`,
        quantity: tourData.rates.numberOfBikes,
        unit_price: tourData.rates.bikeRentalDaily * tourData.rates.numberOfDays
      });
      
      // Add transport
      items.push({
        product_id: 'transport',
        description: `Transport: ${tourData.rates.selectedTransport.name} (${tourData.rates.transportDays} days)`,
        quantity: 1,
        unit_price: tourData.rates.selectedTransport.rate_per_day * tourData.rates.transportDays
      });
      
      // Add guide services if selected
      if (tourData.rates.tourGuideRate > 0) {
        items.push({
          product_id: 'services',
          description: 'Tour Guide Service',
          quantity: 1,
          unit_price: tourData.rates.tourGuideRate
        });
      }
      
      // Add support vehicle if selected
      if (tourData.rates.supportVehicle > 0) {
        items.push({
          product_id: 'services',
          description: 'Support Vehicle',
          quantity: 1,
          unit_price: tourData.rates.supportVehicle
        });
      }
      
      // Add insurance if selected
      if (tourData.rates.travelInsurance > 0) {
        items.push({
          product_id: 'insurance',
          description: 'Travel Insurance',
          quantity: tourData.groupInfo.numberOfRiders,
          unit_price: tourData.rates.travelInsurance
        });
      }
      
      // Add equipment insurance if selected
      if (tourData.rates.equipmentInsurance > 0) {
        items.push({
          product_id: 'insurance',
          description: 'Equipment Insurance',
          quantity: tourData.rates.numberOfBikes,
          unit_price: tourData.rates.equipmentInsurance
        });
      }
      
      // Add extra services
      tourData.rates.extraServices.forEach(service => {
        if (service.selected) {
          items.push({
            product_id: 'extras',
            description: service.name,
            quantity: 1,
            unit_price: service.rate
          });
        }
      });
      
      // Create the invoice
      const invoiceResponse = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customer.id,
          tour_name: tourData.tourName,
          tour_start_date: tourData.startDate,
          tour_end_date: tourData.endDate,
          group_size: tourData.groupInfo.numberOfRiders,
          single_rooms: tourData.groupInfo.singleRooms,
          double_rooms: tourData.groupInfo.doubleRooms,
          discount_percentage: tourData.groupInfo.tourLeaderDiscount,
          additional_requests: tourData.groupInfo.additionalRequests,
          currency: selectedCurrency,
          items: items
        }),
      });
      
      if (!invoiceResponse.ok) {
        throw new Error('Failed to create invoice');
      }
      
      const invoice = await invoiceResponse.json();
      
      toast.dismiss();
      toast.success('Invoice created successfully!');
      
      // Redirect to the invoices page
      router.push('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.dismiss();
      toast.error('Failed to create invoice. Please try again.');
    }
  };
  
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header with Logo and Invoice Title */}
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
        <div className="flex gap-4">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="LKR">LKR (Rs.)</option>
          </select>
        </div>
      </div>

      {/* Progress Indicator */}
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
          <Link href="/rates" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">3</div>
            <span>Rates</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">4</div>
          <span className="font-medium">Preview</span>
        </div>
      </div>
      
      {/* Invoice Header */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">{tourData.tourName}</h2>
            <p className="text-gray-600">
              {formatDate(tourData.startDate)} to {formatDate(tourData.endDate)}
            </p>
            <p className="text-gray-600 mt-2">Tour Leader: {tourData.groupInfo.tourLeaderName}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Invoice #: {tourData.invoiceNumber}</p>
            <p className="text-gray-600">Date: {formatDate(tourData.invoiceDate)}</p>
            <p className="text-gray-600">Group Size: {tourData.groupInfo.numberOfRiders} riders</p>
          </div>
        </div>
      </div>
      
      {/* Accommodation Summary */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Accommodation</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Hotel</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-right">Single Rooms ({tourData.groupInfo.singleRooms})</th>
                <th className="px-4 py-2 text-right">Double Rooms ({tourData.groupInfo.doubleRooms})</th>
                <th className="px-4 py-2 text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody>
              {tourData.accommodation.map((day, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{formatDate(day.date)}</td>
                  <td className="px-4 py-2">{day.hotel.name}</td>
                  <td className="px-4 py-2">{day.hotel.location}</td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(day.hotel.single_room_rate)} x {tourData.groupInfo.singleRooms}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(day.hotel.double_room_rate)} x {tourData.groupInfo.doubleRooms}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {formatCurrency(
                      (day.hotel.single_room_rate * tourData.groupInfo.singleRooms) +
                      (day.hotel.double_room_rate * tourData.groupInfo.doubleRooms)
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td colSpan={5} className="px-4 py-2 text-right">Accommodation Subtotal:</td>
                <td className="px-4 py-2 text-right">{formatCurrency(calculateAccommodationTotal())}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bike Rental & Transport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">E-Bike Rental</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2">Daily Rate:</td>
                <td className="py-2 text-right">{formatCurrency(tourData.rates.bikeRentalDaily)}</td>
              </tr>
              <tr>
                <td className="py-2">Number of Bikes:</td>
                <td className="py-2 text-right">{tourData.rates.numberOfBikes}</td>
              </tr>
              <tr>
                <td className="py-2">Number of Days:</td>
                <td className="py-2 text-right">{tourData.rates.numberOfDays}</td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2 border-t">Bike Rental Subtotal:</td>
                <td className="py-2 text-right border-t">{formatCurrency(calculateBikeRentalTotal())}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Transport</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2">Transport Type:</td>
                <td className="py-2 text-right">{tourData.rates.selectedTransport.name}</td>
              </tr>
              <tr>
                <td className="py-2">Capacity:</td>
                <td className="py-2 text-right">{tourData.rates.selectedTransport.capacity} persons</td>
              </tr>
              <tr>
                <td className="py-2">Daily Rate:</td>
                <td className="py-2 text-right">{formatCurrency(tourData.rates.selectedTransport.rate_per_day)}</td>
              </tr>
              <tr>
                <td className="py-2">Number of Days:</td>
                <td className="py-2 text-right">{tourData.rates.transportDays}</td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2 border-t">Transport Subtotal:</td>
                <td className="py-2 text-right border-t">{formatCurrency(calculateTransportTotal())}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Services & Extras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Additional Services</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2">Tour Guide:</td>
                <td className="py-2 text-right">{formatCurrency(tourData.rates.tourGuideRate)}</td>
              </tr>
              <tr>
                <td className="py-2">Support Vehicle:</td>
                <td className="py-2 text-right">{formatCurrency(tourData.rates.supportVehicle)}</td>
              </tr>
              <tr>
                <td className="py-2">Equipment Rental:</td>
                <td className="py-2 text-right">{formatCurrency(tourData.rates.equipmentRental)}</td>
              </tr>
              <tr>
                <td className="py-2">Insurance:</td>
                <td className="py-2 text-right">
                  {formatCurrency(tourData.rates.insurancePerPerson)} x {tourData.rates.numberOfBikes}
                </td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2 border-t">Services Subtotal:</td>
                <td className="py-2 text-right border-t">
                  {formatCurrency(calculateServicesTotal() + calculateInsuranceTotal())}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Extra Services</h3>
          <table className="w-full">
            <tbody>
              {tourData.rates.extraServices
                .filter(service => service.selected)
                .map((service, index) => (
                  <tr key={index}>
                    <td className="py-2">{service.name}:</td>
                    <td className="py-2 text-right">{formatCurrency(service.rate)}</td>
                  </tr>
                ))}
              <tr className="font-semibold">
                <td className="py-2 border-t">Extras Subtotal:</td>
                <td className="py-2 text-right border-t">{formatCurrency(calculateExtrasTotal())}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Additional Requests */}
      {tourData.groupInfo.additionalRequests && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">Additional Requests</h3>
          <p className="text-gray-700">{tourData.groupInfo.additionalRequests}</p>
        </div>
      )}
      
      {/* Invoice Total */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col items-end">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            {tourData.groupInfo.tourLeaderDiscount > 0 && (
              <div className="flex justify-between py-2 text-green-600">
                <span>Discount ({tourData.groupInfo.tourLeaderDiscount}%):</span>
                <span>-{formatCurrency(calculateDiscount())}</span>
              </div>
            )}
            <div className="flex justify-between py-2 font-semibold text-lg border-t">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Link
          href="/rates"
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Rates
        </Link>
        
        <div className="flex gap-4">
          <button
            onClick={printInvoice}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Finalize Invoice
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 