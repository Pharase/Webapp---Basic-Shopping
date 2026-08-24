INSERT INTO users (username, email, password_hash, full_name, role)
VALUES
    ('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'admin'),
    ('pharase', 'pharase@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Pharase', 'user'),
    ('john', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe', 'user')
ON CONFLICT (username) DO NOTHING;

INSERT INTO categories (category_name, description)
VALUES
    ('Computer', 'Computer and computer accessories'),
    ('Mobile', 'Mobile phones and accessories'),
    ('Clothing', 'Clothing and fashion')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO products (category_id, product_name, description, price, stock_quantity)
SELECT c.category_id, seed.product_name, seed.description, seed.price, seed.stock_quantity
FROM (VALUES
    ('Computer', 'Mechanical Keyboard', 'RGB Mechanical Keyboard', 1590.00, 20),
    ('Computer', 'Gaming Mouse', 'Wireless Gaming Mouse', 890.00, 30),
    ('Mobile', 'USB-C Cable', 'Fast charging USB-C cable', 250.00, 100),
    ('Clothing', 'T-Shirt', 'Basic cotton T-Shirt', 350.00, 50)
) AS seed(category_name, product_name, description, price, stock_quantity)
JOIN categories c ON c.category_name = seed.category_name
WHERE NOT EXISTS (
    SELECT 1 FROM products p WHERE p.product_name = seed.product_name
);
