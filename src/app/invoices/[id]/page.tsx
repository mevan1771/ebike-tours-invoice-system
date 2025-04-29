'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface InvoiceItem {
  id: string;
  product_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  tour_name: string;
  tour_start_date: string;
  tour_end_date: string;
  group_size: number;
  single_rooms: number;
  double_rooms: number;
  discount_percentage: number;
  additional_requests: string;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  invoice_items: InvoiceItem[];
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id);
    }
  }, [params.id]);

  const fetchInvoice = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/invoices/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Invoice not found');
          router.push('/invoices');
          return;
        }
        throw new Error('Failed to fetch invoice');
      }
      
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!invoice) return '';
    
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'LKR': 'Rs.'
    };
    
    const symbol = currencySymbols[invoice.currency] || '€';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!invoice) return;
    
    try {
      toast.loading('Updating invoice status...');
      
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update invoice status');
      
      const updatedInvoice = await response.json();
      setInvoice(updatedInvoice);
      
      toast.dismiss();
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.dismiss();
      toast.error('Failed to update invoice status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Invoice Not Found</h2>
        <p className="text-gray-500 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
        <Link 
          href="/invoices" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:mx-0">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold">Invoice Details</h1>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <Link
            href="/invoices"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Invoices
          </Link>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
        <div className="flex flex-col md:flex-row justify-between border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{invoice.tour_name}</h2>
            <p className="text-gray-600 mt-1">
              {formatDate(invoice.tour_start_date)} to {formatDate(invoice.tour_end_date)}
            </p>
            <div className="mt-4">
              <p className="font-medium">Tour Details:</p>
              <p className="text-gray-600">Group Size: {invoice.group_size} persons</p>
              <p className="text-gray-600">Accommodation: {invoice.single_rooms} single rooms, {invoice.double_rooms} double rooms</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 text-right">
            <div className="flex items-center justify-end gap-3 mb-2">
              <span className="text-xl font-bold">Invoice #{invoice.invoice_number}</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            <p className="text-gray-600">Date: {formatDate(invoice.created_at)}</p>
            
            <div className="mt-6 space-y-2 print:hidden">
              <p className="font-medium text-gray-700">Update Status:</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleUpdateStatus('PAID')}
                  disabled={invoice.status === 'PAID'}
                  className={`px-3 py-1 rounded text-sm ${invoice.status === 'PAID' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => handleUpdateStatus('CANCELLED')}
                  disabled={invoice.status === 'CANCELLED'}
                  className={`px-3 py-1 rounded text-sm ${invoice.status === 'CANCELLED' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                >
                  Cancel Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p>{invoice.customer.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p>{invoice.customer.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p>{invoice.customer.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.invoice_items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {invoice.discount_percentage > 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-right">Subtotal:</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    {formatCurrency(invoice.total_amount / (1 - invoice.discount_percentage / 100))}
                  </td>
                </tr>
              )}
              
              {invoice.discount_percentage > 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-right text-green-600">
                    Discount ({invoice.discount_percentage}%):
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600 text-right">
                    -{formatCurrency((invoice.total_amount / (1 - invoice.discount_percentage / 100)) * (invoice.discount_percentage / 100))}
                  </td>
                </tr>
              )}
              
              <tr className="border-t-2 border-gray-200">
                <td colSpan={3} className="px-6 py-4 text-base font-bold text-right">Total:</td>
                <td className="px-6 py-4 text-base font-bold text-right">{formatCurrency(invoice.total_amount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Additional Requests */}
        {invoice.additional_requests && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Additional Requests</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded">{invoice.additional_requests}</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-white rounded-lg shadow p-6 text-center print:shadow-none">
        <p className="text-gray-500 text-sm">Thank you for choosing E-Bike Tours!</p>
        <p className="text-gray-400 text-xs mt-1">This invoice was generated by the E-Bike Tours Invoice System.</p>
      </div>
    </div>
  );
} 