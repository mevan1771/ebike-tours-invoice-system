'use client';

import { useState } from 'react';

interface InvoiceFormProps {
  bike: {
    id: number;
    name: string;
    price: number;
  };
  onClose: () => void;
}

export default function InvoiceForm({ bike, onClose }: InvoiceFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const total = bike.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // We'll add Supabase integration here later
    console.log('Invoice data:', {
      bike,
      quantity,
      customerName,
      customerEmail,
      total
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold">{bike.name}</h3>
          <p className="text-gray-600">Unit Price: ${bike.price.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-lg font-semibold">
              Total: ${total.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 