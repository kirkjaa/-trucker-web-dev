-- Trucker Web Database Schema
-- PostgreSQL Database Initialization Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For bcrypt password hashing

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Organization Types
CREATE TYPE organization_type AS ENUM ('FACTORY', 'COMPANY');
CREATE TYPE organization_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE business_type AS ENUM ('TRANSPORTATION', 'LOGISTICS', 'FACTORY');

-- User Roles
CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'ORGANIZATION', 'DRIVER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'BANNED', 'REJECTED', 'CANCELLED', 'DRAFT');

-- RFQ Types
CREATE TYPE rfq_type AS ENUM ('oneWay', 'multiWay', 'abroad');
CREATE TYPE rfq_status AS ENUM ('Draft', 'Published', 'Expired', 'Canceled');
CREATE TYPE vehicle_size AS ENUM ('4_WHEEL', '6_WHEEL', '8_WHEEL', '10_WHEEL', '12_WHEEL', '14_WHEEL', '16_WHEEL', '18_WHEEL', '20_WHEEL');
CREATE TYPE vehicle_type AS ENUM ('Cool', 'Normal', 'Hot');

-- Bid Status
CREATE TYPE bid_status AS ENUM ('Draft', 'Submitted', 'Approved', 'Rejected', 'Canceled');

-- Quotation Status
CREATE TYPE quotation_status AS ENUM ('Pending', 'Approved', 'Expired');

-- Order Status
CREATE TYPE order_status AS ENUM ('Published', 'Matched', 'StartShipping', 'Shipped', 'Completed');
CREATE TYPE payment_status AS ENUM ('Unpaid', 'Paid');
CREATE TYPE payment_type AS ENUM ('Cash', 'Credit');
CREATE TYPE delivery_type AS ENUM ('Standard', 'Express');

-- Route Types
CREATE TYPE route_type AS ENUM ('oneWay', 'multiWay', 'abroad');
CREATE TYPE route_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE route_shipping_type AS ENUM ('landFreight', 'airFreight', 'seaFreight');

-- Truck Types
CREATE TYPE truck_type AS ENUM (
    'PICKUP_TRUCK', 'CARGO_VAN', 'TANKER_TRUCK', 
    'HAZARDOUS_MATERITAL_TRUCK', 'SPECIFIC_TRUCK', 
    'TRAILER', 'SEMI_TRAILER', 
    'SEMI_TRAILER_CARRYING_LONG_MATERIAL', 'TOWING_TRUCK'
);
CREATE TYPE truck_fuel_type AS ENUM (
    'DIESEL', 'BENZINE', 'GASOLINE', 'GASOHOL', 
    'CNG', 'LNG', 'HYDROGEN', 'BIODIESEL', 
    'ELECTRICT', 'HYBRID_DIESEL', 'HYBRID_GASOLINE'
);
CREATE TYPE truck_department_type AS ENUM ('factory', 'company', 'freelance');
CREATE TYPE truck_container AS ENUM ('20FT', '40FT', '45FT', '50FT');

-- Package Types
CREATE TYPE package_type AS ENUM ('weekly', 'monthly', 'annual');

-- Signature Types
CREATE TYPE signature_type AS ENUM ('text', 'image');

-- Driver Types
CREATE TYPE driver_type AS ENUM ('freelance', 'internal', 'freelance-review');
CREATE TYPE driver_status AS ENUM ('PENDING', 'APPROVED', 'BAN', 'REJECTED', 'CANCELLED', 'DRAFT');

-- Coin Types
CREATE TYPE coin_type AS ENUM ('topUp', 'withdraw', 'paid', 'received');

-- ============================================================================
-- MASTER DATA TABLES
-- ============================================================================

-- Provinces
CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Districts
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    province_id INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subdistricts
CREATE TABLE subdistricts (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business Types
CREATE TABLE business_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Positions
CREATE TABLE user_positions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_dashboard BOOLEAN DEFAULT false,
    is_user BOOLEAN DEFAULT false,
    is_chat BOOLEAN DEFAULT false,
    is_quotation BOOLEAN DEFAULT false,
    is_order BOOLEAN DEFAULT false,
    is_truck BOOLEAN DEFAULT false,
    is_package BOOLEAN DEFAULT false,
    is_profile BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Truck Types (Master)
CREATE TABLE truck_types_master (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Truck Sizes (Master)
CREATE TABLE truck_sizes_master (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ORGANIZATIONS (FACTORIES & COMPANIES)
-- ============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type organization_type NOT NULL,
    business_type_id INTEGER REFERENCES business_types(id),
    dial_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    tax_id VARCHAR(50),
    image_url TEXT,
    logo_image_url TEXT,
    trucker_id VARCHAR(100), -- External trucker platform ID
    status organization_status DEFAULT 'ACTIVE',
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- Organization Addresses
CREATE TABLE organization_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    province_id INTEGER REFERENCES provinces(id),
    district_id INTEGER REFERENCES districts(id),
    subdistrict_id INTEGER REFERENCES subdistricts(id),
    address_line1 TEXT,
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization Documents
CREATE TABLE organization_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization Signatures
CREATE TABLE organization_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    type signature_type NOT NULL,
    sign TEXT NOT NULL, -- text or image URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- USERS
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT, -- For admin users, null for OAuth users
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    dial_code VARCHAR(10),
    phone VARCHAR(20),
    id_card VARCHAR(50),
    image_url TEXT,
    role user_role NOT NULL,
    position_id INTEGER REFERENCES user_positions(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    status user_status DEFAULT 'PENDING',
    trucker_id VARCHAR(100), -- External trucker platform ID
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- User Packages (Subscription)
CREATE TABLE user_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID, -- References packages table
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DRIVERS
-- ============================================================================

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type driver_type NOT NULL,
    company_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    id_card_image_url TEXT,
    vehicle_registration_image_url TEXT,
    vehicle_license_image_url TEXT,
    rejected_reason TEXT,
    status driver_status DEFAULT 'PENDING',
    trucker_id VARCHAR(100),
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- ============================================================================
-- TRUCKS
-- ============================================================================

CREATE TABLE trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_code VARCHAR(50) UNIQUE NOT NULL,
    license_plate_value VARCHAR(20),
    license_plate_province VARCHAR(50),
    brand VARCHAR(100),
    year VARCHAR(4),
    vin VARCHAR(50) UNIQUE,
    color VARCHAR(50),
    type truck_type NOT NULL,
    fuel_type truck_fuel_type,
    size vehicle_size,
    department_type truck_department_type NOT NULL,
    factory_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    company_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    capacity_weight DECIMAL(10, 2),
    capacity_weight_unit VARCHAR(10),
    capacity_width DECIMAL(10, 2),
    capacity_length DECIMAL(10, 2),
    capacity_height DECIMAL(10, 2),
    capacity_unit VARCHAR(10),
    containers truck_container[],
    current_location TEXT,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    front_image_url TEXT,
    back_image_url TEXT,
    side_image_url TEXT,
    license_plate_image_url TEXT,
    document_urls TEXT[],
    remark TEXT,
    is_active BOOLEAN DEFAULT true,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- ============================================================================
-- ROUTES
-- ============================================================================

-- Master Routes
CREATE TABLE master_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    origin_province VARCHAR(100),
    origin_district VARCHAR(100),
    origin_latitude DECIMAL(10, 8),
    origin_longitude DECIMAL(11, 8),
    destination_province VARCHAR(100),
    destination_district VARCHAR(100),
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    return_point_province VARCHAR(100),
    return_point_district VARCHAR(100),
    return_point_latitude DECIMAL(10, 8),
    return_point_longitude DECIMAL(11, 8),
    distance_value DECIMAL(10, 2),
    distance_unit VARCHAR(10) DEFAULT 'km',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Factory Routes
CREATE TABLE factory_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    master_route_id UUID REFERENCES master_routes(id) ON DELETE CASCADE,
    route_factory_code VARCHAR(50) NOT NULL,
    shipping_type route_shipping_type,
    type route_type NOT NULL,
    distance_value DECIMAL(10, 2),
    distance_unit VARCHAR(10) DEFAULT 'km',
    status route_status DEFAULT 'pending',
    offer_price DECIMAL(12, 2),
    unit VARCHAR(20),
    display_code VARCHAR(50),
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(factory_id, route_factory_code)
);

-- Route Price Entries
CREATE TABLE route_price_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_route_id UUID REFERENCES factory_routes(id) ON DELETE CASCADE,
    truck_size vehicle_size NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    unit_price VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RFQs (REQUEST FOR QUOTATIONS)
-- ============================================================================

CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    factory_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    rfq_status rfq_status DEFAULT 'Draft',
    active VARCHAR(20) DEFAULT 'Active',
    rfq_type rfq_type NOT NULL,
    send_rfq_to VARCHAR(20) DEFAULT 'all', -- 'all' or 'only'
    vehicle_size vehicle_size,
    vehicle_type vehicle_type,
    product_type VARCHAR(100),
    contact_start DATE,
    contact_end DATE,
    default_oil_range INTEGER DEFAULT 2,
    oil_rate_price DECIMAL(10, 2),
    price_rate_up DECIMAL(10, 2),
    price_rate_down DECIMAL(10, 2),
    add_on_emp VARCHAR(100),
    add_on_cost_per_emp DECIMAL(10, 2),
    rfq_reason TEXT[],
    signature_factory_type signature_type,
    signature_factory_sign TEXT,
    total_bids INTEGER DEFAULT 0,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- RFQ Routes (Many-to-Many)
CREATE TABLE rfq_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    factory_route_id UUID REFERENCES factory_routes(id) ON DELETE CASCADE,
    offer_price DECIMAL(12, 2),
    unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RFQ Companies (Selected companies for RFQ)
CREATE TABLE rfq_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rfq_id, company_id)
);

-- ============================================================================
-- BIDS
-- ============================================================================

CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    bid_status bid_status DEFAULT 'Draft',
    oil_range INTEGER DEFAULT 2,
    bid_reason TEXT,
    signature_company_type signature_type,
    signature_company_sign TEXT,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Bid Details (Routes with prices)
CREATE TABLE bid_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
    factory_route_id UUID REFERENCES factory_routes(id) ON DELETE CASCADE,
    bid_base_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bid Oils (Oil price adjustments)
CREATE TABLE bid_oils (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_detail_id UUID REFERENCES bid_details(id) ON DELETE CASCADE,
    oil_name VARCHAR(100),
    price_yesterday DECIMAL(10, 2),
    price_today DECIMAL(10, 2),
    price_tomorrow DECIMAL(10, 2),
    price_dif_yesterday DECIMAL(10, 2),
    price_dif_tomorrow DECIMAL(10, 2),
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- QUOTATIONS
-- ============================================================================

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    quotation_status quotation_status DEFAULT 'Pending',
    contract_start DATE,
    contract_end DATE,
    contract_time VARCHAR(50),
    document_url TEXT,
    expired_at TIMESTAMP,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ORDERS
-- ============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_code VARCHAR(50) UNIQUE NOT NULL,
    factory_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    factory_name VARCHAR(255),
    order_type VARCHAR(20), -- 'oneWay', 'multiWay', 'csvImport', 'abroad'
    vehicle_type VARCHAR(50),
    vehicle_size vehicle_size,
    items TEXT,
    start_destination TEXT,
    destination TEXT,
    distance DECIMAL(10, 2),
    origin_province VARCHAR(100),
    master_route_type VARCHAR(50),
    order_status order_status DEFAULT 'Published',
    payment_status payment_status DEFAULT 'Unpaid',
    payment_type payment_type,
    delivery_type delivery_type DEFAULT 'Standard',
    price DECIMAL(12, 2),
    fuel_cost DECIMAL(10, 2),
    fuel_rate VARCHAR(50),
    max_gross DECIMAL(10, 2),
    tare DECIMAL(10, 2),
    container_no VARCHAR(50),
    seal_no VARCHAR(50),
    expensive DECIMAL(10, 2),
    is_deleted BOOLEAN DEFAULT false,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Order Companies
CREATE TABLE order_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    company_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    company_name_th VARCHAR(255),
    address TEXT,
    contact_number VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Drivers
CREATE TABLE order_drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    driver_name VARCHAR(255),
    driver_contact VARCHAR(20),
    truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
    truck_code VARCHAR(50),
    license_plate VARCHAR(20),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id)
);

-- Driver Assignment History
CREATE TABLE driver_assignment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    unassigned_at TIMESTAMP,
    unassigned_by UUID REFERENCES users(id)
);

-- Order Assistant Staff
CREATE TABLE order_assistant_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    staff_name VARCHAR(255),
    staff_contact VARCHAR(20),
    compensation DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Check-ins
CREATE TABLE order_check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sequence VARCHAR(10),
    lat DECIMAL(10, 8),
    lon DECIMAL(11, 8),
    location TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Registration History
CREATE TABLE order_registration_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    registration_id VARCHAR(100),
    registration_date TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PACKAGES
-- ============================================================================

CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description_th TEXT,
    description_en TEXT,
    type package_type NOT NULL,
    duration_value INTEGER,
    duration_unit VARCHAR(20), -- 'week', 'month', 'year'
    price DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COINS / TRANSACTIONS
-- ============================================================================

CREATE TABLE coins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trucker_id VARCHAR(100) NOT NULL, -- Organization or User trucker ID
    type coin_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    balance_before DECIMAL(12, 2),
    balance_after DECIMAL(12, 2),
    description TEXT,
    reference_id UUID, -- Reference to order, bid, etc.
    reference_type VARCHAR(50), -- 'order', 'bid', 'topup', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT,
    is_read BOOLEAN DEFAULT false,
    notification_type VARCHAR(50), -- 'order', 'bid', 'quotation', etc.
    reference_id UUID, -- Reference to related entity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- ============================================================================
-- CHAT (if needed)
-- ============================================================================

CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    participant2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant1_id, participant2_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) DEFAULT 'txt', -- 'txt', 'img', 'audio', 'file', 'loc', 'cmd', 'custome'
    content TEXT,
    file_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TEMPLATE DEFINITIONS
-- ============================================================================

CREATE TABLE template_field_definitions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_template_field UNIQUE (type, field_name)
);

CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    template_type VARCHAR(100) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE template_field_mappings (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
    field_id INTEGER REFERENCES template_field_definitions(id) ON DELETE RESTRICT,
    match_field VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_template_field_map UNIQUE (template_id, match_field)
);

-- ============================================================================
-- PLUGINS
-- ============================================================================

CREATE TYPE plugin_status AS ENUM ('draft', 'active', 'inactive');

CREATE TABLE plugins (
    id SERIAL PRIMARY KEY,
    plugin_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_location TEXT,
    plugin_type VARCHAR(150),
    description TEXT,
    contact_first_name VARCHAR(150),
    contact_last_name VARCHAR(150),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    account_username VARCHAR(150),
    account_password VARCHAR(255),
    limited_order_quota INTEGER,
    limited_price DECIMAL(12, 2),
    monthly_duration_days INTEGER,
    monthly_price DECIMAL(12, 2),
    yearly_duration_days INTEGER,
    yearly_price DECIMAL(12, 2),
    available_credit DECIMAL(14, 2) DEFAULT 0,
    status plugin_status DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plugin_features (
    id SERIAL PRIMARY KEY,
    plugin_id INTEGER REFERENCES plugins(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    description TEXT,
    limited_price DECIMAL(12, 2),
    monthly_price DECIMAL(12, 2),
    yearly_price DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_status ON users(status);

-- Organizations
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_display_code ON organizations(display_code);

-- Drivers
CREATE INDEX idx_drivers_user ON drivers(user_id);
CREATE INDEX idx_drivers_company ON drivers(company_id);
CREATE INDEX idx_drivers_status ON drivers(status);

-- Trucks
CREATE INDEX idx_trucks_factory ON trucks(factory_id);
CREATE INDEX idx_trucks_company ON trucks(company_id);
CREATE INDEX idx_trucks_driver ON trucks(driver_id);
CREATE INDEX idx_trucks_code ON trucks(truck_code);

-- RFQs
CREATE INDEX idx_rfqs_factory ON rfqs(factory_id);
CREATE INDEX idx_rfqs_status ON rfqs(rfq_status);
CREATE INDEX idx_rfqs_type ON rfqs(rfq_type);
CREATE INDEX idx_rfqs_created ON rfqs(created_at);

-- Bids
CREATE INDEX idx_bids_rfq ON bids(rfq_id);
CREATE INDEX idx_bids_company ON bids(company_id);
CREATE INDEX idx_bids_status ON bids(bid_status);

-- Orders
CREATE INDEX idx_orders_factory ON orders(factory_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_display_code ON orders(display_code);

-- Quotations
CREATE INDEX idx_quotations_bid ON quotations(bid_id);
CREATE INDEX idx_quotations_rfq ON quotations(rfq_id);
CREATE INDEX idx_quotations_status ON quotations(quotation_status);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Chat
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- Templates / Plugins
CREATE INDEX idx_templates_org ON templates(organization_id);
CREATE INDEX idx_templates_type ON templates(template_type);
CREATE INDEX idx_template_field_mappings_template ON template_field_mappings(template_id);
CREATE INDEX idx_plugins_status ON plugins(status);
CREATE INDEX idx_plugins_company ON plugins(company_name);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON trucks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_field_definitions_updated_at
    BEFORE UPDATE ON template_field_definitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_field_mappings_updated_at
    BEFORE UPDATE ON template_field_mappings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugins_updated_at
    BEFORE UPDATE ON plugins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate display codes
CREATE OR REPLACE FUNCTION generate_display_code(prefix VARCHAR, table_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    new_code VARCHAR;
    counter INTEGER;
BEGIN
    counter := 1;
    LOOP
        new_code := prefix || LPAD(counter::VARCHAR, 5, '0');
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = table_name 
            AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE column_name = 'display_code' 
                AND table_name = table_name
            )
        );
        counter := counter + 1;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA (Optional - can be loaded via migrations)
-- ============================================================================

-- Insert default business types
INSERT INTO business_types (code, name_th, name_en) VALUES
    ('TRANSPORTATION', 'ขนส่ง', 'Transportation'),
    ('LOGISTICS', 'โลจิสติกส์', 'Logistics'),
    ('FACTORY', 'โรงงาน', 'Factory')
ON CONFLICT (code) DO NOTHING;

-- Insert default package types (if needed)
-- This would typically be done via API or admin panel

-- COMMENT ON DATABASE current_database() IS 'Trucker Web Application Database - PostgreSQL Schema';

