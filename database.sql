-- Products table schema for Vercel Postgres
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    condition VARCHAR(100),
    year INTEGER,
    make VARCHAR(100),
    model VARCHAR(100),
    images TEXT[], -- Array of image URLs
    contact_phone VARCHAR(50) DEFAULT '(715) 430-2201',
    contact_email VARCHAR(255) DEFAULT 'vern@rustynuts.repair',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index for faster name searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Insert sample data
INSERT INTO products (name, category, description, price, condition, year, make, model, images, contact_phone, contact_email) VALUES
('Arctic Cat Snowmobile', 'snowmobiles', 'Excellent condition Arctic Cat snowmobile, perfect for winter adventures.', 8500.00, 'Excellent', 2020, 'Arctic Cat', 'ZR 6000', ARRAY['/products/snowmobiles/snowmobile-1/snowmobile-1.JPG', '/products/snowmobiles/snowmobile-1/snowmobile-2.JPG'], '(715) 430-2201', 'vern@rustynuts.repair'),
('Polaris Snowmobile', 'snowmobiles', 'High-performance Polaris snowmobile with advanced features.', 9200.00, 'Very Good', 2019, 'Polaris', 'Indy 850', ARRAY['/products/snowmobiles/snowmobile-2/snowmobile2-1.JPG', '/products/snowmobiles/snowmobile-2/snowmobile2-2.JPG'], '(715) 430-2201', 'vern@rustynuts.repair'),
('Utility Trailer', 'trailers', 'Heavy-duty utility trailer perfect for hauling equipment and materials.', 3500.00, 'Good', 2018, 'Custom', 'Utility', ARRAY['/products/trailers/trailer-1/trailer-1.JPG', '/products/trailers/trailer-1/trailer-2.JPG'], '(715) 430-2201', 'vern@rustynuts.repair'),
('Commercial Lawn Mower', 'lawnmowers', 'Professional grade commercial lawn mower for large properties.', 2800.00, 'Excellent', 2021, 'Honda', 'Commercial', ARRAY['/products/lawnmowers/lawnmower-1/lawnmower-1.jpg', '/products/lawnmowers/lawnmower-1/lawnmower-2.jpg'], '(715) 430-2201', 'vern@rustynuts.repair')
ON CONFLICT DO NOTHING; 