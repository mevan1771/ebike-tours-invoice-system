import { NextResponse } from 'next/server';
import { mockAPI } from '@/lib/mockData';

export async function GET() {
  try {
    const data = await mockAPI.getHotels();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.location || body.stars === undefined) {
      return NextResponse.json(
        { error: 'Name, location, and stars are required' }, 
        { status: 400 }
      );
    }

    const newHotel = await mockAPI.createHotel({
      name: body.name,
      location: body.location,
      stars: body.stars,
      single_room_rate: body.single_room_rate || 0,
      double_room_rate: body.double_room_rate || 0,
      contact_email: body.contact_email || null,
      contact_phone: body.contact_phone || null
    });

    return NextResponse.json(newHotel, { status: 201 });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
  }
}