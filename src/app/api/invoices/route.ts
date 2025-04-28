import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(name),
        invoice_items(
          quantity,
          unit_price,
          total_price,
          product:products(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_id, items } = body;

    if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid invoice data' }, { status: 400 });
    }

    // Generate invoice number (format: INV-YYYY-XXX)
    const year = new Date().getFullYear();
    const result = await supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .gte('created_at', `${year}-01-01`)
      .lte('created_at', `${year}-12-31`)
      .single();

    const count = result?.count ?? 0;
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, '0')}`;
    
    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unit_price), 0);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        invoice_number: invoiceNumber,
        customer_id,
        status: 'PENDING',
        total_amount: totalAmount
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    const invoiceItems = items.map((item: any) => ({
      invoice_id: invoice.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    // Return the created invoice with its items
    const { data: fullInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(name),
        invoice_items(
          quantity,
          unit_price,
          total_price,
          product:products(name)
        )
      `)
      .eq('id', invoice.id)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(fullInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
} 