export type Product = {
  id: string;
  name: string;
  description: string | null;
  model: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export type Invoice = {
  id: string;
  invoice_number: string;
  customer_id: string;
  status: InvoiceStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  invoice_items?: InvoiceItem[];
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}; 