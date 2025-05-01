import { NextResponse } from 'next/server';
import { mockAPI } from '@/lib/mockData';

export async function GET() {
  try {
    const data = await mockAPI.getProducts();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.model || !body.price) {
      return NextResponse.json(
        { error: 'Name, model and price are required' }, 
        { status: 400 }
      );
    }

    const newProduct = await mockAPI.createProduct({
      name: body.name,
      model: body.model,
      description: body.description || null,
      price: typeof body.price === 'string' ? parseFloat(body.price) : body.price,
      stock: body.stock || 0
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
} 