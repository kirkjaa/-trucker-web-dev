-- ============================================================================
-- Trucker Mobile - Comprehensive Demo Seed Data
-- Run this AFTER mobile_schema.sql has been executed
-- All passwords: 12345 (bcrypt hash below)
-- ============================================================================

-- bcrypt hash for password '12345'
-- Generated with: await bcrypt.hash('12345', 10)
-- Hash: $2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy

-- ============================================================================
-- MOBILE USERS (15 users)
-- ============================================================================

INSERT INTO mobile_user_profiles (id, username, email, password_hash, role, display_name, first_name, last_name, phone, is_active)
VALUES
    -- Admins (3)
    ('a0000001-0001-0001-0001-000000000001', 'admin', 'admin@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'admin', 'Alex Walker', 'Alex', 'Walker', '081-234-5001', true),
    ('a0000001-0001-0001-0001-000000000002', 'admin2', 'admin2@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'admin', 'Sarah Chen', 'Sarah', 'Chen', '081-234-5002', true),
    ('a0000001-0001-0001-0001-000000000003', 'admin3', 'admin3@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'admin', 'Michael Brown', 'Michael', 'Brown', '081-234-5003', true),
    -- Companies (3)
    ('a0000001-0001-0001-0001-000000000004', 'company', 'company@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'company', 'Acme Logistics', 'Acme', 'Logistics', '081-234-5004', true),
    ('a0000001-0001-0001-0001-000000000005', 'company2', 'company2@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'company', 'Swift Transport', 'Swift', 'Transport', '081-234-5005', true),
    ('a0000001-0001-0001-0001-000000000006', 'company3', 'company3@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'company', 'Express Freight', 'Express', 'Freight', '081-234-5006', true),
    -- Customers (3)
    ('a0000001-0001-0001-0001-000000000007', 'customer', 'customer@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'customer', 'John Smith', 'John', 'Smith', '081-234-5007', true),
    ('a0000001-0001-0001-0001-000000000008', 'customer2', 'customer2@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'customer', 'Jane Doe', 'Jane', 'Doe', '081-234-5008', true),
    ('a0000001-0001-0001-0001-000000000009', 'customer3', 'customer3@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'customer', 'Robert Johnson', 'Robert', 'Johnson', '081-234-5009', true),
    -- Shipping/Drivers (6) - Main mobile app users
    ('a0000001-0001-0001-0001-000000000010', 'shipping', 'shipping@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'shipping', 'Somchai Jaidee', 'Somchai', 'Jaidee', '081-234-5010', true),
    ('a0000001-0001-0001-0001-000000000011', 'shipping2', 'shipping2@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'shipping', 'Prasit Tangsiri', 'Prasit', 'Tangsiri', '081-234-5011', true),
    ('a0000001-0001-0001-0001-000000000012', 'shipping3', 'shipping3@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'shipping', 'Wichai Boonkerd', 'Wichai', 'Boonkerd', '081-234-5012', true),
    ('a0000001-0001-0001-0001-000000000013', 'shipping4', 'shipping4@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'shipping', 'Thongchai Siripong', 'Thongchai', 'Siripong', '081-234-5013', true),
    ('a0000001-0001-0001-0001-000000000014', 'shipping5', 'shipping5@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'shipping', 'Chalerm Wongsa', 'Chalerm', 'Wongsa', '081-234-5014', true),
    ('a0000001-0001-0001-0001-000000000015', 'shipping6', 'shipping6@trucker.com', '$2a$10$rQZ5QvAi.dXnFfEQKQvEOukh8OJKQe5d3P9KWvYvZq5h3QZxvq5Hy', 'shipping', 'Boonmee Prasertsin', 'Boonmee', 'Prasertsin', '081-234-5015', true)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- MOBILE CUSTOMERS (15 Thai companies)
-- ============================================================================

INSERT INTO mobile_customers (id, name, email, phone, address, city, region, contact_person, total_orders, total_revenue)
VALUES
    ('b0000001-0001-0001-0001-000000000001', 'Thai Electronics Co., Ltd.', 'contact@thaielectronics.com', '02-100-1111', '123 Sukhumvit Road', 'Bangkok', 'Central', 'Khun Somporn', 45, 2500000.00),
    ('b0000001-0001-0001-0001-000000000002', 'Northern Textiles Ltd.', 'info@northerntextiles.com', '053-200-2222', '456 Chang Klan Road', 'Chiang Mai', 'North', 'Khun Arunee', 32, 1800000.00),
    ('b0000001-0001-0001-0001-000000000003', 'Eastern Auto Parts', 'orders@easternauto.com', '038-300-3333', '789 Sukhumvit Pattaya', 'Chonburi', 'East', 'Khun Prasert', 28, 1500000.00),
    ('b0000001-0001-0001-0001-000000000004', 'Isaan Foods Distribution', 'sales@isaanfoods.com', '043-400-4444', '321 Mittraphap Road', 'Khon Kaen', 'Northeast', 'Khun Somsak', 50, 3200000.00),
    ('b0000001-0001-0001-0001-000000000005', 'Southern Rubber Co.', 'export@southernrubber.com', '074-500-5555', '654 Kanchanawanit Road', 'Hat Yai', 'South', 'Khun Wilai', 38, 2100000.00),
    ('b0000001-0001-0001-0001-000000000006', 'Bangkok Steel Industries', 'procurement@bkksteel.com', '02-600-6666', '111 Rama IV Road', 'Bangkok', 'Central', 'Khun Thaksin', 42, 4500000.00),
    ('b0000001-0001-0001-0001-000000000007', 'Phuket Seafood Export', 'orders@phuketseafood.com', '076-700-7777', '222 Thepkasattri Road', 'Phuket', 'South', 'Khun Nittaya', 25, 1200000.00),
    ('b0000001-0001-0001-0001-000000000008', 'Central Pharma Thailand', 'supply@centralpharma.com', '02-800-8888', '333 Silom Road', 'Bangkok', 'Central', 'Khun Ratana', 55, 5500000.00),
    ('b0000001-0001-0001-0001-000000000009', 'Rayong Petrochemicals', 'logistics@rayongpetro.com', '038-900-9999', '444 Industrial Estate', 'Rayong', 'East', 'Khun Manee', 35, 6800000.00),
    ('b0000001-0001-0001-0001-000000000010', 'Korat Machinery Co.', 'orders@koratmachine.com', '044-111-0000', '555 Friendship Highway', 'Nakhon Ratchasima', 'Northeast', 'Khun Sawat', 22, 980000.00),
    ('b0000001-0001-0001-0001-000000000011', 'Chiang Rai Agricultural', 'sales@criagriculture.com', '053-222-1111', '666 Phaholyothin Road', 'Chiang Rai', 'North', 'Khun Anong', 40, 1650000.00),
    ('b0000001-0001-0001-0001-000000000012', 'Samut Prakan Factory', 'warehouse@spfactory.com', '02-333-2222', '777 Bangna-Trad Road', 'Samut Prakan', 'Central', 'Khun Prayut', 48, 3800000.00),
    ('b0000001-0001-0001-0001-000000000013', 'Udon Food Processing', 'orders@udonfood.com', '042-444-3333', '888 Udon-Nongkhai Road', 'Udon Thani', 'Northeast', 'Khun Suda', 30, 1400000.00),
    ('b0000001-0001-0001-0001-000000000014', 'Ayutthaya Cement Works', 'delivery@aycement.com', '035-555-4444', '999 Asia Road', 'Ayutthaya', 'Central', 'Khun Abhisit', 33, 4200000.00),
    ('b0000001-0001-0001-0001-000000000015', 'Hua Hin Resort Supplies', 'procurement@hhresort.com', '032-666-5555', '100 Phetkasem Road', 'Hua Hin', 'West', 'Khun Chuan', 18, 750000.00)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE PRODUCTS (20 products)
-- ============================================================================

INSERT INTO mobile_products (id, name, category, description, unit, weight, requires_refrigeration, is_hazardous)
VALUES
    ('c0000001-0001-0001-0001-000000000001', 'Industrial Motor A1', 'Machinery', 'High-quality industrial motor for factories', 'pieces', 250.00, false, false),
    ('c0000001-0001-0001-0001-000000000002', 'Steel Beam B2', 'Construction Materials', 'Heavy-duty steel construction beam', 'tons', 5000.00, false, false),
    ('c0000001-0001-0001-0001-000000000003', 'Electronic Components C3', 'Electronics', 'Assorted electronic components and circuits', 'boxes', 15.00, false, false),
    ('c0000001-0001-0001-0001-000000000004', 'Fresh Produce D4', 'Food & Beverages', 'Fresh fruits and vegetables from farms', 'kg', 1.00, true, false),
    ('c0000001-0001-0001-0001-000000000005', 'Frozen Seafood E5', 'Food & Beverages', 'Premium frozen seafood products', 'kg', 1.00, true, false),
    ('c0000001-0001-0001-0001-000000000006', 'Pharmaceutical Supplies F6', 'Pharmaceuticals', 'Medical pharmaceuticals and supplies', 'boxes', 5.00, true, false),
    ('c0000001-0001-0001-0001-000000000007', 'Automotive Battery G7', 'Automotive Parts', 'Car and truck batteries', 'pieces', 25.00, false, true),
    ('c0000001-0001-0001-0001-000000000008', 'Textile Fabric H8', 'Textiles', 'Cotton and polyester fabrics', 'rolls', 50.00, false, false),
    ('c0000001-0001-0001-0001-000000000009', 'Chemical Compound I9', 'Chemicals', 'Industrial chemical compounds', 'drums', 200.00, false, true),
    ('c0000001-0001-0001-0001-000000000010', 'Cement Bags J10', 'Construction Materials', 'Portland cement bags 50kg each', 'bags', 50.00, false, false),
    ('c0000001-0001-0001-0001-000000000011', 'Rice Sacks K11', 'Agricultural Products', 'Thai jasmine rice premium grade', 'sacks', 50.00, false, false),
    ('c0000001-0001-0001-0001-000000000012', 'Rubber Sheets L12', 'Agricultural Products', 'Natural rubber sheets for export', 'kg', 1.00, false, false),
    ('c0000001-0001-0001-0001-000000000013', 'Plastic Pellets M13', 'Plastics', 'Raw plastic pellets for manufacturing', 'kg', 1.00, false, false),
    ('c0000001-0001-0001-0001-000000000014', 'Paper Rolls N14', 'Paper Products', 'Industrial paper rolls for printing', 'rolls', 100.00, false, false),
    ('c0000001-0001-0001-0001-000000000015', 'Glass Panels O15', 'Construction Materials', 'Tempered glass panels for buildings', 'pieces', 30.00, false, false),
    ('c0000001-0001-0001-0001-000000000016', 'LED Displays P16', 'Electronics', 'LED display screens various sizes', 'pieces', 8.00, false, false),
    ('c0000001-0001-0001-0001-000000000017', 'Solar Panels Q17', 'Electronics', 'Photovoltaic solar panels 300W', 'pieces', 20.00, false, false),
    ('c0000001-0001-0001-0001-000000000018', 'Air Conditioner Units R18', 'Electronics', 'Split AC units for commercial use', 'pieces', 45.00, false, false),
    ('c0000001-0001-0001-0001-000000000019', 'Medical Equipment S19', 'Medical Equipment', 'Hospital medical equipment', 'pieces', 100.00, false, false),
    ('c0000001-0001-0001-0001-000000000020', 'Fertilizer Bags T20', 'Agricultural Products', 'NPK fertilizer for agriculture', 'bags', 50.00, false, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE VEHICLES (10 trucks)
-- ============================================================================

INSERT INTO mobile_vehicles (id, registration_number, registration_province, brand, model, body_type, status, driver_id, payload, service_years)
VALUES
    ('d0000001-0001-0001-0001-000000000001', 'กข-1234', 'Bangkok', 'HINO', '500 Series', 'Box Truck', 'available', 'a0000001-0001-0001-0001-000000000010', 8000.00, 3),
    ('d0000001-0001-0001-0001-000000000002', 'ขค-5678', 'Chonburi', 'ISUZU', 'FTR', 'Container', 'in_use', 'a0000001-0001-0001-0001-000000000011', 12000.00, 5),
    ('d0000001-0001-0001-0001-000000000003', 'คง-9012', 'Chiang Mai', 'Mitsubishi Fuso', 'Fighter', 'Flatbed', 'available', 'a0000001-0001-0001-0001-000000000012', 10000.00, 2),
    ('d0000001-0001-0001-0001-000000000004', 'งจ-3456', 'Khon Kaen', 'UD Trucks', 'Quon', 'Refrigerated', 'available', 'a0000001-0001-0001-0001-000000000013', 15000.00, 4),
    ('d0000001-0001-0001-0001-000000000005', 'จฉ-7890', 'Hat Yai', 'Volvo', 'FM', 'Tanker', 'maintenance', 'a0000001-0001-0001-0001-000000000014', 20000.00, 7),
    ('d0000001-0001-0001-0001-000000000006', 'ฉช-1122', 'Phuket', 'Scania', 'R Series', 'Container', 'available', 'a0000001-0001-0001-0001-000000000015', 25000.00, 6),
    ('d0000001-0001-0001-0001-000000000007', 'ชซ-3344', 'Bangkok', 'Mercedes-Benz', 'Actros', 'Trailer', 'in_use', NULL, 30000.00, 8),
    ('d0000001-0001-0001-0001-000000000008', 'ซฌ-5566', 'Rayong', 'MAN', 'TGX', 'Flatbed', 'available', NULL, 22000.00, 5),
    ('d0000001-0001-0001-0001-000000000009', 'ฌญ-7788', 'Nonthaburi', 'HINO', '700 Series', 'Dump Truck', 'available', NULL, 18000.00, 4),
    ('d0000001-0001-0001-0001-000000000010', 'ญฎ-9900', 'Samut Prakan', 'ISUZU', 'Giga', 'Box Truck', 'available', NULL, 16000.00, 3)
ON CONFLICT (registration_number) DO NOTHING;

-- ============================================================================
-- MOBILE JOBS (15 jobs - 5 completed, 3 in-progress, 7 pending)
-- ============================================================================

INSERT INTO mobile_jobs (id, job_number, customer_id, vehicle_id, driver_id, status, origin, destination, distance, cargo, cargo_weight, price, progress, pickup_date, delivery_date, completed_at)
VALUES
    -- Completed jobs (5)
    ('e0000001-0001-0001-0001-000000000001', 'JOB-00001', 'b0000001-0001-0001-0001-000000000001', 'd0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', 'completed', 'Bangkok, Lat Krabang', 'Chiang Mai, Mueang', 700.00, 'Electronic Components', 2500.00, 25000.00, 100, '2024-11-01 08:00:00', '2024-11-02 18:00:00', '2024-11-02 18:00:00'),
    ('e0000001-0001-0001-0001-000000000002', 'JOB-00002', 'b0000001-0001-0001-0001-000000000002', 'd0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000011', 'completed', 'Chiang Mai, San Sai', 'Bangkok, Bang Na', 720.00, 'Textile Fabric', 3500.00, 28000.00, 100, '2024-11-03 06:00:00', '2024-11-04 20:00:00', '2024-11-04 20:00:00'),
    ('e0000001-0001-0001-0001-000000000003', 'JOB-00003', 'b0000001-0001-0001-0001-000000000003', 'd0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000012', 'completed', 'Chonburi, Sri Racha', 'Rayong, Map Ta Phut', 80.00, 'Automotive Battery', 1200.00, 8000.00, 100, '2024-11-05 09:00:00', '2024-11-05 14:00:00', '2024-11-05 14:00:00'),
    ('e0000001-0001-0001-0001-000000000004', 'JOB-00004', 'b0000001-0001-0001-0001-000000000004', 'd0000001-0001-0001-0001-000000000004', 'a0000001-0001-0001-0001-000000000013', 'completed', 'Khon Kaen, Mueang', 'Udon Thani, Mueang', 120.00, 'Rice Sacks', 8000.00, 12000.00, 100, '2024-11-06 07:00:00', '2024-11-06 15:00:00', '2024-11-06 15:00:00'),
    ('e0000001-0001-0001-0001-000000000005', 'JOB-00005', 'b0000001-0001-0001-0001-000000000005', 'd0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000014', 'completed', 'Hat Yai, Mueang', 'Bangkok, Khlong Toei', 950.00, 'Rubber Sheets', 5000.00, 45000.00, 100, '2024-11-07 05:00:00', '2024-11-09 10:00:00', '2024-11-09 10:00:00'),
    -- In-progress jobs (3)
    ('e0000001-0001-0001-0001-000000000006', 'JOB-00006', 'b0000001-0001-0001-0001-000000000006', 'd0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', 'in_progress', 'Bangkok, Lat Krabang', 'Nakhon Ratchasima, Mueang', 260.00, 'Steel Beam', 15000.00, 35000.00, 65, '2024-12-01 08:00:00', '2024-12-02 16:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000007', 'JOB-00007', 'b0000001-0001-0001-0001-000000000007', 'd0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000011', 'in_progress', 'Phuket, Mueang', 'Bangkok, Don Mueang', 860.00, 'Frozen Seafood', 4000.00, 55000.00, 40, '2024-12-02 06:00:00', '2024-12-04 18:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000008', 'JOB-00008', 'b0000001-0001-0001-0001-000000000008', 'd0000001-0001-0001-0001-000000000004', 'a0000001-0001-0001-0001-000000000013', 'in_progress', 'Bangkok, Bang Kapi', 'Chiang Rai, Mueang', 830.00, 'Pharmaceutical Supplies', 800.00, 42000.00, 25, '2024-12-02 07:00:00', '2024-12-04 20:00:00', NULL),
    -- Pending jobs (7)
    ('e0000001-0001-0001-0001-000000000009', 'JOB-00009', 'b0000001-0001-0001-0001-000000000009', NULL, NULL, 'pending', 'Rayong, Map Ta Phut', 'Bangkok, Khlong Toei', 180.00, 'Chemical Compound', 10000.00, 22000.00, 0, '2024-12-05 09:00:00', '2024-12-05 18:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000010', 'JOB-00010', 'b0000001-0001-0001-0001-000000000010', NULL, NULL, 'pending', 'Nakhon Ratchasima, Mueang', 'Khon Kaen, Mueang', 190.00, 'Industrial Motor', 2000.00, 15000.00, 0, '2024-12-06 08:00:00', '2024-12-06 16:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000011', 'JOB-00011', 'b0000001-0001-0001-0001-000000000011', NULL, NULL, 'pending', 'Chiang Rai, Mae Sai', 'Bangkok, Lat Krabang', 900.00, 'Fresh Produce', 3000.00, 48000.00, 0, '2024-12-07 05:00:00', '2024-12-09 14:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000012', 'JOB-00012', 'b0000001-0001-0001-0001-000000000012', NULL, NULL, 'pending', 'Samut Prakan, Bang Phli', 'Ayutthaya, Mueang', 90.00, 'Cement Bags', 12000.00, 10000.00, 0, '2024-12-08 07:00:00', '2024-12-08 14:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000013', 'JOB-00013', 'b0000001-0001-0001-0001-000000000013', NULL, NULL, 'pending', 'Udon Thani, Mueang', 'Nong Khai, Mueang', 55.00, 'Medical Equipment', 500.00, 8000.00, 0, '2024-12-09 09:00:00', '2024-12-09 13:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000014', 'JOB-00014', 'b0000001-0001-0001-0001-000000000014', NULL, NULL, 'pending', 'Ayutthaya, Bang Pa-In', 'Lopburi, Mueang', 75.00, 'Cement Bags', 15000.00, 11000.00, 0, '2024-12-10 06:00:00', '2024-12-10 12:00:00', NULL),
    ('e0000001-0001-0001-0001-000000000015', 'JOB-00015', 'b0000001-0001-0001-0001-000000000015', NULL, NULL, 'pending', 'Hua Hin, Mueang', 'Bangkok, Ratchada', 200.00, 'Air Conditioner Units', 1500.00, 16000.00, 0, '2024-12-11 08:00:00', '2024-12-11 16:00:00', NULL)
ON CONFLICT (job_number) DO NOTHING;

-- ============================================================================
-- MOBILE JOB STOPS
-- ============================================================================

INSERT INTO mobile_job_stops (id, job_id, sequence, name, address, contact, phone, status, checked_in, checked_in_at)
VALUES
    -- Job 1 stops (completed)
    ('f0000001-0001-0001-0001-000000000001', 'e0000001-0001-0001-0001-000000000001', 1, 'Pickup Point', 'Lat Krabang Industrial Estate, Building A', 'Khun Somporn', '081-111-1111', 'completed', true, '2024-11-01 08:30:00'),
    ('f0000001-0001-0001-0001-000000000002', 'e0000001-0001-0001-0001-000000000001', 2, 'Delivery Point', 'Chiang Mai Distribution Center', 'Khun Arunee', '081-222-2222', 'completed', true, '2024-11-02 17:30:00'),
    -- Job 2 stops (completed)
    ('f0000001-0001-0001-0001-000000000003', 'e0000001-0001-0001-0001-000000000002', 1, 'Pickup Point', 'San Sai Textile Factory', 'Khun Wilai', '081-333-3333', 'completed', true, '2024-11-03 06:30:00'),
    ('f0000001-0001-0001-0001-000000000004', 'e0000001-0001-0001-0001-000000000002', 2, 'Delivery Point', 'Bang Na Warehouse', 'Khun Nittaya', '081-444-4444', 'completed', true, '2024-11-04 19:30:00'),
    -- Job 6 stops (in-progress)
    ('f0000001-0001-0001-0001-000000000011', 'e0000001-0001-0001-0001-000000000006', 1, 'Pickup Point', 'Bangkok Steel Warehouse', 'Khun Thaksin', '081-666-6666', 'completed', true, '2024-12-01 08:30:00'),
    ('f0000001-0001-0001-0001-000000000012', 'e0000001-0001-0001-0001-000000000006', 2, 'Rest Stop', 'Saraburi Service Area', 'N/A', 'N/A', 'completed', true, '2024-12-01 11:00:00'),
    ('f0000001-0001-0001-0001-000000000013', 'e0000001-0001-0001-0001-000000000006', 3, 'Delivery Point', 'Korat Construction Site', 'Khun Sawat', '081-888-8888', 'pending', false, NULL),
    -- Job 7 stops (in-progress)
    ('f0000001-0001-0001-0001-000000000014', 'e0000001-0001-0001-0001-000000000007', 1, 'Pickup Point', 'Phuket Fishing Port', 'Khun Ratana', '081-999-9999', 'completed', true, '2024-12-02 06:30:00'),
    ('f0000001-0001-0001-0001-000000000015', 'e0000001-0001-0001-0001-000000000007', 2, 'Cold Storage Stop', 'Surat Thani Cold Storage', 'Khun Manee', '081-000-0000', 'pending', false, NULL),
    ('f0000001-0001-0001-0001-000000000016', 'e0000001-0001-0001-0001-000000000007', 3, 'Delivery Point', 'Don Mueang Fresh Market', 'Khun Anong', '081-111-0000', 'pending', false, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE EXPENSES
-- ============================================================================

INSERT INTO mobile_expenses (id, job_id, user_id, title, category, amount, description, date)
VALUES
    -- Job 1 expenses
    ('g0000001-0001-0001-0001-000000000001', 'e0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', 'Fuel - Bangkok to Chiang Mai', 'Fuel', 3500.00, 'Diesel fuel for long haul journey', '2024-11-01 10:00:00'),
    ('g0000001-0001-0001-0001-000000000002', 'e0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', 'Tollway fees', 'Tolls', 450.00, 'Highway toll charges', '2024-11-01 08:30:00'),
    ('g0000001-0001-0001-0001-000000000003', 'e0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', 'Driver meals', 'Meals', 300.00, 'Lunch and dinner during trip', '2024-11-01 12:00:00'),
    -- Job 2 expenses
    ('g0000001-0001-0001-0001-000000000004', 'e0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000011', 'Fuel - Chiang Mai to Bangkok', 'Fuel', 3600.00, 'Diesel fuel return journey', '2024-11-03 08:00:00'),
    ('g0000001-0001-0001-0001-000000000005', 'e0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000011', 'Overnight accommodation', 'Accommodation', 800.00, 'Rest stop hotel', '2024-11-03 22:00:00'),
    -- Job 6 expenses (in-progress)
    ('g0000001-0001-0001-0001-000000000010', 'e0000001-0001-0001-0001-000000000006', 'a0000001-0001-0001-0001-000000000010', 'Fuel - Bangkok to Korat', 'Fuel', 2200.00, 'Diesel fuel', '2024-12-01 09:00:00'),
    ('g0000001-0001-0001-0001-000000000011', 'e0000001-0001-0001-0001-000000000006', 'a0000001-0001-0001-0001-000000000010', 'Tollway fees', 'Tolls', 280.00, 'Highway toll charges', '2024-12-01 08:30:00'),
    -- Job 7 expenses (in-progress)
    ('g0000001-0001-0001-0001-000000000012', 'e0000001-0001-0001-0001-000000000007', 'a0000001-0001-0001-0001-000000000011', 'Fuel - Phuket to Bangkok', 'Fuel', 4500.00, 'Diesel fuel long distance', '2024-12-02 07:00:00'),
    ('g0000001-0001-0001-0001-000000000013', 'e0000001-0001-0001-0001-000000000007', 'a0000001-0001-0001-0001-000000000011', 'Cold chain maintenance', 'Maintenance', 500.00, 'Refrigeration unit check', '2024-12-02 06:00:00')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE REVENUES
-- ============================================================================

INSERT INTO mobile_revenues (id, job_id, customer_id, invoice_number, amount, status, due_date, paid_at, payment_method)
VALUES
    ('h0000001-0001-0001-0001-000000000001', 'e0000001-0001-0001-0001-000000000001', 'b0000001-0001-0001-0001-000000000001', 'INV-2024-00001', 25000.00, 'paid', '2024-12-01', '2024-11-15 10:00:00', 'Bank Transfer'),
    ('h0000001-0001-0001-0001-000000000002', 'e0000001-0001-0001-0001-000000000002', 'b0000001-0001-0001-0001-000000000002', 'INV-2024-00002', 28000.00, 'paid', '2024-12-04', '2024-11-20 14:00:00', 'Bank Transfer'),
    ('h0000001-0001-0001-0001-000000000003', 'e0000001-0001-0001-0001-000000000003', 'b0000001-0001-0001-0001-000000000003', 'INV-2024-00003', 8000.00, 'paid', '2024-12-05', '2024-11-10 09:00:00', 'Cash'),
    ('h0000001-0001-0001-0001-000000000004', 'e0000001-0001-0001-0001-000000000004', 'b0000001-0001-0001-0001-000000000004', 'INV-2024-00004', 12000.00, 'pending', '2024-12-15', NULL, NULL),
    ('h0000001-0001-0001-0001-000000000005', 'e0000001-0001-0001-0001-000000000005', 'b0000001-0001-0001-0001-000000000005', 'INV-2024-00005', 45000.00, 'pending', '2024-12-20', NULL, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE BIDS (10 bids)
-- ============================================================================

INSERT INTO mobile_bids (id, bid_number, customer_id, origin, destination, cargo, cargo_weight, requested_price, submitted_price, status, pickup_date, expires_at)
VALUES
    ('i0000001-0001-0001-0001-000000000001', 'BID-00001', 'b0000001-0001-0001-0001-000000000001', 'Bangkok, Lat Krabang', 'Chiang Mai, Mueang', 'Electronic Components', 2000.00, 22000.00, 20000.00, 'accepted', '2024-12-10', '2024-12-08'),
    ('i0000001-0001-0001-0001-000000000002', 'BID-00002', 'b0000001-0001-0001-0001-000000000002', 'Chiang Mai, San Sai', 'Bangkok, Bang Na', 'Textile Fabric', 4000.00, 30000.00, 27500.00, 'submitted', '2024-12-12', '2024-12-10'),
    ('i0000001-0001-0001-0001-000000000003', 'BID-00003', 'b0000001-0001-0001-0001-000000000003', 'Chonburi, Sri Racha', 'Rayong, Map Ta Phut', 'Automotive Parts', 1500.00, 10000.00, NULL, 'open', '2024-12-15', '2024-12-13'),
    ('i0000001-0001-0001-0001-000000000004', 'BID-00004', 'b0000001-0001-0001-0001-000000000004', 'Khon Kaen, Mueang', 'Bangkok, Khlong Toei', 'Agricultural Products', 8000.00, 35000.00, NULL, 'open', '2024-12-18', '2024-12-16'),
    ('i0000001-0001-0001-0001-000000000005', 'BID-00005', 'b0000001-0001-0001-0001-000000000005', 'Hat Yai, Mueang', 'Phuket, Mueang', 'Rubber Sheets', 3000.00, 18000.00, 16500.00, 'rejected', '2024-12-08', '2024-12-06'),
    ('i0000001-0001-0001-0001-000000000006', 'BID-00006', 'b0000001-0001-0001-0001-000000000006', 'Bangkok, Lat Krabang', 'Nakhon Ratchasima, Mueang', 'Steel Beam', 20000.00, 40000.00, NULL, 'open', '2024-12-20', '2024-12-18'),
    ('i0000001-0001-0001-0001-000000000007', 'BID-00007', 'b0000001-0001-0001-0001-000000000007', 'Phuket, Mueang', 'Bangkok, Don Mueang', 'Frozen Seafood', 5000.00, 60000.00, 55000.00, 'submitted', '2024-12-22', '2024-12-20'),
    ('i0000001-0001-0001-0001-000000000008', 'BID-00008', 'b0000001-0001-0001-0001-000000000008', 'Bangkok, Bang Kapi', 'Udon Thani, Mueang', 'Pharmaceutical Supplies', 500.00, 38000.00, NULL, 'open', '2024-12-25', '2024-12-23'),
    ('i0000001-0001-0001-0001-000000000009', 'BID-00009', 'b0000001-0001-0001-0001-000000000009', 'Rayong, Map Ta Phut', 'Samut Prakan, Bang Phli', 'Chemical Compound', 12000.00, 15000.00, 14000.00, 'accepted', '2024-12-05', '2024-12-03'),
    ('i0000001-0001-0001-0001-000000000010', 'BID-00010', 'b0000001-0001-0001-0001-000000000010', 'Nakhon Ratchasima, Mueang', 'Khon Kaen, Mueang', 'Industrial Motor', 3000.00, 18000.00, NULL, 'expired', '2024-11-25', '2024-11-23')
ON CONFLICT (bid_number) DO NOTHING;

-- ============================================================================
-- MOBILE CHAT CONVERSATIONS (5 conversations)
-- ============================================================================

INSERT INTO mobile_conversations (id, type, name, created_by_id)
VALUES
    ('j0000001-0001-0001-0001-000000000001', 'group', 'Drivers Team Chat', 'a0000001-0001-0001-0001-000000000001'),
    ('j0000001-0001-0001-0001-000000000002', 'group', 'Bangkok-Chiang Mai Route', 'a0000001-0001-0001-0001-000000000004'),
    ('j0000001-0001-0001-0001-000000000003', 'private', NULL, 'a0000001-0001-0001-0001-000000000010'),
    ('j0000001-0001-0001-0001-000000000004', 'private', NULL, 'a0000001-0001-0001-0001-000000000007'),
    ('j0000001-0001-0001-0001-000000000005', 'group', 'Urgent Deliveries', 'a0000001-0001-0001-0001-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE CHAT PARTICIPANTS
-- ============================================================================

INSERT INTO mobile_conversation_participants (id, conversation_id, user_id, is_admin)
VALUES
    -- Drivers Team Chat (admin + all drivers)
    ('k0000001-0001-0001-0001-000000000001', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000001', true),
    ('k0000001-0001-0001-0001-000000000002', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', false),
    ('k0000001-0001-0001-0001-000000000003', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000011', false),
    ('k0000001-0001-0001-0001-000000000004', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000012', false),
    ('k0000001-0001-0001-0001-000000000005', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000013', false),
    -- Bangkok-Chiang Mai Route (company + 2 drivers)
    ('k0000001-0001-0001-0001-000000000006', 'j0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000004', true),
    ('k0000001-0001-0001-0001-000000000007', 'j0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000010', false),
    ('k0000001-0001-0001-0001-000000000008', 'j0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000011', false),
    -- Private chat (Driver Somchai - Customer John)
    ('k0000001-0001-0001-0001-000000000009', 'j0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000010', false),
    ('k0000001-0001-0001-0001-000000000010', 'j0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000007', false),
    -- Private chat (Customer Jane - Company)
    ('k0000001-0001-0001-0001-000000000011', 'j0000001-0001-0001-0001-000000000004', 'a0000001-0001-0001-0001-000000000008', false),
    ('k0000001-0001-0001-0001-000000000012', 'j0000001-0001-0001-0001-000000000004', 'a0000001-0001-0001-0001-000000000004', false),
    -- Urgent Deliveries (admin + company + senior drivers)
    ('k0000001-0001-0001-0001-000000000013', 'j0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000001', true),
    ('k0000001-0001-0001-0001-000000000014', 'j0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000004', false),
    ('k0000001-0001-0001-0001-000000000015', 'j0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000010', false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MOBILE CHAT MESSAGES
-- ============================================================================

INSERT INTO mobile_messages (id, conversation_id, sender_id, content, message_type, is_read, created_at)
VALUES
    -- Drivers Team Chat messages
    ('l0000001-0001-0001-0001-000000000001', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000001', 'Good morning team! Please check your assigned routes for today.', 'text', true, '2024-12-01 07:00:00'),
    ('l0000001-0001-0001-0001-000000000002', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000010', 'Got it! Starting my Bangkok-Korat run now. ETA 4 hours.', 'text', true, '2024-12-01 07:15:00'),
    ('l0000001-0001-0001-0001-000000000003', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000011', 'Traffic is heavy on Highway 1 near Saraburi. Taking alternate route via Highway 2.', 'text', true, '2024-12-01 09:30:00'),
    ('l0000001-0001-0001-0001-000000000004', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000012', 'Thanks for the heads up! Will avoid that area.', 'text', true, '2024-12-01 09:35:00'),
    ('l0000001-0001-0001-0001-000000000005', 'j0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000001', 'Good teamwork everyone. Stay safe on the road!', 'text', false, '2024-12-01 10:00:00'),
    -- Bangkok-Chiang Mai Route messages
    ('l0000001-0001-0001-0001-000000000006', 'j0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000004', 'New shipment ready for pickup at Lat Krabang tomorrow 6 AM.', 'text', true, '2024-12-01 16:00:00'),
    ('l0000001-0001-0001-0001-000000000007', 'j0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000010', 'Confirmed. I will be there at 5:30 AM for pre-trip inspection.', 'text', true, '2024-12-01 16:30:00'),
    -- Private chat (Driver - Customer) messages
    ('l0000001-0001-0001-0001-000000000008', 'j0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000010', 'Hello, I am on my way with your delivery. Current location: Ayutthaya.', 'text', true, '2024-12-01 11:00:00'),
    ('l0000001-0001-0001-0001-000000000009', 'j0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000007', 'Great! What is your estimated arrival time?', 'text', true, '2024-12-01 11:05:00'),
    ('l0000001-0001-0001-0001-000000000010', 'j0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000010', 'About 2 hours from now, around 1 PM. Will update you when I arrive.', 'text', true, '2024-12-01 11:10:00'),
    ('l0000001-0001-0001-0001-000000000011', 'j0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000007', 'Perfect, thank you! See you soon.', 'text', false, '2024-12-01 11:12:00'),
    -- Urgent Deliveries messages
    ('l0000001-0001-0001-0001-000000000012', 'j0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000001', 'URGENT: New priority delivery for Central Pharma. Need confirmation ASAP.', 'text', true, '2024-12-02 08:00:00'),
    ('l0000001-0001-0001-0001-000000000013', 'j0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000010', 'I can take it after my current delivery. Available around 2 PM.', 'text', true, '2024-12-02 08:10:00'),
    ('l0000001-0001-0001-0001-000000000014', 'j0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000004', 'Approved. Somchai, please proceed. Details sent to your app.', 'text', false, '2024-12-02 08:15:00')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================

