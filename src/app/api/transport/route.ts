import { NextResponse } from 'next/server';
import { mockAPI } from '@/lib/mockData';

export async function GET() {
  try {
    const data = await mockAPI.getTransport();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transport options:', error);
    return NextResponse.json({ error: 'Failed to fetch transport options' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.type || body.rate_per_day === undefined) {
      return NextResponse.json(
        { error: 'Name, type, and rate per day are required' }, 
        { status: 400 }
      );
    }

    const newTransport = await mockAPI.createTransport({
      name: body.name,
      type: body.type,
      capacity: body.capacity || 1,
      rate_per_day: body.rate_per_day,
      description: body.description || null
    });

    return NextResponse.json(newTransport, { status: 201 });
  } catch (error) {
    console.error('Error creating transport option:', error);
    return NextResponse.json({ error: 'Failed to create transport option' }, { status: 500 });
  }
}