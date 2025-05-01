export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  model: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  total_amount: number;
  created_at: string;
  updated_at: string;
  customer?: { name: string };
  invoice_items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  product?: { name: string };
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  single_room_rate: number;
  double_room_rate: number;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Transport {
  id: string;
  name: string;
  type: string;
  capacity: number;
  rate_per_day: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for initial state
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 123-456-7890",
    address: "123 Main St",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "c2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 987-654-3210",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Giant E-Bike Model X",
    description: "Top of the line electric bike",
    model: "GNT-X-2023",
    price: 1899.99,
    stock: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p2",
    name: "Specialized Turbo",
    description: "Performance electric mountain bike",
    model: "SPZ-TB-2023",
    price: 2499.99,
    stock: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockInvoiceItems: InvoiceItem[] = [
  {
    id: "ii1",
    invoice_id: "i1",
    product_id: "p1",
    quantity: 1,
    unit_price: 1899.99,
    total_price: 1899.99,
    product: { name: "Giant E-Bike Model X" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "ii2",
    invoice_id: "i2",
    product_id: "p2",
    quantity: 2,
    unit_price: 2499.99,
    total_price: 4999.98,
    product: { name: "Specialized Turbo" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "i1",
    invoice_number: "INV-2023-001",
    customer_id: "c1",
    status: "PAID",
    total_amount: 1899.99,
    customer: { name: "John Doe" },
    invoice_items: [mockInvoiceItems[0]],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "i2",
    invoice_number: "INV-2023-002",
    customer_id: "c2",
    status: "PENDING",
    total_amount: 4999.98,
    customer: { name: "Jane Smith" },
    invoice_items: [mockInvoiceItems[1]],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockHotels: Hotel[] = [
  {
    id: "h1",
    name: "Grand Hotel",
    location: "Barcelona, Spain",
    stars: 5,
    single_room_rate: 150,
    double_room_rate: 220,
    contact_email: "bookings@grandhotel.com",
    contact_phone: "+34 123 456 789",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "h2",
    name: "Seaside Resort",
    location: "Mallorca, Spain",
    stars: 4,
    single_room_rate: 120,
    double_room_rate: 180,
    contact_email: "reservations@seasideresort.com",
    contact_phone: "+34 987 654 321",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "h3",
    name: "Mountain Lodge",
    location: "Pyrenees, Spain",
    stars: 3,
    single_room_rate: 90,
    double_room_rate: 130,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockTransports: Transport[] = [
  {
    id: "t1",
    name: "Luxury Coach",
    type: "Bus",
    capacity: 45,
    rate_per_day: 450,
    description: "Air-conditioned coach with WiFi and amenities",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "t2",
    name: "Toyota Hiace",
    type: "Van",
    capacity: 12,
    rate_per_day: 180,
    description: "Comfortable 12-seater van for smaller groups",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Data storage (simulate a database)
let customers = [...mockCustomers];
let products = [...mockProducts];
let invoices = [...mockInvoices];
let invoiceItems = [...mockInvoiceItems];
let hotels = [...mockHotels];
let transports = [...mockTransports];

// Mock API functions
export const mockAPI = {
  // Customers
  getCustomers: () => Promise.resolve([...customers]),
  getCustomerById: (id: string) => Promise.resolve(customers.find(c => c.id === id) || null),
  createCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    const newCustomer: Customer = {
      id: generateId(),
      ...customer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    customers = [...customers, newCustomer];
    return Promise.resolve(newCustomer);
  },
  updateCustomer: (id: string, data: Partial<Customer>) => {
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedCustomer = {
      ...customers[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    customers = [
      ...customers.slice(0, index),
      updatedCustomer,
      ...customers.slice(index + 1)
    ];
    return Promise.resolve(updatedCustomer);
  },
  deleteCustomer: (id: string) => {
    customers = customers.filter(c => c.id !== id);
    return Promise.resolve({ success: true });
  },

  // Products
  getProducts: () => Promise.resolve([...products]),
  getProductById: (id: string) => Promise.resolve(products.find(p => p.id === id) || null),
  createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      id: generateId(),
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    products = [...products, newProduct];
    return Promise.resolve(newProduct);
  },
  updateProduct: (id: string, data: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedProduct = {
      ...products[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    products = [
      ...products.slice(0, index),
      updatedProduct,
      ...products.slice(index + 1)
    ];
    return Promise.resolve(updatedProduct);
  },
  deleteProduct: (id: string) => {
    products = products.filter(p => p.id !== id);
    return Promise.resolve({ success: true });
  },

  // Invoices
  getInvoices: () => Promise.resolve([...invoices]),
  getInvoiceById: (id: string) => Promise.resolve(invoices.find(i => i.id === id) || null),
  createInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    const newInvoice: Invoice = {
      id: generateId(),
      ...invoice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    invoices = [...invoices, newInvoice];
    return Promise.resolve(newInvoice);
  },
  updateInvoice: (id: string, data: Partial<Invoice>) => {
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedInvoice = {
      ...invoices[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    invoices = [
      ...invoices.slice(0, index),
      updatedInvoice,
      ...invoices.slice(index + 1)
    ];
    return Promise.resolve(updatedInvoice);
  },
  deleteInvoice: (id: string) => {
    invoices = invoices.filter(i => i.id !== id);
    return Promise.resolve({ success: true });
  },

  // Invoice Items
  getInvoiceItems: () => Promise.resolve([...invoiceItems]),
  getInvoiceItemById: (id: string) => Promise.resolve(invoiceItems.find(i => i.id === id) || null),
  getInvoiceItemsByInvoiceId: (invoiceId: string) => 
    Promise.resolve(invoiceItems.filter(i => i.invoice_id === invoiceId)),
  createInvoiceItem: (item: Omit<InvoiceItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: InvoiceItem = {
      id: generateId(),
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    invoiceItems = [...invoiceItems, newItem];
    return Promise.resolve(newItem);
  },
  deleteInvoiceItem: (id: string) => {
    invoiceItems = invoiceItems.filter(i => i.id !== id);
    return Promise.resolve({ success: true });
  },

  // Hotels
  getHotels: () => Promise.resolve([...hotels]),
  getHotelById: (id: string) => Promise.resolve(hotels.find(h => h.id === id) || null),
  createHotel: (hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => {
    const newHotel: Hotel = {
      id: generateId(),
      ...hotel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    hotels = [...hotels, newHotel];
    return Promise.resolve(newHotel);
  },
  updateHotel: (id: string, data: Partial<Hotel>) => {
    const index = hotels.findIndex(h => h.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedHotel = {
      ...hotels[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    hotels = [
      ...hotels.slice(0, index),
      updatedHotel,
      ...hotels.slice(index + 1)
    ];
    return Promise.resolve(updatedHotel);
  },
  deleteHotel: (id: string) => {
    hotels = hotels.filter(h => h.id !== id);
    return Promise.resolve({ success: true });
  },

  // Transport
  getTransports: () => Promise.resolve([...transports]),
  getTransportById: (id: string) => Promise.resolve(transports.find(t => t.id === id) || null),
  createTransport: (transport: Omit<Transport, 'id' | 'created_at' | 'updated_at'>) => {
    const newTransport: Transport = {
      id: generateId(),
      ...transport,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    transports = [...transports, newTransport];
    return Promise.resolve(newTransport);
  },
  updateTransport: (id: string, data: Partial<Transport>) => {
    const index = transports.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedTransport = {
      ...transports[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    transports = [
      ...transports.slice(0, index),
      updatedTransport,
      ...transports.slice(index + 1)
    ];
    return Promise.resolve(updatedTransport);
  },
  deleteTransport: (id: string) => {
    transports = transports.filter(t => t.id !== id);
    return Promise.resolve({ success: true });
  }
};