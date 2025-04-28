-- Check products
SELECT * FROM products ORDER BY price;

-- Check customers
SELECT * FROM customers;

-- Check invoices
SELECT 
    i.invoice_number,
    c.name as customer_name,
    i.status,
    i.total_amount
FROM invoices i
JOIN customers c ON i.customer_id = c.id
ORDER BY i.invoice_number;

-- Check invoice items
SELECT 
    i.invoice_number,
    p.name as product_name,
    ii.quantity,
    ii.unit_price,
    ii.total_price
FROM invoice_items ii
JOIN invoices i ON ii.invoice_id = i.id
JOIN products p ON ii.product_id = p.id
ORDER BY i.invoice_number; 