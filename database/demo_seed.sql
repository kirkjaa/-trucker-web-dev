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
    'APPROVED',
    false,
    NOW(),
    NOW()
FROM target_user
ON CONFLICT (display_code) DO NOTHING;

COMMIT;

