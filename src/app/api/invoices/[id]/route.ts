import { NextRequest, NextResponse } from 'next/server';
import { supabase, fetchData, getMockData } from '@/lib/supabase';

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Using the proper Next.js 15.3.1 route handler parameter types
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (useMockData) {
      const mockInvoices = getMockData('invoices') as any[];
      const invoice = mockInvoices.find(inv => inv.id === id);
      
      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      
      // Add mock customer and invoice items
      invoice.customer = getMockData('customers').find((c: any) => c.id === invoice.customer_id);
      invoice.invoice_items = getMockData('invoice_items').filter((item: any) => item.invoice_id === id);
      
      return NextResponse.json(invoice);
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(name, email, phone),
        invoice_items(
          id,
          product_id,
          description,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate status if it's being updated
    if (body.status && !['PENDING', 'PAID', 'CANCELLED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    if (useMockData) {
      // For mock data, just return success with the mock data
      const mockInvoices = getMockData('invoices') as any[];
      const invoice = mockInvoices.find(inv => inv.id === id);
      
      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      
      // Simulate updated invoice
      const updatedInvoice = { ...invoice, ...body };
      
      return NextResponse.json(updatedInvoice);
    }
    
    // Update the invoice in Supabase
    const { data, error } = await supabase
      .from('invoices')
      .update(body)
      .eq('id', id)
      .select(`
        *,
        customer:customers(name, email, phone),
        invoice_items(
          id,
          product_id,
          description,
          quantity,
          unit_price,
          total_price
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (useMockData) {
      // For mock data, just return success
      return NextResponse.json({ message: 'Invoice deleted successfully' });
    }
    
    // First, delete all related invoice items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    if (itemsError) throw itemsError;
    
    // Then, delete the invoice
    const { error: invoiceError } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (invoiceError) {
      if (invoiceError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      throw invoiceError;
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}