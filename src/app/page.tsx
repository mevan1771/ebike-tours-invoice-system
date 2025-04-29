'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  total_amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  customer: {
    name: string;
  };
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    active: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      
      const data = await response.json();
      setInvoices(data);
      
      // Calculate statistics
      const totalInvoices = data.length;
      
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      
      const thisMonthInvoices = data.filter((invoice: Invoice) => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate.getMonth() === thisMonth && invoiceDate.getFullYear() === thisYear;
      });
      
      const activeInvoices = data.filter((invoice: Invoice) => invoice.status === 'PENDING');
      
      const totalRevenue = thisMonthInvoices.reduce((sum: number, invoice: Invoice) => 
        sum + invoice.total_amount, 0);
      
      setStats({
        total: thisMonthInvoices.length,
        revenue: totalRevenue,
        active: activeInvoices.length
      });
      
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Invoices</h3>
          <p className="text-3xl font-bold mt-2">{isLoading ? '-' : stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
          <p className="text-3xl font-bold mt-2">{isLoading ? '-' : formatCurrency(stats.revenue)}</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Tours</h3>
          <p className="text-3xl font-bold mt-2">{isLoading ? '-' : stats.active}</p>
          <p className="text-sm text-gray-500 mt-1">Currently ongoing</p>
        </div>
      </div>
      
      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Invoices</h2>
          <Link 
            href="/invoices"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View all
          </Link>
        </div>
        <div className="border-t">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p>Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No invoices found. Create your first invoice to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link href={`/invoices/${invoice.id}`}>
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.customer?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'PAID' 
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
