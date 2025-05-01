import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mockAPI } from '@/lib/mockData';

// Using the proper Next.js 15.3.1 route handler parameter types
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Always use mockAPI for Vercel deployment
    const invoice = await mockAPI.getInvoiceById(id);
    
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Add customer info
    const customer = await mockAPI.getCustomerById(invoice.customer_id);
    if (customer) {
      invoice.customer = { 
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      };
    }
    
    // Add invoice items
    const items = await mockAPI.getInvoiceItemsByInvoiceId(id);
    if (items) {
      invoice.invoice_items = items;
    }
    
    return NextResponse.json(invoice);
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

    // Update the invoice using mockAPI
    const updatedInvoice = await mockAPI.updateInvoice(id, body);
    
    if (!updatedInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Add customer info
    const customer = await mockAPI.getCustomerById(updatedInvoice.customer_id);
    if (customer) {
      updatedInvoice.customer = { 
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      };
    }
    
    // Add invoice items
    const items = await mockAPI.getInvoiceItemsByInvoiceId(id);
    if (items) {
      updatedInvoice.invoice_items = items;
    }
    
    return NextResponse.json(updatedInvoice);
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
    
    // Check if invoice exists
    const invoice = await mockAPI.getInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Delete invoice items first
    const items = await mockAPI.getInvoiceItemsByInvoiceId(id);
    if (items && items.length > 0) {
      for (const item of items) {
        await mockAPI.deleteInvoiceItem(item.id);
      }
    }
    
    // Delete the invoice
    await mockAPI.deleteInvoice(id);
    
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}