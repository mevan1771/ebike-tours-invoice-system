import { NextRequest, NextResponse } from 'next/server';
import { supabase, fetchData } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await fetchData('hotels');
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('hotels')
      .insert([body])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
  }
} 