import { NextResponse } from 'next/server';
import { mockAPI } from '@/lib/mockData';

export async function GET() {
  try {
    const data = await mockAPI.getCustomers();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' }, 
        { status: 400 }
      );
    }

    const newCustomer = await mockAPI.createCustomer({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      address: body.address || null
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}