-- Insert test products (e-bikes)
INSERT INTO products (name, description, model, price, stock) VALUES
('City Cruiser E-Bike', 'Perfect for urban commuting', 'CC-2024', 1499.99, 10),
('Mountain Explorer E-Bike', 'Powerful motor for off-road adventures', 'ME-2024', 2499.99, 5),
('Compact Folding E-Bike', 'Foldable design for easy storage', 'CF-2024', 999.99, 15),
('Premium Road E-Bike', 'High-performance road bike with electric assist', 'PR-2024', 3499.99, 3);

-- Insert test customers
INSERT INTO customers (name, email, phone, address) VALUES
('John Smith', 'john.smith@email.com', '+1234567890', '123 Main St, City, Country'),
('Sarah Johnson', 'sarah.j@email.com', '+0987654321', '456 Oak Ave, Town, Country'),
('Michael Brown', 'michael.b@email.com', '+1122334455', '789 Pine Rd, Village, Country');

-- Insert test invoices
INSERT INTO invoices (invoice_number, customer_id, status, total_amount) VALUES
('INV-2024-001', 
 (SELECT id FROM customers WHERE email = 'john.smith@email.com'),
 'PAID',
 1499.99);

INSERT INTO invoices (invoice_number, customer_id, status, total_amount) VALUES
('INV-2024-002',
 (SELECT id FROM customers WHERE email = 'sarah.j@email.com'),
 'PENDING',
 3499.99);

-- Insert test invoice items
INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price)
SELECT 
    (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'),
    (SELECT id FROM products WHERE model = 'CC-2024'),
    1,
    1499.99,
    1499.99;

INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price)
SELECT 
    (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'),
    (SELECT id FROM products WHERE model = 'PR-2024'),
    1,
    3499.99,
    3499.99; 