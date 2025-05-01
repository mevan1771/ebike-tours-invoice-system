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
    if (!body.customer_id || !body.items || !body.items.length) {
      return NextResponse.json(
        { error: 'Customer ID and at least one invoice item are required' }, 
        { status: 400 }
      );
    }

    const newInvoice = await mockAPI.createInvoice({
      customer_id: body.customer_id,
      invoice_date: body.invoice_date || new Date().toISOString(),
      due_date: body.due_date || null,
      status: body.status || 'pending',
      total_amount: body.total_amount || 0,
      notes: body.notes || null,
      items: body.items
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}