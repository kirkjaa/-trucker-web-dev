-- ============================================================================
-- Trucker Mobile - Database Schema Extension
-- These tables extend the existing desktop schema for mobile-specific features
-- Run this AFTER init.sql has been executed
-- ============================================================================

-- ============================================================================
-- MOBILE ENUMS (prefixed to avoid conflicts with desktop enums)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE mobile_job_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mobile_bid_status AS ENUM ('open', 'submitted', 'accepted', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mobile_vehicle_status AS ENUM ('available', 'in_use', 'maintenance', 'unavailable');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mobile_stop_status AS ENUM ('pending', 'ready', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mobile_conversation_type AS ENUM ('private', 'group');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mobile_user_role AS ENUM ('admin', 'company', 'customer', 'shipping');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- MOBILE USERS
-- Separate user table for mobile app authentication
-- Can optionally link to desktop users via desktop_user_id
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Optional link to desktop user for unified accounts
    desktop_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role mobile_user_role DEFAULT 'shipping',
    display_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE CUSTOMERS
-- Customer/client records for the mobile app
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Optional link to desktop organization
    desktop_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Thailand',
    contact_person VARCHAR(255),
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE PRODUCTS
-- Product catalog for cargo tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(50) DEFAULT 'units',
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    requires_refrigeration BOOLEAN DEFAULT false,
    is_hazardous BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE VEHICLES
-- Fleet management for drivers
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Optional link to desktop truck
    desktop_truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    registration_province VARCHAR(100),
    vin VARCHAR(50),
    brand VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    body_type VARCHAR(100),
    plate_type VARCHAR(50),
    payload DECIMAL(10, 2),
    service_years INTEGER,
    status mobile_vehicle_status DEFAULT 'available',
    driver_id UUID REFERENCES mobile_user_profiles(id) ON DELETE SET NULL,
    has_trailer BOOLEAN DEFAULT false,
    trailer_registration VARCHAR(50),
    insurance_value DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE JOBS
-- Delivery jobs for drivers - the core of the mobile app
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Optional link to desktop order
    desktop_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    job_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES mobile_customers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES mobile_vehicles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES mobile_user_profiles(id) ON DELETE SET NULL,
    status mobile_job_status DEFAULT 'pending',
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance DECIMAL(10, 2),
    estimated_duration VARCHAR(50),
    cargo TEXT,
    cargo_weight DECIMAL(10, 2),
    temperature VARCHAR(50),
    price DECIMAL(12, 2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    notes TEXT,
    pickup_date TIMESTAMP,
    delivery_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE JOB STOPS
-- Multi-stop delivery tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_job_stops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES mobile_jobs(id) ON DELETE CASCADE NOT NULL,
    sequence INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact VARCHAR(255),
    phone VARCHAR(20),
    cargo TEXT,
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,
    status mobile_stop_status DEFAULT 'pending',
    checked_in BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE EXPENSES
-- Expense tracking for jobs
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES mobile_jobs(id) ON DELETE SET NULL,
    stop_id UUID REFERENCES mobile_job_stops(id) ON DELETE SET NULL,
    user_id UUID REFERENCES mobile_user_profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    description TEXT,
    receipt_url TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE REVENUES
-- Revenue and invoice tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_revenues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES mobile_jobs(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES mobile_customers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    status VARCHAR(50) DEFAULT 'pending',
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    payment_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE BIDS
-- Bidding system for available jobs
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_bids (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Optional link to desktop RFQ
    desktop_rfq_id UUID REFERENCES rfqs(id) ON DELETE SET NULL,
    bid_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES mobile_customers(id) ON DELETE SET NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    cargo TEXT,
    cargo_weight DECIMAL(10, 2),
    requested_price DECIMAL(12, 2),
    submitted_price DECIMAL(12, 2),
    status mobile_bid_status DEFAULT 'open',
    pickup_date TIMESTAMP,
    expires_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOBILE CHAT SYSTEM
-- Conversations and messages
-- ============================================================================

CREATE TABLE IF NOT EXISTS mobile_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type mobile_conversation_type DEFAULT 'private',
    name VARCHAR(255),
    avatar TEXT,
    created_by_id UUID REFERENCES mobile_user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mobile_conversation_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES mobile_conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES mobile_user_profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT false,
    is_muted BOOLEAN DEFAULT false,
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS mobile_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES mobile_conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES mobile_user_profiles(id) ON DELETE SET NULL,
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text',
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_mobile_user_profiles_username ON mobile_user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_mobile_user_profiles_email ON mobile_user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_mobile_user_profiles_role ON mobile_user_profiles(role);

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_mobile_customers_name ON mobile_customers(name);
CREATE INDEX IF NOT EXISTS idx_mobile_customers_city ON mobile_customers(city);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_mobile_products_category ON mobile_products(category);
CREATE INDEX IF NOT EXISTS idx_mobile_products_name ON mobile_products(name);

-- Vehicle indexes
CREATE INDEX IF NOT EXISTS idx_mobile_vehicles_driver ON mobile_vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_mobile_vehicles_status ON mobile_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_mobile_vehicles_registration ON mobile_vehicles(registration_number);

-- Job indexes
CREATE INDEX IF NOT EXISTS idx_mobile_jobs_driver ON mobile_jobs(driver_id);
CREATE INDEX IF NOT EXISTS idx_mobile_jobs_status ON mobile_jobs(status);
CREATE INDEX IF NOT EXISTS idx_mobile_jobs_customer ON mobile_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_mobile_jobs_job_number ON mobile_jobs(job_number);
CREATE INDEX IF NOT EXISTS idx_mobile_jobs_created_at ON mobile_jobs(created_at);

-- Job stops indexes
CREATE INDEX IF NOT EXISTS idx_mobile_job_stops_job ON mobile_job_stops(job_id);
CREATE INDEX IF NOT EXISTS idx_mobile_job_stops_status ON mobile_job_stops(status);

-- Expense indexes
CREATE INDEX IF NOT EXISTS idx_mobile_expenses_job ON mobile_expenses(job_id);
CREATE INDEX IF NOT EXISTS idx_mobile_expenses_user ON mobile_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_expenses_category ON mobile_expenses(category);
CREATE INDEX IF NOT EXISTS idx_mobile_expenses_date ON mobile_expenses(date);

-- Revenue indexes
CREATE INDEX IF NOT EXISTS idx_mobile_revenues_job ON mobile_revenues(job_id);
CREATE INDEX IF NOT EXISTS idx_mobile_revenues_customer ON mobile_revenues(customer_id);
CREATE INDEX IF NOT EXISTS idx_mobile_revenues_status ON mobile_revenues(status);

-- Bid indexes
CREATE INDEX IF NOT EXISTS idx_mobile_bids_status ON mobile_bids(status);
CREATE INDEX IF NOT EXISTS idx_mobile_bids_customer ON mobile_bids(customer_id);
CREATE INDEX IF NOT EXISTS idx_mobile_bids_expires_at ON mobile_bids(expires_at);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_mobile_messages_conversation ON mobile_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_mobile_messages_sender ON mobile_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_mobile_messages_created_at ON mobile_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_mobile_conversation_participants_user ON mobile_conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_conversation_participants_conv ON mobile_conversation_participants(conversation_id);

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mobile_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at column
DROP TRIGGER IF EXISTS update_mobile_user_profiles_updated_at ON mobile_user_profiles;
CREATE TRIGGER update_mobile_user_profiles_updated_at
    BEFORE UPDATE ON mobile_user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_customers_updated_at ON mobile_customers;
CREATE TRIGGER update_mobile_customers_updated_at
    BEFORE UPDATE ON mobile_customers
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_products_updated_at ON mobile_products;
CREATE TRIGGER update_mobile_products_updated_at
    BEFORE UPDATE ON mobile_products
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_vehicles_updated_at ON mobile_vehicles;
CREATE TRIGGER update_mobile_vehicles_updated_at
    BEFORE UPDATE ON mobile_vehicles
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_jobs_updated_at ON mobile_jobs;
CREATE TRIGGER update_mobile_jobs_updated_at
    BEFORE UPDATE ON mobile_jobs
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_bids_updated_at ON mobile_bids;
CREATE TRIGGER update_mobile_bids_updated_at
    BEFORE UPDATE ON mobile_bids
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_conversations_updated_at ON mobile_conversations;
CREATE TRIGGER update_mobile_conversations_updated_at
    BEFORE UPDATE ON mobile_conversations
    FOR EACH ROW EXECUTE FUNCTION update_mobile_updated_at_column();

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

