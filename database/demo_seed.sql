-- ============================================================================
-- Demo seed data for Trucker Web
-- This file is mounted into /docker-entrypoint-initdb.d and executed once
-- when the PostgreSQL volume is created for the first time.
-- ============================================================================

BEGIN;

-- Ensure at least one business type exists for demo organizations
INSERT INTO business_types (code, name_th, name_en)
VALUES
    ('LOGISTICS', 'โลจิสติกส์', 'Logistics')
ON CONFLICT (code) DO NOTHING;

-- User positions used by demo accounts
INSERT INTO user_positions (
    code, name_th, name_en, is_active,
    is_dashboard, is_user, is_chat, is_quotation,
    is_order, is_truck, is_package, is_profile
) VALUES
    ('ADMIN', 'ผู้ดูแลระบบ', 'Administrator', true, true, true, true, true, true, true, true, true),
    ('FACTORY_MANAGER', 'ผู้จัดการโรงงาน', 'Factory Manager', true, true, true, true, true, true, true, true, true),
    ('COMPANY_MANAGER', 'ผู้จัดการบริษัท', 'Company Manager', true, true, true, true, true, true, true, true, true),
    ('DRIVER', 'พนักงานขับรถ', 'Driver', true, false, false, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE
SET name_en = EXCLUDED.name_en,
    updated_at = NOW();

-- Demo organizations (one factory, one company)
INSERT INTO organizations (
    id, display_code, name, type, business_type_id,
    dial_code, phone, email, status, created_at, updated_at
) VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'DEMO-FACTORY',
        'Demo Factory Co., Ltd.',
        'FACTORY',
        (SELECT id FROM business_types WHERE code = 'LOGISTICS'),
        '+66',
        '020000111',
        'factory@demo.com',
        'ACTIVE',
        NOW(),
        NOW()
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'DEMO-COMPANY',
        'Demo Company Ltd.',
        'COMPANY',
        (SELECT id FROM business_types WHERE code = 'LOGISTICS'),
        '+66',
        '020000222',
        'company@demo.com',
        'ACTIVE',
        NOW(),
        NOW()
    )
ON CONFLICT (display_code) DO UPDATE
SET name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Helper function to fetch position ids
WITH position_ids AS (
    SELECT
        (SELECT id FROM user_positions WHERE code = 'ADMIN') AS admin_id,
        (SELECT id FROM user_positions WHERE code = 'FACTORY_MANAGER') AS factory_manager_id,
        (SELECT id FROM user_positions WHERE code = 'COMPANY_MANAGER') AS company_manager_id,
        (SELECT id FROM user_positions WHERE code = 'DRIVER') AS driver_id
)
-- Demo users for each platform role
INSERT INTO users (
    id, display_code, username, email, password_hash,
    first_name, last_name, dial_code, phone, id_card,
    image_url, role, position_id, organization_id,
    status, trucker_id, deleted, created_at, updated_at
)
SELECT
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'DEMO-SUPERADMIN',
    'superadmin@demo.com',
    'superadmin@demo.com',
    crypt('Demo@123', gen_salt('bf', 10)),
    'Demo',
    'Superadmin',
    '+66',
    '0800000001',
    NULL,
    NULL,
    'SUPERADMIN',
    admin_id,
    NULL,
    'ACTIVE',
    NULL,
    false,
    NOW(),
    NOW()
FROM position_ids
ON CONFLICT (username) DO NOTHING;

WITH position_ids AS (
    SELECT
        (SELECT id FROM user_positions WHERE code = 'ADMIN') AS admin_id,
        (SELECT id FROM user_positions WHERE code = 'FACTORY_MANAGER') AS factory_manager_id,
        (SELECT id FROM user_positions WHERE code = 'COMPANY_MANAGER') AS company_manager_id,
        (SELECT id FROM user_positions WHERE code = 'DRIVER') AS driver_id
)
INSERT INTO users (
    id, display_code, username, email, password_hash,
    first_name, last_name, dial_code, phone, id_card,
    image_url, role, position_id, organization_id,
    status, trucker_id, deleted, created_at, updated_at
)
SELECT
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'DEMO-FACTORY-ADMIN',
    'factory@demo.com',
    'factory@demo.com',
    crypt('Demo@123', gen_salt('bf', 10)),
    'Demo',
    'Factory',
    '+66',
    '0800000002',
    NULL,
    NULL,
    'ORGANIZATION',
    factory_manager_id,
    '11111111-1111-1111-1111-111111111111',
    'ACTIVE',
    NULL,
    false,
    NOW(),
    NOW()
FROM position_ids
ON CONFLICT (username) DO NOTHING;

WITH position_ids AS (
    SELECT
        (SELECT id FROM user_positions WHERE code = 'ADMIN') AS admin_id,
        (SELECT id FROM user_positions WHERE code = 'FACTORY_MANAGER') AS factory_manager_id,
        (SELECT id FROM user_positions WHERE code = 'COMPANY_MANAGER') AS company_manager_id,
        (SELECT id FROM user_positions WHERE code = 'DRIVER') AS driver_id
)
INSERT INTO users (
    id, display_code, username, email, password_hash,
    first_name, last_name, dial_code, phone, id_card,
    image_url, role, position_id, organization_id,
    status, trucker_id, deleted, created_at, updated_at
)
SELECT
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'DEMO-COMPANY-ADMIN',
    'company@demo.com',
    'company@demo.com',
    crypt('Demo@123', gen_salt('bf', 10)),
    'Demo',
    'Company',
    '+66',
    '0800000003',
    NULL,
    NULL,
    'ORGANIZATION',
    company_manager_id,
    '22222222-2222-2222-2222-222222222222',
    'ACTIVE',
    NULL,
    false,
    NOW(),
    NOW()
FROM position_ids
ON CONFLICT (username) DO NOTHING;

WITH position_ids AS (
    SELECT
        (SELECT id FROM user_positions WHERE code = 'DRIVER') AS driver_id
), inserted_user AS (
    INSERT INTO users (
        id, display_code, username, email, password_hash,
        first_name, last_name, dial_code, phone, id_card,
        image_url, role, position_id, organization_id,
        status, trucker_id, deleted, created_at, updated_at
    )
    SELECT
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'DEMO-DRIVER-USER',
        'driver@demo.com',
        'driver@demo.com',
        crypt('Demo@123', gen_salt('bf', 10)),
        'Demo',
        'Driver',
        '+66',
        '0800000004',
        NULL,
        NULL,
        'DRIVER',
        driver_id,
        '22222222-2222-2222-2222-222222222222',
        'ACTIVE',
        NULL,
        false,
        NOW(),
        NOW()
    FROM position_ids
    ON CONFLICT (username) DO NOTHING
    RETURNING id
), target_user AS (
    SELECT id FROM inserted_user
    UNION ALL
    SELECT id FROM users WHERE username = 'driver@demo.com' LIMIT 1
)
INSERT INTO drivers (
    id,
    display_code,
    user_id,
    type,
    company_id,
    id_card_image_url,
    vehicle_registration_image_url,
    vehicle_license_image_url,
    rejected_reason,
    status,
    deleted,
    created_at,
    updated_at
)
SELECT
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'DEMO-DRIVER-001',
    target_user.id,
    'freelance',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    NULL,
    NULL,
    NULL,
    'APPROVED',
    false,
    NOW(),
    NOW()
FROM target_user
ON CONFLICT (display_code) DO NOTHING;

-- ============================================================================
-- Additional business data to keep the frontend flows populated
-- ============================================================================

-- Organization addresses, documents, and signatures
INSERT INTO organization_addresses (
    id,
    organization_id,
    address_line1,
    postal_code,
    latitude,
    longitude,
    is_primary,
    created_at,
    updated_at
)
VALUES
    (
        '5a1d7e1b-8c42-4d27-9287-7191b6f0f111',
        '11111111-1111-1111-1111-111111111111',
        '88 Factory Road, Bang Rak, Bangkok',
        '10110',
        13.736717,
        100.523186,
        true,
        NOW(),
        NOW()
    ),
    (
        '3c0f8de2-7f23-4ca4-84b8-464ee5de9d22',
        '22222222-2222-2222-2222-222222222222',
        '55 Logistics Park, Si Racha, Chonburi',
        '20000',
        13.361143,
        100.984673,
        true,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO UPDATE
SET address_line1 = EXCLUDED.address_line1,
    postal_code   = EXCLUDED.postal_code,
    latitude      = EXCLUDED.latitude,
    longitude     = EXCLUDED.longitude,
    is_primary    = EXCLUDED.is_primary,
    updated_at    = NOW();

INSERT INTO organization_documents (
    id,
    organization_id,
    document_type,
    file_url,
    created_at,
    updated_at
)
VALUES
    (
        'f9a0fd99-a6a0-4b3e-92ec-24fd3d1c6a45',
        '11111111-1111-1111-1111-111111111111',
        'CERTIFICATE',
        'https://example.com/docs/factory-cert.pdf',
        NOW(),
        NOW()
    ),
    (
        '4e6bcd81-2b21-4b36-9c66-0ecbb0db0c3e',
        '22222222-2222-2222-2222-222222222222',
        'REGISTRATION',
        'https://example.com/docs/company-registration.pdf',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO UPDATE
SET document_type = EXCLUDED.document_type,
    file_url      = EXCLUDED.file_url,
    updated_at    = NOW();

INSERT INTO organization_signatures (
    id,
    organization_id,
    type,
    sign,
    created_at,
    updated_at
)
VALUES
    (
        'acf2a589-0cf5-4a36-8c5d-fa7c2a5289de',
        '11111111-1111-1111-1111-111111111111',
        'text',
        'Demo Factory Approver',
        NOW(),
        NOW()
    ),
    (
        'f4b458f2-1b5c-4a07-bd67-b3b168365d7b',
        '22222222-2222-2222-2222-222222222222',
        'text',
        'Demo Company Approver',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO UPDATE
SET type = EXCLUDED.type,
    sign = EXCLUDED.sign,
    updated_at = NOW();

-- Demo truck for assignment flows
INSERT INTO trucks (
    id,
    truck_code,
    license_plate_value,
    license_plate_province,
    brand,
    year,
    vin,
    color,
    type,
    fuel_type,
    size,
    department_type,
    company_id,
    driver_id,
    capacity_weight,
    capacity_weight_unit,
    capacity_width,
    capacity_length,
    capacity_height,
    capacity_unit,
    containers,
    current_location,
    current_latitude,
    current_longitude,
    front_image_url,
    back_image_url,
    side_image_url,
    license_plate_image_url,
    document_urls,
    remark,
    is_active,
    created_by,
    updated_by,
    created_at,
    updated_at
)
VALUES (
    '6ce15e22-6ce4-4c0b-b2d4-0b47a1a7cb37',
    'TRK-DEMO-001',
    '10-1234',
    'Bangkok',
    'Isuzu',
    '2022',
    'VINDEMO1234567890',
    'White',
    'TRAILER',
    'DIESEL',
    '6_WHEEL',
    'company',
    '22222222-2222-2222-2222-222222222222',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    15000,
    'kg',
    2.50,
    8.00,
    2.30,
    'm',
    ARRAY['40FT']::truck_container[],
    'On route to Chiang Mai',
    15.870000,
    100.992500,
    'https://example.com/truck/front.jpg',
    'https://example.com/truck/back.jpg',
    'https://example.com/truck/side.jpg',
    'https://example.com/truck/license.jpg',
    ARRAY['https://example.com/truck/inspection.pdf'],
    'Primary demo truck for showcases',
    true,
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET current_location = EXCLUDED.current_location,
    current_latitude = EXCLUDED.current_latitude,
    current_longitude = EXCLUDED.current_longitude,
    updated_at       = NOW();

-- Routes, RFQs, bids, quotations
INSERT INTO master_routes (
    id,
    display_code,
    origin_province,
    origin_district,
    origin_latitude,
    origin_longitude,
    destination_province,
    destination_district,
    destination_latitude,
    destination_longitude,
    distance_value,
    created_at,
    updated_at
)
VALUES (
    '31c5e320-7d7b-4c9b-85a1-5c5a2d4f1a10',
    'MR-DEMO-001',
    'Bangkok',
    'Bang Rak',
    13.736700,
    100.523200,
    'Chiang Mai',
    'Mueang Chiang Mai',
    18.788300,
    98.985300,
    700,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET origin_province      = EXCLUDED.origin_province,
    destination_province = EXCLUDED.destination_province,
    distance_value       = EXCLUDED.distance_value,
    updated_at           = NOW();

INSERT INTO factory_routes (
    id,
    factory_id,
    master_route_id,
    route_factory_code,
    shipping_type,
    type,
    distance_value,
    status,
    offer_price,
    unit,
    display_code,
    created_at,
    updated_at
)
VALUES (
    'b5fbc1bb-bc40-47d9-9530-10c21c5b9d8d',
    '11111111-1111-1111-1111-111111111111',
    '31c5e320-7d7b-4c9b-85a1-5c5a2d4f1a10',
    'FR-DEMO-001',
    'landFreight',
    'oneWay',
    700,
    'confirmed',
    12000,
    'trip',
    'FACT-ROUTE-001',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET status     = EXCLUDED.status,
    offer_price = EXCLUDED.offer_price,
    updated_at  = NOW();

INSERT INTO route_price_entries (
    id,
    factory_route_id,
    truck_size,
    price,
    unit_price,
    created_at,
    updated_at
)
VALUES (
    '38f3a73b-9ffd-4667-9a54-9c7153acd763',
    'b5fbc1bb-bc40-47d9-9530-10c21c5b9d8d',
    '6_WHEEL',
    12000,
    'THB/trip',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET price     = EXCLUDED.price,
    unit_price = EXCLUDED.unit_price,
    updated_at = NOW();

INSERT INTO master_routes (
    id,
    display_code,
    origin_province,
    origin_district,
    origin_latitude,
    origin_longitude,
    destination_province,
    destination_district,
    destination_latitude,
    destination_longitude,
    distance_value,
    created_at,
    updated_at
)
VALUES (
    '7d6a6f34-8b6c-4e7f-bec3-1b5d0e02abcd',
    'MR-DEMO-002',
    'Chonburi',
    'Si Racha',
    13.173699,
    100.930010,
    'Rayong',
    'Mueang Rayong',
    12.683333,
    101.266667,
    120,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET origin_province      = EXCLUDED.origin_province,
    destination_province = EXCLUDED.destination_province,
    distance_value       = EXCLUDED.distance_value,
    updated_at           = NOW();

INSERT INTO factory_routes (
    id,
    factory_id,
    master_route_id,
    route_factory_code,
    shipping_type,
    type,
    distance_value,
    distance_unit,
    status,
    offer_price,
    unit,
    display_code,
    created_at,
    updated_at
)
VALUES (
    'c2d5e6f7-1234-4abc-9def-223344556677',
    '11111111-1111-1111-1111-111111111111',
    '7d6a6f34-8b6c-4e7f-bec3-1b5d0e02abcd',
    'FR-DEMO-002',
    'landFreight',
    'oneWay',
    120,
    'km',
    'pending',
    6500,
    'trip',
    'FACT-ROUTE-002',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET status      = EXCLUDED.status,
    offer_price = EXCLUDED.offer_price,
    updated_at  = NOW();

INSERT INTO route_price_entries (
    id,
    factory_route_id,
    truck_size,
    price,
    unit_price,
    created_at,
    updated_at
)
VALUES (
    '5f4e3d2c-1b0a-4c5d-8e7f-998877665544',
    'c2d5e6f7-1234-4abc-9def-223344556677',
    '10_WHEEL',
    15000,
    'THB/trip',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET price     = EXCLUDED.price,
    unit_price = EXCLUDED.unit_price,
    updated_at = NOW();

INSERT INTO rfqs (
    id,
    display_code,
    factory_id,
    rfq_status,
    active,
    rfq_type,
    send_rfq_to,
    vehicle_size,
    vehicle_type,
    product_type,
    contact_start,
    contact_end,
    default_oil_range,
    oil_rate_price,
    price_rate_up,
    price_rate_down,
    add_on_emp,
    add_on_cost_per_emp,
    rfq_reason,
    signature_factory_type,
    signature_factory_sign,
    total_bids,
    created_by,
    created_at,
    updated_at
)
VALUES (
    'd0bba111-0c77-46a8-a8c4-4860df1d1b11',
    'RFQ-DEMO-001',
    '11111111-1111-1111-1111-111111111111',
    'Published',
    'Active',
    'oneWay',
    'all',
    '6_WHEEL',
    'Normal',
    'Steel Coils',
    CURRENT_DATE - INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '23 days',
    2,
    32.50,
    1.25,
    1.00,
    'Loader',
    500.00,
    ARRAY['Seasonal demand'],
    'text',
    'Demo Factory Signature',
    1,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET rfq_status = EXCLUDED.rfq_status,
    total_bids = EXCLUDED.total_bids,
    updated_at = NOW();

INSERT INTO rfq_routes (
    id,
    rfq_id,
    factory_route_id,
    offer_price,
    unit,
    created_at
)
VALUES (
    '7d8c1a51-0aa1-4a0e-b5a9-b5d0c914f5c4',
    'd0bba111-0c77-46a8-a8c4-4860df1d1b11',
    'b5fbc1bb-bc40-47d9-9530-10c21c5b9d8d',
    11800,
    'trip',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET offer_price = EXCLUDED.offer_price;

INSERT INTO rfq_companies (
    id,
    rfq_id,
    company_id,
    created_at
)
VALUES (
    '4a12ba3f-1d4b-4a76-8e5e-6b86ef1a9a2e',
    'd0bba111-0c77-46a8-a8c4-4860df1d1b11',
    '22222222-2222-2222-2222-222222222222',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bids (
    id,
    display_code,
    rfq_id,
    company_id,
    bid_status,
    oil_range,
    bid_reason,
    signature_company_type,
    signature_company_sign,
    created_by,
    created_at,
    updated_at
)
VALUES (
    'a9f9a2f0-773e-4f85-9a84-71b8b26f7b32',
    'BID-DEMO-001',
    'd0bba111-0c77-46a8-a8c4-4860df1d1b11',
    '22222222-2222-2222-2222-222222222222',
    'Submitted',
    2,
    'Capacity ready within 3 days',
    'text',
    'Demo Company Signature',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET bid_status = EXCLUDED.bid_status,
    updated_at = NOW();

INSERT INTO bid_details (
    id,
    bid_id,
    factory_route_id,
    bid_base_price,
    created_at
)
VALUES (
    '154cf5d5-55de-4676-a223-8a45568ba689',
    'a9f9a2f0-773e-4f85-9a84-71b8b26f7b32',
    'b5fbc1bb-bc40-47d9-9530-10c21c5b9d8d',
    12500,
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET bid_base_price = EXCLUDED.bid_base_price;

INSERT INTO bid_oils (
    id,
    bid_detail_id,
    oil_name,
    price_yesterday,
    price_today,
    price_tomorrow,
    price_dif_yesterday,
    price_dif_tomorrow,
    icon,
    created_at
)
VALUES (
    '6df98991-bb01-4371-a26a-fa4dd19a401c',
    '154cf5d5-55de-4676-a223-8a45568ba689',
    'Diesel B7',
    31.50,
    32.00,
    32.40,
    -0.50,
    0.40,
    'https://example.com/icons/oil.svg',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET price_today     = EXCLUDED.price_today,
    price_tomorrow  = EXCLUDED.price_tomorrow,
    price_dif_tomorrow = EXCLUDED.price_dif_tomorrow;

INSERT INTO quotations (
    id,
    display_code,
    bid_id,
    rfq_id,
    quotation_status,
    contract_start,
    contract_end,
    contract_time,
    document_url,
    expired_at,
    created_at,
    updated_at
)
VALUES (
    '0a9f0c8a-10df-47da-92b3-9b2074fa3438',
    'QUO-DEMO-001',
    'a9f9a2f0-773e-4f85-9a84-71b8b26f7b32',
    'd0bba111-0c77-46a8-a8c4-4860df1d1b11',
    'Approved',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '90 days',
    '90 days',
    'https://example.com/docs/quotation.pdf',
    CURRENT_DATE + INTERVAL '120 days',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET quotation_status = EXCLUDED.quotation_status,
    contract_end     = EXCLUDED.contract_end,
    updated_at       = NOW();

-- Packages and subscriptions
INSERT INTO packages (
    id,
    code,
    name,
    description_th,
    description_en,
    type,
    duration_value,
    duration_unit,
    price,
    is_active,
    start_date,
    end_date,
    remark,
    created_at,
    updated_at
)
VALUES (
    '8f1ce53c-ccf0-4a3a-bae7-9fb4f5565c20',
    'PKG-MONTHLY',
    'Monthly Essentials',
    'แพ็กเกจสำหรับผู้ประกอบการรายเดือน',
    'Monthly subscription covering RFQ, bids, and orders',
    'monthly',
    1,
    'month',
    2999,
    true,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '335 days',
    'Includes dashboard, RFQ, bid, and truck modules',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET price     = EXCLUDED.price,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO user_packages (
    id,
    user_id,
    package_id,
    start_date,
    end_date,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '23fefc37-91f9-4a88-8e8c-0a77d8d0b0ef',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '8f1ce53c-ccf0-4a3a-bae7-9fb4f5565c20',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '15 days',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET start_date = EXCLUDED.start_date,
    end_date   = EXCLUDED.end_date,
    is_active  = EXCLUDED.is_active,
    updated_at = NOW();

-- Orders and related operational tables
INSERT INTO orders (
    id,
    display_code,
    factory_id,
    factory_name,
    order_type,
    vehicle_type,
    vehicle_size,
    items,
    start_destination,
    destination,
    distance,
    origin_province,
    master_route_type,
    order_status,
    payment_status,
    payment_type,
    delivery_type,
    price,
    fuel_cost,
    fuel_rate,
    max_gross,
    tare,
    container_no,
    seal_no,
    expensive,
    created_by,
    updated_by,
    created_at,
    updated_at
)
VALUES (
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    'ORDER-DEMO-001',
    '11111111-1111-1111-1111-111111111111',
    'Demo Factory Co., Ltd.',
    'oneWay',
    'Normal',
    '6_WHEEL',
    'Steel coils',
    'Bangkok Warehouse',
    'Chiang Mai Plant',
    700,
    'Bangkok',
    'oneWay',
    'Published',
    'Unpaid',
    'Credit',
    'Standard',
    15000,
    4500,
    'B7',
    15000,
    3500,
    'CONT-0001',
    'SEAL-0001',
    250000,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET order_status = EXCLUDED.order_status,
    updated_at   = NOW();

INSERT INTO order_companies (
    id,
    order_id,
    company_id,
    company_name,
    company_name_th,
    address,
    contact_number,
    email,
    created_at
)
VALUES (
    'a4e2d3c0-078c-4d3c-8343-df93b1d6dfd7',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    '22222222-2222-2222-2222-222222222222',
    'Demo Company Ltd.',
    'บริษัท เดโม',
    '55 Logistics Park, Si Racha, Chonburi',
    '020000222',
    'company@demo.com',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET address        = EXCLUDED.address,
    contact_number = EXCLUDED.contact_number,
    email          = EXCLUDED.email;

INSERT INTO order_drivers (
    id,
    order_id,
    driver_id,
    driver_name,
    driver_contact,
    truck_id,
    truck_code,
    license_plate,
    assigned_at,
    assigned_by
)
VALUES (
    'f7c2f304-8e63-4a7c-9df8-7a3cefa12bfc',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Demo Driver',
    '0800000004',
    '6ce15e22-6ce4-4c0b-b2d4-0b47a1a7cb37',
    'TRK-DEMO-001',
    '10-1234',
    NOW(),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
)
ON CONFLICT (id) DO UPDATE
SET driver_contact = EXCLUDED.driver_contact,
    truck_id       = EXCLUDED.truck_id;

INSERT INTO driver_assignment_history (
    id,
    order_id,
    driver_id,
    assigned_at,
    assigned_by
)
VALUES (
    'c3e1af4f-9b8d-45de-8d4c-9ce64b0c2491',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    NOW(),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
)
ON CONFLICT (id) DO UPDATE
SET assigned_at = EXCLUDED.assigned_at,
    assigned_by = EXCLUDED.assigned_by;

INSERT INTO order_assistant_staff (
    id,
    order_id,
    staff_id,
    staff_name,
    staff_contact,
    compensation,
    created_at
)
VALUES (
    '1cc0a5d9-c693-4f1a-9a5d-0c6c6db1b1aa',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Company Admin',
    '0800000003',
    1200,
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET staff_contact = EXCLUDED.staff_contact,
    compensation  = EXCLUDED.compensation;

INSERT INTO order_check_ins (
    id,
    order_id,
    sequence,
    lat,
    lon,
    location,
    "timestamp",
    status,
    updated_at
)
VALUES (
    'e87ab3e6-65b2-4895-94b3-191f85632c41',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    '1',
    13.736700,
    100.523200,
    'Bangkok Warehouse',
    NOW(),
    'Departed',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET status     = EXCLUDED.status,
    updated_at = NOW();

INSERT INTO order_registration_history (
    id,
    order_id,
    registration_id,
    registration_date,
    updated_by,
    created_at
)
VALUES (
    '9f1641ab-e7b7-4f4a-93e4-f09a4c8fc041',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    'REG-2024-001',
    NOW() - INTERVAL '1 day',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET registration_date = EXCLUDED.registration_date,
    updated_by        = EXCLUDED.updated_by;

-- Coins, notifications, chat
INSERT INTO coins (
    id,
    trucker_id,
    type,
    amount,
    balance_before,
    balance_after,
    description,
    reference_id,
    reference_type,
    created_by,
    created_at
)
VALUES (
    'c4ec3f4f-33e5-4b0f-8239-2b4910912233',
    'DEMO-COMPANY',
    'paid',
    1500,
    5000,
    3500,
    'Payment for ORDER-DEMO-001',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    'order',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET amount          = EXCLUDED.amount,
    balance_before  = EXCLUDED.balance_before,
    balance_after   = EXCLUDED.balance_after,
    description     = EXCLUDED.description,
    reference_id    = EXCLUDED.reference_id,
    reference_type  = EXCLUDED.reference_type,
    created_by      = EXCLUDED.created_by;

INSERT INTO notifications (
    id,
    user_id,
    subject,
    content,
    is_read,
    notification_type,
    reference_id,
    created_at
)
VALUES (
    'd8a7c23c-6d9f-4af1-9810-4a0a66a7f17d',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'New order created',
    'Order ORDER-DEMO-001 is awaiting truck confirmation.',
    false,
    'order',
    'b31c3a8c-8c4a-4ef7-bc6d-35d4c72c1a16',
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET content          = EXCLUDED.content,
    is_read          = EXCLUDED.is_read,
    notification_type = EXCLUDED.notification_type,
    reference_id     = EXCLUDED.reference_id;

INSERT INTO chat_rooms (
    id,
    participant1_id,
    participant2_id,
    last_message_at,
    created_at
)
VALUES (
    'ec121ac5-bf6f-4a9f-8d7b-bfbb2f3c9f2f',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET last_message_at = EXCLUDED.last_message_at;

INSERT INTO chat_messages (
    id,
    room_id,
    sender_id,
    message_type,
    content,
    is_read,
    created_at
)
VALUES (
    'fdab21d6-1e49-4b13-8080-9cf91e9c1a94',
    'ec121ac5-bf6f-4a9f-8d7b-bfbb2f3c9f2f',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'txt',
    'Please confirm the truck availability for ORDER-DEMO-001.',
    false,
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET content = EXCLUDED.content,
    is_read = EXCLUDED.is_read;

-- Additional system users for admin demo
INSERT INTO users (
    id, display_code, username, email, password_hash,
    first_name, last_name, dial_code, phone,
    role, position_id, organization_id,
    status, deleted, created_at, updated_at
)
VALUES
    (
        'f1111111-1111-1111-1111-111111111111',
        'DEMO-FACT-STAFF',
        'factory.staff@demo.com',
        'factory.staff@demo.com',
        crypt('Demo@123', gen_salt('bf', 10)),
        'Factory',
        'Staff',
        '+66',
        '0800000105',
        'ORGANIZATION',
        (SELECT id FROM user_positions WHERE code = 'FACTORY_MANAGER'),
        '11111111-1111-1111-1111-111111111111',
        'ACTIVE',
        false,
        NOW(),
        NOW()
    ),
    (
        'c1111111-2222-2222-2222-222222222222',
        'DEMO-COMP-STAFF',
        'company.staff@demo.com',
        'company.staff@demo.com',
        crypt('Demo@123', gen_salt('bf', 10)),
        'Company',
        'Staff',
        '+66',
        '0800000106',
        'ORGANIZATION',
        (SELECT id FROM user_positions WHERE code = 'COMPANY_MANAGER'),
        '22222222-2222-2222-2222-222222222222',
        'ACTIVE',
        false,
        NOW(),
        NOW()
    )
ON CONFLICT (username) DO NOTHING;

-- Demo internal driver
INSERT INTO users (
    id,
    display_code,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    dial_code,
    phone,
    role,
    organization_id,
    status,
    image_url,
    created_at,
    updated_at
)
VALUES (
    '99999999-aaaa-bbbb-cccc-111111111111',
    'DEMO-DRIVER-INT',
    'driver.internal@demo.com',
    'driver.internal@demo.com',
    crypt('Demo@123', gen_salt('bf', 10)),
    'Internal',
    'Driver',
    '+66',
    '0800000110',
    'DRIVER',
    '22222222-2222-2222-2222-222222222222',
    'ACTIVE',
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO drivers (
    id,
    display_code,
    user_id,
    type,
    company_id,
    id_card_image_url,
    vehicle_registration_image_url,
    vehicle_license_image_url,
    rejected_reason,
    status,
    created_at,
    updated_at
)
VALUES (
    '77777777-bbbb-cccc-dddd-222222222222',
    'DRV-DEMO-INT',
    '99999999-aaaa-bbbb-cccc-111111111111',
    'internal',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    NULL,
    NULL,
    NULL,
    'APPROVED',
    NOW(),
    NOW()
)
ON CONFLICT (display_code) DO NOTHING;

-- Demo freelance driver
INSERT INTO users (
    id,
    display_code,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    dial_code,
    phone,
    role,
    organization_id,
    status,
    image_url,
    created_at,
    updated_at
)
VALUES (
    '88888888-aaaa-bbbb-cccc-333333333333',
    'DEMO-DRIVER-FREE',
    'driver.freelance@demo.com',
    'driver.freelance@demo.com',
    crypt('Demo@123', gen_salt('bf', 10)),
    'Freelance',
    'Driver',
    '+66',
    '0800000111',
    'DRIVER',
    NULL,
    'PENDING',
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO drivers (
    id,
    display_code,
    user_id,
    type,
    company_id,
    id_card_image_url,
    vehicle_registration_image_url,
    vehicle_license_image_url,
    rejected_reason,
    status,
    created_at,
    updated_at
)
VALUES (
    '66666666-bbbb-cccc-dddd-444444444444',
    'DRV-DEMO-FREE',
    '88888888-aaaa-bbbb-cccc-333333333333',
    'freelance',
    NULL,
    'https://example.com/docs/idcard-demo.png',
    'https://example.com/docs/truck-registration-demo.png',
    'https://example.com/docs/driving-license-demo.png',
    NULL,
    'PENDING',
    NOW(),
    NOW()
)
ON CONFLICT (display_code) DO NOTHING;

COMMIT;

