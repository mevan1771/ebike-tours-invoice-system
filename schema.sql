-- Drop existing tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS transport CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS invoice_status CASCADE;

-- Create enum for invoice status
CREATE TYPE invoice_status AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    model TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    status invoice_status NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    tour_name TEXT,
    tour_start_date DATE,
    tour_end_date DATE,
    group_size INTEGER,
    single_rooms INTEGER,
    double_rooms INTEGER,
    discount_percentage DECIMAL(5,2),
    additional_requests TEXT,
    currency VARCHAR(3) DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice items table
CREATE TABLE invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    product_id TEXT NOT NULL, -- Changed from UUID to TEXT to support generic product types
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create hotels table
CREATE TABLE hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  single_room_rate DECIMAL(10,2) NOT NULL,
  double_room_rate DECIMAL(10,2) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on hotels table
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Create policies for hotels table - Allow public access
CREATE POLICY "Allow public to view hotels"
  ON hotels
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public to insert hotels"
  ON hotels
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Allow public to update hotels"
  ON hotels
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete hotels"
  ON hotels
  FOR DELETE
  TO PUBLIC
  USING (true);

-- Create transport table
CREATE TABLE transport (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  rate_per_day DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for transport
ALTER TABLE transport ENABLE ROW LEVEL SECURITY;

-- Create policies for transport
CREATE POLICY "Allow authenticated users to view transport" ON transport
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Allow authenticated users to insert transport" ON transport
  FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update transport" ON transport
  FOR UPDATE TO PUBLIC USING (true);

CREATE POLICY "Allow authenticated users to delete transport" ON transport
  FOR DELETE TO PUBLIC USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_products_model ON products(model);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_product ON invoice_items(product_id); 