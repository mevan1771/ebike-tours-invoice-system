import { NextResponse } from 'next/server';
import { mockAPI } from '@/lib/mockData';

export async function GET() {
  try {
    const data = await mockAPI.getInvoices();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.invoice_number || !body.customer_id || body.total_amount === undefined) {
      return NextResponse.json(
        { error: 'Invoice number, customer ID and total amount are required' }, 
        { status: 400 }
      );
    }

    // Create the invoice
    const newInvoice = await mockAPI.createInvoice({
      invoice_number: body.invoice_number,
      customer_id: body.customer_id,
      status: body.status || 'PENDING',
      total_amount: typeof body.total_amount === 'string' ? parseFloat(body.total_amount) : body.total_amount,
    });

    // Add invoice items if provided
    if (Array.isArray(body.items) && body.items.length > 0) {
      for (const item of body.items) {
        await mockAPI.createInvoiceItem({
          invoice_id: newInvoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        });
      }
    }

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
} 