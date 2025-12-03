-- ============================================================================
-- FULL DEMO SEED DATA FOR TRUCKER WEB
-- Comprehensive realistic demo data for MVP demonstration
-- ============================================================================
-- Run order: 00_init.sql -> 10_demo_seed.sql -> 20_full_demo_seed.sql
-- ============================================================================

-- ============================================================================
-- SECTION 1: THAI PROVINCES AND DISTRICTS
-- ============================================================================

BEGIN;

-- Create provinces table if not exists (should already exist from init.sql)
-- Major Thai Provinces (key logistics hubs)
INSERT INTO provinces (code, name_th, name_en) VALUES
    ('BKK', 'กรุงเทพมหานคร', 'Bangkok'),
    ('CBI', 'ชลบุรี', 'Chonburi'),
    ('RYG', 'ระยอง', 'Rayong'),
    ('SMK', 'สมุทรปราการ', 'Samut Prakan'),
    ('PTN', 'ปทุมธานี', 'Pathum Thani'),
    ('AYA', 'พระนครศรีอยุธยา', 'Ayutthaya'),
    ('NBI', 'นนทบุรี', 'Nonthaburi'),
    ('SKN', 'สมุทรสาคร', 'Samut Sakhon'),
    ('CCO', 'ฉะเชิงเทรา', 'Chachoengsao'),
    ('PBI', 'ปราจีนบุรี', 'Prachin Buri'),
    ('SBR', 'สระบุรี', 'Saraburi'),
    ('NMA', 'นครราชสีมา', 'Nakhon Ratchasima'),
    ('KKN', 'ขอนแก่น', 'Khon Kaen'),
    ('UDN', 'อุดรธานี', 'Udon Thani'),
    ('NKI', 'หนองคาย', 'Nong Khai'),
    ('CMI', 'เชียงใหม่', 'Chiang Mai'),
    ('CRI', 'เชียงราย', 'Chiang Rai'),
    ('LPN', 'ลำพูน', 'Lamphun'),
    ('LPG', 'ลำปาง', 'Lampang'),
    ('PKT', 'ภูเก็ต', 'Phuket'),
    ('SKA', 'สงขลา', 'Songkhla'),
    ('SRT', 'สุราษฎร์ธานี', 'Surat Thani'),
    ('NKS', 'นครศรีธรรมราช', 'Nakhon Si Thammarat'),
    ('TAK', 'ตาก', 'Tak'),
    ('SRI', 'สระแก้ว', 'Sa Kaeo'),
    ('TRT', 'ตราด', 'Trat'),
    ('MKM', 'มุกดาหาร', 'Mukdahan'),
    ('NKP', 'นครพนม', 'Nakhon Phanom'),
    ('UBN', 'อุบลราชธานี', 'Ubon Ratchathani'),
    ('RET', 'ร้อยเอ็ด', 'Roi Et'),
    ('MDH', 'มหาสารคาม', 'Maha Sarakham'),
    ('KSN', 'กาฬสินธุ์', 'Kalasin'),
    ('SKW', 'สกลนคร', 'Sakon Nakhon'),
    ('NPT', 'นครปฐม', 'Nakhon Pathom'),
    ('RBR', 'ราชบุรี', 'Ratchaburi'),
    ('KBI', 'กาญจนบุรี', 'Kanchanaburi'),
    ('PNB', 'เพชรบุรี', 'Phetchaburi'),
    ('PKN', 'ประจวบคีรีขันธ์', 'Prachuap Khiri Khan'),
    ('CPN', 'ชุมพร', 'Chumphon'),
    ('RNG', 'ระนอง', 'Ranong'),
    ('PNA', 'พังงา', 'Phang Nga'),
    ('KBI2', 'กระบี่', 'Krabi'),
    ('TRG', 'ตรัง', 'Trang'),
    ('STN', 'สตูล', 'Satun'),
    ('PTN2', 'ปัตตานี', 'Pattani'),
    ('YLA', 'ยะลา', 'Yala'),
    ('NWT', 'นราธิวาส', 'Narathiwat')
ON CONFLICT (code) DO NOTHING;

COMMIT;

-- ============================================================================
-- SECTION 2: ORGANIZATIONS (FACTORIES & LOGISTICS COMPANIES)
-- ============================================================================

BEGIN;

-- Additional Business Types
INSERT INTO business_types (code, name_th, name_en) VALUES
    ('MANUFACTURING', 'โรงงานผลิต', 'Manufacturing'),
    ('FOOD_PROCESSING', 'แปรรูปอาหาร', 'Food Processing'),
    ('AUTOMOTIVE', 'ยานยนต์', 'Automotive'),
    ('ELECTRONICS', 'อิเล็กทรอนิกส์', 'Electronics'),
    ('PETROCHEMICAL', 'ปิโตรเคมี', 'Petrochemical'),
    ('STEEL', 'เหล็ก', 'Steel'),
    ('CEMENT', 'ซีเมนต์', 'Cement'),
    ('TEXTILE', 'สิ่งทอ', 'Textile'),
    ('COLD_CHAIN', 'ห้องเย็น', 'Cold Chain'),
    ('FREIGHT', 'ขนส่งสินค้า', 'Freight')
ON CONFLICT (code) DO NOTHING;

-- FACTORIES (30+)
INSERT INTO organizations (id, display_code, name, type, business_type_id, dial_code, phone, email, status)
VALUES
    -- Food & Agriculture
    ('f0000001-0001-0001-0001-000000000001', 'FACT-CPF001', 'CP Foods - Saraburi Plant', 'FACTORY', (SELECT id FROM business_types WHERE code = 'FOOD_PROCESSING'), '+66', '036-123456', 'saraburi@cpfood.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000002', 'FACT-TUF001', 'Thai Union Group - Samut Sakhon', 'FACTORY', (SELECT id FROM business_types WHERE code = 'FOOD_PROCESSING'), '+66', '034-456789', 'samut@thaiunion.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000003', 'FACT-BER001', 'Betagro - Lopburi Plant', 'FACTORY', (SELECT id FROM business_types WHERE code = 'FOOD_PROCESSING'), '+66', '036-789012', 'lopburi@betagro.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000004', 'FACT-OST001', 'Osotspa Factory', 'FACTORY', (SELECT id FROM business_types WHERE code = 'FOOD_PROCESSING'), '+66', '02-3456789', 'factory@osotspa.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000005', 'FACT-ICH001', 'Ichitan Group Plant', 'FACTORY', (SELECT id FROM business_types WHERE code = 'FOOD_PROCESSING'), '+66', '02-4567890', 'plant@ichitan.com', 'ACTIVE'),
    -- Automotive
    ('f0000001-0001-0001-0001-000000000006', 'FACT-TYT001', 'Toyota Gateway Plant', 'FACTORY', (SELECT id FROM business_types WHERE code = 'AUTOMOTIVE'), '+66', '038-234567', 'gateway@toyota.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000007', 'FACT-HND001', 'Honda Ayutthaya Plant', 'FACTORY', (SELECT id FROM business_types WHERE code = 'AUTOMOTIVE'), '+66', '035-345678', 'ayutthaya@honda.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000008', 'FACT-ISZ001', 'Isuzu Samrong Plant', 'FACTORY', (SELECT id FROM business_types WHERE code = 'AUTOMOTIVE'), '+66', '02-5678901', 'samrong@isuzu.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000009', 'FACT-MTB001', 'Mitsubishi Laem Chabang', 'FACTORY', (SELECT id FROM business_types WHERE code = 'AUTOMOTIVE'), '+66', '038-456789', 'laemchabang@mitsubishi.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000010', 'FACT-NSN001', 'Nissan Samut Prakan', 'FACTORY', (SELECT id FROM business_types WHERE code = 'AUTOMOTIVE'), '+66', '02-6789012', 'samutprakan@nissan.co.th', 'ACTIVE'),
    -- Electronics
    ('f0000001-0001-0001-0001-000000000011', 'FACT-WDC001', 'Western Digital Bang Pa-in', 'FACTORY', (SELECT id FROM business_types WHERE code = 'ELECTRONICS'), '+66', '035-567890', 'bangpain@wdc.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000012', 'FACT-SGT001', 'Seagate Thailand', 'FACTORY', (SELECT id FROM business_types WHERE code = 'ELECTRONICS'), '+66', '038-678901', 'thailand@seagate.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000013', 'FACT-DEL001', 'Delta Electronics', 'FACTORY', (SELECT id FROM business_types WHERE code = 'ELECTRONICS'), '+66', '02-8901234', 'thailand@delta.com', 'ACTIVE'),
    -- Petrochemical
    ('f0000001-0001-0001-0001-000000000014', 'FACT-PTT001', 'PTT GC Map Ta Phut', 'FACTORY', (SELECT id FROM business_types WHERE code = 'PETROCHEMICAL'), '+66', '038-123456', 'maptaphut@pttgc.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000015', 'FACT-IRP001', 'IRPC Rayong', 'FACTORY', (SELECT id FROM business_types WHERE code = 'PETROCHEMICAL'), '+66', '038-234567', 'rayong@irpc.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000016', 'FACT-SCG001', 'SCG Chemicals Rayong', 'FACTORY', (SELECT id FROM business_types WHERE code = 'PETROCHEMICAL'), '+66', '038-345678', 'rayong@scgchemicals.com', 'ACTIVE'),
    -- Steel & Construction
    ('f0000001-0001-0001-0001-000000000017', 'FACT-SSI001', 'Sahaviriya Steel', 'FACTORY', (SELECT id FROM business_types WHERE code = 'STEEL'), '+66', '02-9012345', 'factory@ssi.co.th', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000018', 'FACT-SCC001', 'SCG Cement Saraburi', 'FACTORY', (SELECT id FROM business_types WHERE code = 'CEMENT'), '+66', '036-234567', 'saraburi@scg.com', 'ACTIVE'),
    -- Consumer Goods
    ('f0000001-0001-0001-0001-000000000019', 'FACT-UNL001', 'Unilever Chonburi', 'FACTORY', (SELECT id FROM business_types WHERE code = 'MANUFACTURING'), '+66', '038-789012', 'chonburi@unilever.com', 'ACTIVE'),
    ('f0000001-0001-0001-0001-000000000020', 'FACT-PNG001', 'P&G Thailand', 'FACTORY', (SELECT id FROM business_types WHERE code = 'MANUFACTURING'), '+66', '038-890123', 'thailand@pg.com', 'ACTIVE')
ON CONFLICT (display_code) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, updated_at = NOW();

-- LOGISTICS COMPANIES (20+)
INSERT INTO organizations (id, display_code, name, type, business_type_id, dial_code, phone, email, status)
VALUES
    ('c0000001-0001-0001-0001-000000000001', 'COMP-KRY001', 'Kerry Express Thailand', 'COMPANY', (SELECT id FROM business_types WHERE code = 'LOGISTICS'), '+66', '02-1234567', 'business@kerryexpress.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000002', 'COMP-FLS001', 'Flash Express Thailand', 'COMPANY', (SELECT id FROM business_types WHERE code = 'LOGISTICS'), '+66', '02-2345678', 'corporate@flashexpress.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000003', 'COMP-JNT001', 'J&T Express Thailand', 'COMPANY', (SELECT id FROM business_types WHERE code = 'LOGISTICS'), '+66', '02-3456789', 'business@jtexpress.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000004', 'COMP-DHL001', 'DHL Express Thailand', 'COMPANY', (SELECT id FROM business_types WHERE code = 'LOGISTICS'), '+66', '02-6789012', 'business@dhl.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000005', 'COMP-SCG001', 'SCG Logistics', 'COMPANY', (SELECT id FROM business_types WHERE code = 'LOGISTICS'), '+66', '02-0123456', 'logistics@scg.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000006', 'COMP-JWD001', 'JWD InfoLogistics', 'COMPANY', (SELECT id FROM business_types WHERE code = 'LOGISTICS'), '+66', '02-1234567', 'sales@jwd.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000007', 'COMP-NWL001', 'Nara Wattana Logistics', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '02-4567890', 'info@narawattana.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000008', 'COMP-TPT001', 'Thai Pan Transport', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '02-5678901', 'sales@thaipan.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000009', 'COMP-CPL001', 'CP All Logistics', 'COMPANY', (SELECT id FROM business_types WHERE code = 'COLD_CHAIN'), '+66', '02-9012345', 'logistics@cpall.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000010', 'COMP-NTH001', 'Northern Thailand Transport', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '053-234567', 'operations@northtrans.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000011', 'COMP-ISN001', 'Isan Express Logistics', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '043-345678', 'sales@isanexpress.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000012', 'COMP-STH001', 'Southern Line Transport', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '074-456789', 'info@southernline.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000013', 'COMP-EST001', 'Eastern Seaboard Logistics', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '038-567890', 'operations@easternlog.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000014', 'COMP-LAO001', 'Thai-Lao Transport', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '042-678901', 'crossborder@thailao.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000015', 'COMP-CAM001', 'Thai-Cambodia Trucking', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '037-789012', 'logistics@thaicam.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000016', 'COMP-MLY001', 'Thai-Malaysia Express', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '074-901234', 'cargo@thaimalay.co.th', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000017', 'COMP-CHN001', 'Kunming-Bangkok Express', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '053-012345', 'r3a@kunmingbkk.com', 'ACTIVE'),
    ('c0000001-0001-0001-0001-000000000018', 'COMP-LCB001', 'Laem Chabang Container', 'COMPANY', (SELECT id FROM business_types WHERE code = 'FREIGHT'), '+66', '038-123456', 'container@lcbport.com', 'ACTIVE')
ON CONFLICT (display_code) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, updated_at = NOW();

COMMIT;

-- ============================================================================
-- SECTION 3: MASTER ROUTES (DOMESTIC & INTERNATIONAL)
-- ============================================================================

BEGIN;

-- DOMESTIC ROUTES (30) - Using uuid_generate_v4() for valid UUIDs
INSERT INTO master_routes (id, display_code, origin_province, origin_district, origin_latitude, origin_longitude, destination_province, destination_district, destination_latitude, destination_longitude, distance_value, distance_unit)
VALUES
    -- Bangkok Hub Routes
    ('a0000001-0001-0001-0001-000000000001', 'RT-BKK-CMI', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Chiang Mai', 'Mueang', 18.7883, 98.9853, 700, 'km'),
    ('a0000001-0001-0001-0001-000000000002', 'RT-BKK-KKN', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Khon Kaen', 'Mueang', 16.4419, 102.8360, 450, 'km'),
    ('a0000001-0001-0001-0001-000000000003', 'RT-BKK-PKT', 'Bangkok', 'Bang Na', 13.6686, 100.6012, 'Phuket', 'Mueang', 7.8804, 98.3923, 840, 'km'),
    ('a0000001-0001-0001-0001-000000000004', 'RT-BKK-UDN', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Udon Thani', 'Mueang', 17.4138, 102.7870, 560, 'km'),
    ('a0000001-0001-0001-0001-000000000005', 'RT-BKK-NMA', 'Bangkok', 'Khlong Toei', 13.7237, 100.5584, 'Nakhon Ratchasima', 'Mueang', 14.9799, 102.0978, 260, 'km'),
    ('a0000001-0001-0001-0001-000000000006', 'RT-BKK-SRT', 'Bangkok', 'Bang Na', 13.6686, 100.6012, 'Surat Thani', 'Mueang', 9.1382, 99.3217, 640, 'km'),
    ('a0000001-0001-0001-0001-000000000007', 'RT-BKK-HYI', 'Bangkok', 'Bang Na', 13.6686, 100.6012, 'Songkhla', 'Hat Yai', 7.0086, 100.4747, 950, 'km'),
    ('a0000001-0001-0001-0001-000000000008', 'RT-BKK-CRI', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Chiang Rai', 'Mueang', 19.9071, 99.8305, 830, 'km'),
    ('a0000001-0001-0001-0001-000000000009', 'RT-BKK-UBN', 'Bangkok', 'Khlong Toei', 13.7237, 100.5584, 'Ubon Ratchathani', 'Mueang', 15.2287, 104.8564, 630, 'km'),
    ('a0000001-0001-0001-0001-000000000010', 'RT-BKK-NKS', 'Bangkok', 'Bang Na', 13.6686, 100.6012, 'Nakhon Si Thammarat', 'Mueang', 8.4304, 99.9631, 780, 'km'),
    -- EEC Routes
    ('a0000001-0001-0001-0001-000000000011', 'RT-BKK-LCB', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Chonburi', 'Laem Chabang', 13.0827, 100.8830, 120, 'km'),
    ('a0000001-0001-0001-0001-000000000012', 'RT-BKK-MTP', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Rayong', 'Map Ta Phut', 12.7032, 101.1496, 180, 'km'),
    ('a0000001-0001-0001-0001-000000000013', 'RT-LCB-MTP', 'Chonburi', 'Laem Chabang', 13.0827, 100.8830, 'Rayong', 'Map Ta Phut', 12.7032, 101.1496, 85, 'km'),
    ('a0000001-0001-0001-0001-000000000014', 'RT-BKK-SRC', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Chonburi', 'Si Racha', 13.1737, 100.9270, 100, 'km'),
    ('a0000001-0001-0001-0001-000000000015', 'RT-BKK-CCO', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Chachoengsao', 'Mueang', 13.6904, 101.0779, 80, 'km'),
    -- Industrial Routes
    ('a0000001-0001-0001-0001-000000000016', 'RT-BKK-AYA', 'Bangkok', 'Bang Sue', 13.8027, 100.5354, 'Ayutthaya', 'Bang Pa-in', 14.2267, 100.5768, 60, 'km'),
    ('a0000001-0001-0001-0001-000000000017', 'RT-AYA-SBR', 'Ayutthaya', 'Bang Pa-in', 14.2267, 100.5768, 'Saraburi', 'Mueang', 14.5289, 100.9094, 50, 'km'),
    ('a0000001-0001-0001-0001-000000000018', 'RT-BKK-SMK', 'Bangkok', 'Bang Na', 13.6686, 100.6012, 'Samut Prakan', 'Bang Phli', 13.6107, 100.7241, 25, 'km'),
    ('a0000001-0001-0001-0001-000000000019', 'RT-BKK-SKN', 'Bangkok', 'Thon Buri', 13.7196, 100.4853, 'Samut Sakhon', 'Mueang', 13.5475, 100.2749, 35, 'km'),
    ('a0000001-0001-0001-0001-000000000020', 'RT-BKK-NPT', 'Bangkok', 'Thon Buri', 13.7196, 100.4853, 'Nakhon Pathom', 'Mueang', 13.8196, 100.0614, 55, 'km'),
    -- Northern Routes
    ('a0000001-0001-0001-0001-000000000021', 'RT-CMI-LPN', 'Chiang Mai', 'Mueang', 18.7883, 98.9853, 'Lamphun', 'Mueang', 18.5742, 99.0087, 25, 'km'),
    ('a0000001-0001-0001-0001-000000000022', 'RT-CMI-LPG', 'Chiang Mai', 'Mueang', 18.7883, 98.9853, 'Lampang', 'Mueang', 18.2888, 99.4906, 100, 'km'),
    ('a0000001-0001-0001-0001-000000000023', 'RT-CMI-CRI', 'Chiang Mai', 'Mueang', 18.7883, 98.9853, 'Chiang Rai', 'Mueang', 19.9071, 99.8305, 180, 'km'),
    -- Isan Routes
    ('a0000001-0001-0001-0001-000000000024', 'RT-KKN-UDN', 'Khon Kaen', 'Mueang', 16.4419, 102.8360, 'Udon Thani', 'Mueang', 17.4138, 102.7870, 120, 'km'),
    ('a0000001-0001-0001-0001-000000000025', 'RT-KKN-NKP', 'Khon Kaen', 'Mueang', 16.4419, 102.8360, 'Nakhon Phanom', 'Mueang', 17.3944, 104.7696, 290, 'km'),
    ('a0000001-0001-0001-0001-000000000026', 'RT-NMA-KKN', 'Nakhon Ratchasima', 'Mueang', 14.9799, 102.0978, 'Khon Kaen', 'Mueang', 16.4419, 102.8360, 190, 'km'),
    ('a0000001-0001-0001-0001-000000000027', 'RT-UDN-NKI', 'Udon Thani', 'Mueang', 17.4138, 102.7870, 'Nong Khai', 'Mueang', 17.8782, 102.7428, 55, 'km'),
    ('a0000001-0001-0001-0001-000000000028', 'RT-UBN-MKM', 'Ubon Ratchathani', 'Mueang', 15.2287, 104.8564, 'Mukdahan', 'Mueang', 16.5426, 104.7253, 170, 'km'),
    -- Southern Routes
    ('a0000001-0001-0001-0001-000000000029', 'RT-SRT-PKT', 'Surat Thani', 'Mueang', 9.1382, 99.3217, 'Phuket', 'Mueang', 7.8804, 98.3923, 250, 'km'),
    ('a0000001-0001-0001-0001-000000000030', 'RT-HYI-PKT', 'Songkhla', 'Hat Yai', 7.0086, 100.4747, 'Phuket', 'Mueang', 7.8804, 98.3923, 310, 'km')
ON CONFLICT (display_code) DO UPDATE SET distance_value = EXCLUDED.distance_value, updated_at = NOW();

-- INTERNATIONAL ROUTES (17)
INSERT INTO master_routes (id, display_code, origin_province, origin_district, origin_latitude, origin_longitude, destination_province, destination_district, destination_latitude, destination_longitude, return_point_province, return_point_district, return_point_latitude, return_point_longitude, distance_value, distance_unit)
VALUES
    -- Thailand - Laos
    ('b0000001-0001-0002-0001-000000000001', 'RT-INT-BKK-VTE', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Vientiane (Laos)', 'Sisattanak', 17.9757, 102.6331, 'Nong Khai', 'Mueang', 17.8782, 102.7428, 650, 'km'),
    ('b0000001-0001-0002-0001-000000000002', 'RT-INT-NKI-VTE', 'Nong Khai', 'Mueang', 17.8782, 102.7428, 'Vientiane (Laos)', 'Sisattanak', 17.9757, 102.6331, 'Nong Khai', 'Mueang', 17.8782, 102.7428, 25, 'km'),
    ('b0000001-0001-0002-0001-000000000003', 'RT-INT-MKM-SVN', 'Mukdahan', 'Mueang', 16.5426, 104.7253, 'Savannakhet (Laos)', 'Kaysone', 16.5533, 104.7522, 'Mukdahan', 'Mueang', 16.5426, 104.7253, 10, 'km'),
    ('b0000001-0001-0002-0001-000000000004', 'RT-INT-UBN-PKS', 'Ubon Ratchathani', 'Mueang', 15.2287, 104.8564, 'Pakse (Laos)', 'Paksong', 15.1200, 105.7996, 'Ubon Ratchathani', 'Mueang', 15.2287, 104.8564, 120, 'km'),
    -- Thailand - Cambodia
    ('b0000001-0001-0002-0001-000000000005', 'RT-INT-BKK-PNH', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Phnom Penh (Cambodia)', 'Chamkarmon', 11.5564, 104.9282, 'Sa Kaeo', 'Aranyaprathet', 13.6881, 102.5012, 660, 'km'),
    ('b0000001-0001-0002-0001-000000000006', 'RT-INT-ARP-PPT', 'Sa Kaeo', 'Aranyaprathet', 13.6881, 102.5012, 'Poipet (Cambodia)', 'Poipet', 13.6578, 102.5631, 'Sa Kaeo', 'Aranyaprathet', 13.6881, 102.5012, 8, 'km'),
    ('b0000001-0001-0002-0001-000000000007', 'RT-INT-TRT-KKG', 'Trat', 'Khlong Yai', 11.7619, 102.8890, 'Koh Kong (Cambodia)', 'Smach Mean Chey', 11.6154, 102.9839, 'Trat', 'Khlong Yai', 11.7619, 102.8890, 15, 'km'),
    -- Thailand - Malaysia
    ('b0000001-0001-0002-0001-000000000008', 'RT-INT-HYI-PNG', 'Songkhla', 'Hat Yai', 7.0086, 100.4747, 'Penang (Malaysia)', 'George Town', 5.4141, 100.3288, 'Songkhla', 'Sadao', 6.6394, 100.4233, 180, 'km'),
    ('b0000001-0001-0002-0001-000000000009', 'RT-INT-BKK-KUL', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Kuala Lumpur (Malaysia)', 'Sentul', 3.1390, 101.6869, 'Songkhla', 'Sadao', 6.6394, 100.4233, 1400, 'km'),
    ('b0000001-0001-0002-0001-000000000010', 'RT-INT-SDK-BWT', 'Songkhla', 'Sadao', 6.6394, 100.4233, 'Bukit Kayu Hitam (Malaysia)', 'Changlun', 6.5383, 100.4181, 'Songkhla', 'Sadao', 6.6394, 100.4233, 5, 'km'),
    -- Thailand - Myanmar
    ('b0000001-0001-0002-0001-000000000011', 'RT-INT-MST-MWD', 'Tak', 'Mae Sot', 16.7130, 98.5708, 'Myawaddy (Myanmar)', 'Myawaddy', 16.6896, 98.5092, 'Tak', 'Mae Sot', 16.7130, 98.5708, 8, 'km'),
    ('b0000001-0001-0002-0001-000000000012', 'RT-INT-CRI-TCK', 'Chiang Rai', 'Mae Sai', 20.4283, 99.8828, 'Tachileik (Myanmar)', 'Tachileik', 20.4478, 99.8806, 'Chiang Rai', 'Mae Sai', 20.4283, 99.8828, 3, 'km'),
    -- Thailand - Vietnam
    ('b0000001-0001-0002-0001-000000000013', 'RT-INT-BKK-SGN', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Ho Chi Minh City (Vietnam)', 'District 1', 10.8231, 106.6297, 'Sa Kaeo', 'Aranyaprathet', 13.6881, 102.5012, 900, 'km'),
    ('b0000001-0001-0002-0001-000000000014', 'RT-INT-MKM-DNB', 'Mukdahan', 'Mueang', 16.5426, 104.7253, 'Da Nang (Vietnam)', 'Hai Chau', 16.0544, 108.2022, 'Mukdahan', 'Mueang', 16.5426, 104.7253, 550, 'km'),
    -- Thailand - Singapore
    ('b0000001-0001-0002-0001-000000000015', 'RT-INT-BKK-SIN', 'Bangkok', 'Lat Krabang', 13.7270, 100.7510, 'Singapore', 'Tuas', 1.3521, 103.6500, 'Songkhla', 'Sadao', 6.6394, 100.4233, 1430, 'km'),
    -- Thailand - China (R3A)
    ('b0000001-0001-0002-0001-000000000016', 'RT-INT-CRI-KMG', 'Chiang Rai', 'Chiang Saen', 20.2743, 100.0847, 'Kunming (China)', 'Yunnan', 24.8801, 102.8329, 'Chiang Rai', 'Chiang Khong', 20.2639, 100.4050, 1200, 'km'),
    ('b0000001-0001-0002-0001-000000000017', 'RT-INT-LCB-SIN', 'Chonburi', 'Laem Chabang', 13.0827, 100.8830, 'Singapore', 'PSA Port', 1.2644, 103.8200, 'Chonburi', 'Laem Chabang', 13.0827, 100.8830, 1550, 'km')
ON CONFLICT (display_code) DO UPDATE SET distance_value = EXCLUDED.distance_value, updated_at = NOW();

COMMIT;

-- ============================================================================
-- SECTION 4: FACTORY ROUTES (Link factories to master routes)
-- ============================================================================

BEGIN;

-- Link all new factories to international routes (50% pending for confirm page demo)
INSERT INTO factory_routes (id, factory_id, master_route_id, route_factory_code, shipping_type, type, distance_value, distance_unit, status, offer_price, unit, display_code)
SELECT 
    uuid_generate_v4(),
    f.id,
    mr.id,
    'FR-' || SUBSTRING(f.display_code FROM 6 FOR 6) || '-INT-' || ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY mr.distance_value),
    'seaFreight'::route_shipping_type,
    'abroad'::route_type,
    mr.distance_value,
    'km',
    CASE WHEN random() > 0.5 THEN 'confirmed'::route_status ELSE 'pending'::route_status END,
    CASE 
        WHEN mr.distance_value < 100 THEN 8000
        WHEN mr.distance_value < 500 THEN 15000
        WHEN mr.distance_value < 1000 THEN 25000
        ELSE 40000
    END,
    'THB/trip',
    'FR-INT-' || SUBSTRING(f.display_code FROM 6 FOR 6) || '-' || LPAD(ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY mr.distance_value)::text, 3, '0')
FROM organizations f
CROSS JOIN master_routes mr
WHERE f.type = 'FACTORY' 
  AND f.display_code LIKE 'FACT-%'
  AND mr.display_code LIKE 'RT-INT-%';

-- Link factories to domestic routes
INSERT INTO factory_routes (id, factory_id, master_route_id, route_factory_code, shipping_type, type, distance_value, distance_unit, status, offer_price, unit, display_code)
SELECT 
    uuid_generate_v4(),
    f.id,
    mr.id,
    'FR-' || SUBSTRING(f.display_code FROM 6 FOR 6) || '-DOM-' || ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY mr.distance_value),
    'landFreight'::route_shipping_type,
    'oneWay'::route_type,
    mr.distance_value,
    'km',
    CASE WHEN random() > 0.2 THEN 'confirmed'::route_status ELSE 'pending'::route_status END,
    CASE 
        WHEN mr.distance_value < 100 THEN 3500
        WHEN mr.distance_value < 300 THEN 6500
        WHEN mr.distance_value < 500 THEN 12000
        ELSE 18000
    END,
    'THB/trip',
    'FR-DOM-' || SUBSTRING(f.display_code FROM 6 FOR 6) || '-' || LPAD(ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY mr.distance_value)::text, 3, '0')
FROM organizations f
CROSS JOIN master_routes mr
WHERE f.type = 'FACTORY' 
  AND f.display_code LIKE 'FACT-%'
  AND mr.display_code LIKE 'RT-BKK-%';

COMMIT;

-- ============================================================================
-- SECTION 5: USERS AND DRIVERS
-- ============================================================================

BEGIN;

-- Factory Staff Users (2 per factory = ~40 users)
INSERT INTO users (id, display_code, username, email, password_hash, first_name, last_name, dial_code, phone, role, position_id, organization_id, status)
SELECT 
    ('f1a' || LPAD(ROW_NUMBER() OVER()::text, 5, '0') || '-aaaa-bbbb-cccc-' || LPAD(ROW_NUMBER() OVER()::text, 12, '0'))::uuid,
    'USR-FACT-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0'),
    'factory.user.' || LPAD(ROW_NUMBER() OVER()::text, 3, '0') || '@trucker.demo',
    'factory.user.' || LPAD(ROW_NUMBER() OVER()::text, 3, '0') || '@trucker.demo',
    crypt('Demo@123', gen_salt('bf', 10)),
    (ARRAY['สุภาพร', 'สุดา', 'วิภา', 'นิตยา', 'พรทิพย์', 'จิราภรณ์', 'วราภรณ์', 'สุวรรณา', 'อรุณี', 'ปราณี', 'สมศรี', 'วันดี', 'สุมาลี', 'รัตนา', 'พิมพา', 'ประภา', 'วิไล', 'สมหญิง', 'บุญมี', 'ทองใบ'])[1 + (ROW_NUMBER() OVER() % 20)],
    (ARRAY['เจริญสุข', 'ทองคำ', 'แก้วมณี', 'ศรีวิลัย', 'พิทักษ์', 'รักษาศีล', 'มั่งมี', 'ศิริมงคล', 'บุญประเสริฐ', 'ศรีประเสริฐ'])[1 + (ROW_NUMBER() OVER() % 10)],
    '+66',
    '02' || LPAD((1000000 + ROW_NUMBER() OVER() * 111)::text, 7, '0'),
    'ORGANIZATION',
    (SELECT id FROM user_positions WHERE code = 'FACTORY_MANAGER'),
    o.id,
    'ACTIVE'
FROM organizations o
CROSS JOIN generate_series(1, 2) s
WHERE o.type = 'FACTORY' AND o.display_code LIKE 'FACT-%'
ON CONFLICT (username) DO NOTHING;

-- Company Staff Users (2 per company = ~36 users)
INSERT INTO users (id, display_code, username, email, password_hash, first_name, last_name, dial_code, phone, role, position_id, organization_id, status)
SELECT 
    ('c1a' || LPAD(ROW_NUMBER() OVER()::text, 5, '0') || '-aaaa-bbbb-cccc-' || LPAD(ROW_NUMBER() OVER()::text, 12, '0'))::uuid,
    'USR-COMP-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0'),
    'company.user.' || LPAD(ROW_NUMBER() OVER()::text, 3, '0') || '@trucker.demo',
    'company.user.' || LPAD(ROW_NUMBER() OVER()::text, 3, '0') || '@trucker.demo',
    crypt('Demo@123', gen_salt('bf', 10)),
    (ARRAY['กิตติพงษ์', 'ธีรพงษ์', 'สุรพงษ์', 'วิชาญ', 'สุธี', 'อนุสรณ์', 'ประวิทย์', 'สุรศักดิ์', 'วีรศักดิ์', 'ชัยยศ', 'ณัฐพล', 'พีระพงษ์', 'อดิศักดิ์', 'เอกชัย', 'วรวุฒิ', 'ศุภชัย', 'อภิชาติ', 'ธนา'])[1 + (ROW_NUMBER() OVER() % 18)],
    (ARRAY['โชติช่วง', 'รุ่งโรจน์', 'เจริญชัย', 'มีบุญ', 'ศิริวัฒน์', 'วิไลพร', 'ชัยนาท', 'สุขเกษม', 'บุญเรือง', 'ศรีจันทร์'])[1 + (ROW_NUMBER() OVER() % 10)],
    '+66',
    '02' || LPAD((2000000 + ROW_NUMBER() OVER() * 222)::text, 7, '0'),
    'ORGANIZATION',
    (SELECT id FROM user_positions WHERE code = 'COMPANY_MANAGER'),
    o.id,
    'ACTIVE'
FROM organizations o
CROSS JOIN generate_series(1, 2) s
WHERE o.type = 'COMPANY' AND o.display_code LIKE 'COMP-%'
ON CONFLICT (username) DO NOTHING;

-- Internal Drivers (20 drivers attached to companies)
INSERT INTO users (id, display_code, username, email, password_hash, first_name, last_name, dial_code, phone, role, organization_id, status)
SELECT
    ('d1a' || LPAD(n::text, 5, '0') || '-aaaa-bbbb-cccc-' || LPAD(n::text, 12, '0'))::uuid,
    'DRV-INT-' || LPAD(n::text, 4, '0'),
    'driver.internal.' || n || '@trucker.demo',
    'driver.internal.' || n || '@trucker.demo',
    crypt('Demo@123', gen_salt('bf', 10)),
    (ARRAY['สมชาย', 'สมศักดิ์', 'สมหมาย', 'ประสิทธิ์', 'วิชัย', 'สุชาติ', 'อนุชา', 'พิชัย', 'วีระ', 'ชัยวัฒน์', 'ธนา', 'กิตติ', 'อภิชาติ', 'วรวุฒิ', 'ณัฐพล', 'ศุภชัย', 'พีระพงษ์', 'สุรชัย', 'อดิศักดิ์', 'เอกชัย'])[1 + (n % 20)],
    (ARRAY['ใจดี', 'สุขสม', 'มั่นคง', 'เจริญรุ่ง', 'ศรีสวัสดิ์', 'ทองดี', 'แสงทอง', 'พรมมา', 'จันทร์เพ็ญ', 'ดวงแก้ว'])[1 + (n % 10)],
    '+66',
    '08' || (1 + (n % 9))::text || LPAD((1000000 + n * 1234)::text, 7, '0'),
    'DRIVER',
    (SELECT id FROM organizations WHERE type = 'COMPANY' AND display_code LIKE 'COMP-%' ORDER BY random() LIMIT 1),
    'ACTIVE'
FROM generate_series(1, 20) n
ON CONFLICT (username) DO NOTHING;

-- Freelance Approved Drivers (20 drivers)
INSERT INTO users (id, display_code, username, email, password_hash, first_name, last_name, dial_code, phone, role, status)
SELECT
    ('d2a' || LPAD(n::text, 5, '0') || '-aaaa-bbbb-cccc-' || LPAD(n::text, 12, '0'))::uuid,
    'DRV-FRE-' || LPAD(n::text, 4, '0'),
    'driver.freelance.' || n || '@trucker.demo',
    'driver.freelance.' || n || '@trucker.demo',
    crypt('Demo@123', gen_salt('bf', 10)),
    (ARRAY['บุญชู', 'สำราญ', 'ทองใบ', 'บุญมี', 'สุนทร', 'ประยุทธ์', 'มานพ', 'สนั่น', 'บุญส่ง', 'ถาวร', 'สมาน', 'บุญเลิศ', 'สุพจน์', 'ประเสริฐ', 'บุญเกิด', 'สุวิทย์', 'ประสาน', 'สมพงษ์', 'บุญธรรม', 'สมบูรณ์'])[1 + (n % 20)],
    (ARRAY['รักษาดี', 'มีทรัพย์', 'ชาวนา', 'ศรีสง่า', 'พันธ์ดี', 'มากมี', 'ใจซื่อ', 'ภักดี', 'สมานมิตร', 'จิตรดี'])[1 + (n % 10)],
    '+66',
    '09' || (1 + (n % 9))::text || LPAD((2000000 + n * 5678)::text, 7, '0'),
    'DRIVER',
    'ACTIVE'
FROM generate_series(1, 20) n
ON CONFLICT (username) DO NOTHING;

-- Freelance Pending Drivers (10 drivers for review flow)
INSERT INTO users (id, display_code, username, email, password_hash, first_name, last_name, dial_code, phone, role, status)
SELECT
    ('d3a' || LPAD(n::text, 5, '0') || '-aaaa-bbbb-cccc-' || LPAD(n::text, 12, '0'))::uuid,
    'DRV-PND-' || LPAD(n::text, 4, '0'),
    'driver.pending.' || n || '@trucker.demo',
    'driver.pending.' || n || '@trucker.demo',
    crypt('Demo@123', gen_salt('bf', 10)),
    (ARRAY['อนันต์', 'วิเชียร', 'สุริยา', 'ไพศาล', 'ภาณุ', 'เกรียงไกร', 'ไกรสร', 'พิเชษฐ์', 'อำนาจ', 'ไพโรจน์'])[1 + (n % 10)],
    (ARRAY['กล้าหาญ', 'ไทยเจริญ', 'ศรีโสภา', 'มหาศักดิ์', 'พลศักดิ์', 'เกียรติศักดิ์', 'บุญประเสริฐ', 'แสงจันทร์', 'มหาชัย', 'บุญเพิ่ม'])[1 + (n % 10)],
    '+66',
    '06' || (1 + (n % 9))::text || LPAD((3000000 + n * 9012)::text, 7, '0'),
    'DRIVER',
    'PENDING'
FROM generate_series(1, 10) n
ON CONFLICT (username) DO NOTHING;

-- Create driver records for internal drivers
INSERT INTO drivers (id, display_code, user_id, type, company_id, status)
SELECT 
    uuid_generate_v4(),
    'DRV-REC-INT-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0'),
    u.id,
    'internal',
    u.organization_id,
    'APPROVED'
FROM users u
WHERE u.display_code LIKE 'DRV-INT-%'
ON CONFLICT (display_code) DO NOTHING;

-- Create driver records for freelance approved drivers
INSERT INTO drivers (id, display_code, user_id, type, company_id, status, id_card_image_url, vehicle_registration_image_url, vehicle_license_image_url)
SELECT 
    uuid_generate_v4(),
    'DRV-REC-FRE-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0'),
    u.id,
    'freelance',
    (SELECT id FROM organizations WHERE type = 'COMPANY' AND display_code LIKE 'COMP-%' ORDER BY random() LIMIT 1),
    'APPROVED',
    'https://ssl-new-trucker.s3.ap-southeast-1.amazonaws.com/demo/idcard-' || u.display_code || '.jpg',
    'https://ssl-new-trucker.s3.ap-southeast-1.amazonaws.com/demo/vehicle-reg-' || u.display_code || '.jpg',
    'https://ssl-new-trucker.s3.ap-southeast-1.amazonaws.com/demo/license-' || u.display_code || '.jpg'
FROM users u
WHERE u.display_code LIKE 'DRV-FRE-%'
ON CONFLICT (display_code) DO NOTHING;

-- Create driver records for freelance pending drivers
INSERT INTO drivers (id, display_code, user_id, type, status, id_card_image_url, vehicle_registration_image_url, vehicle_license_image_url)
SELECT 
    uuid_generate_v4(),
    'DRV-REC-PND-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0'),
    u.id,
    'freelance',
    'PENDING',
    'https://ssl-new-trucker.s3.ap-southeast-1.amazonaws.com/demo/idcard-' || u.display_code || '.jpg',
    'https://ssl-new-trucker.s3.ap-southeast-1.amazonaws.com/demo/vehicle-reg-' || u.display_code || '.jpg',
    'https://ssl-new-trucker.s3.ap-southeast-1.amazonaws.com/demo/license-' || u.display_code || '.jpg'
FROM users u
WHERE u.display_code LIKE 'DRV-PND-%'
ON CONFLICT (display_code) DO NOTHING;

-- Create trucks for drivers
INSERT INTO trucks (id, truck_code, license_plate_value, license_plate_province, brand, year, color, type, fuel_type, size, department_type, company_id, driver_id, capacity_weight, capacity_weight_unit, is_active)
SELECT
    uuid_generate_v4(),
    'TRK-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0'),
    (10 + (ROW_NUMBER() OVER() % 90))::text || '-' || LPAD((1000 + ROW_NUMBER() OVER() * 123)::text, 4, '0'),
    (ARRAY['กรุงเทพมหานคร', 'ชลบุรี', 'ระยอง', 'สมุทรปราการ', 'ปทุมธานี', 'อยุธยา', 'นครราชสีมา', 'ขอนแก่น', 'เชียงใหม่', 'สงขลา'])[1 + (ROW_NUMBER() OVER() % 10)],
    (ARRAY['Isuzu', 'Hino', 'UD Trucks', 'Mitsubishi Fuso', 'Volvo', 'Scania', 'Mercedes-Benz', 'MAN', 'DAF', 'Foton'])[1 + (ROW_NUMBER() OVER() % 10)],
    (2018 + (ROW_NUMBER() OVER() % 7))::text,
    (ARRAY['White', 'Blue', 'Green', 'Red', 'Silver'])[1 + (ROW_NUMBER() OVER() % 5)],
    (ARRAY['TRAILER', 'SEMI_TRAILER', 'CARGO_VAN', 'TANKER_TRUCK', 'PICKUP_TRUCK']::truck_type[])[1 + (ROW_NUMBER() OVER() % 5)],
    (ARRAY['DIESEL', 'BIODIESEL', 'CNG', 'LNG']::truck_fuel_type[])[1 + (ROW_NUMBER() OVER() % 4)],
    (ARRAY['6_WHEEL', '10_WHEEL', '18_WHEEL', '12_WHEEL']::vehicle_size[])[1 + (ROW_NUMBER() OVER() % 4)],
    CASE WHEN d.type = 'internal' THEN 'company'::truck_department_type ELSE 'freelance'::truck_department_type END,
    d.company_id,
    d.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 0 THEN 5000
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 10000
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 15000
        ELSE 20000
    END,
    'kg',
    true
FROM drivers d
WHERE d.status = 'APPROVED'
  AND d.display_code LIKE 'DRV-REC-%';

COMMIT;

-- ============================================================================
-- SECTION 6: CHAT DATA
-- ============================================================================

BEGIN;

-- Create chat rooms between ANY users (simplified approach for demo)
-- Room 1: Demo Admin to any organization user
INSERT INTO chat_rooms (id, participant1_id, participant2_id, last_message_at)
SELECT 
    uuid_generate_v4(),
    u1.id,
    u2.id,
    NOW() - ((n * 30) || ' minutes')::interval
FROM 
    (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1) u1,
    (SELECT id FROM users WHERE role = 'ORGANIZATION' ORDER BY id LIMIT 5) u2,
    generate_series(1, 1) n
WHERE u1.id IS NOT NULL AND u2.id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create chat rooms: Organization users talking to each other
INSERT INTO chat_rooms (id, participant1_id, participant2_id, last_message_at)
SELECT 
    uuid_generate_v4(),
    u1.id,
    u2.id,
    NOW() - ((ROW_NUMBER() OVER() * 15) || ' minutes')::interval
FROM 
    (SELECT id FROM users WHERE role = 'ORGANIZATION' ORDER BY id LIMIT 10) u1,
    (SELECT id FROM users WHERE role = 'ORGANIZATION' ORDER BY id DESC LIMIT 10) u2
WHERE u1.id < u2.id
LIMIT 20
ON CONFLICT DO NOTHING;

-- Create chat rooms: Organization users talking to Drivers
INSERT INTO chat_rooms (id, participant1_id, participant2_id, last_message_at)
SELECT 
    uuid_generate_v4(),
    u1.id,
    u2.id,
    NOW() - ((ROW_NUMBER() OVER() * 20) || ' minutes')::interval
FROM 
    (SELECT id FROM users WHERE role = 'ORGANIZATION' ORDER BY id LIMIT 10) u1,
    (SELECT id FROM users WHERE role = 'DRIVER' ORDER BY id LIMIT 10) u2
LIMIT 15
ON CONFLICT DO NOTHING;

-- Add sample chat messages to ALL chat rooms
INSERT INTO chat_messages (id, room_id, sender_id, message_type, content, is_read, created_at)
SELECT 
    uuid_generate_v4(),
    cr.id,
    CASE WHEN s % 2 = 1 THEN cr.participant1_id ELSE cr.participant2_id END,
    'txt',
    (ARRAY[
        'สวัสดีครับ ต้องการสอบถามเรื่องการขนส่งครับ',
        'สวัสดีครับ ยินดีให้บริการครับ สนใจเส้นทางไหนครับ?',
        'เส้นทาง กรุงเทพ-เชียงใหม่ ครับ ราคาที่เสนอพอจะลดได้ไหมครับ?',
        'ขอดูรายละเอียดก่อนนะครับ ถ้าปริมาณมากอาจพิจารณาได้ครับ',
        'ปริมาณประมาณ 20 เที่ยว/เดือนครับ',
        'รับทราบครับ จะส่งใบเสนอราคาใหม่ให้ภายในวันนี้ครับ',
        'ขอบคุณครับ รอใบเสนอราคานะครับ',
        'ส่งให้แล้วครับ ลองตรวจสอบดูนะครับ',
        'ได้รับแล้วครับ กำลังพิจารณาอยู่',
        'มีข้อสงสัยเพิ่มเติมสอบถามได้เลยนะครับ',
        'เรื่องรถที่จะใช้ เป็นรถขนาดไหนครับ?',
        'ใช้รถ 10 ล้อ หรือ 18 ล้อ ได้ทั้งสองแบบครับ',
        'รับทราบครับ ขอปรึกษาผู้บริหารก่อนนะครับ',
        'ได้ครับ ไม่เร่งครับ',
        'ตกลงครับ เลือกรถ 10 ล้อ ราคา 15,000 บาท/เที่ยว',
        'ขอบคุณครับ จะดำเนินการทำสัญญาต่อไปครับ'
    ])[1 + ((s - 1) % 16)],
    CASE WHEN s < 12 THEN true ELSE false END,
    NOW() - ((100 - s) || ' minutes')::interval
FROM chat_rooms cr
CROSS JOIN generate_series(1, 16) s
WHERE cr.participant1_id IS NOT NULL AND cr.participant2_id IS NOT NULL
LIMIT 300;

-- Add more chat messages - Driver coordination style
INSERT INTO chat_messages (id, room_id, sender_id, message_type, content, is_read, created_at)
SELECT 
    uuid_generate_v4(),
    cr.id,
    CASE WHEN s % 2 = 0 THEN cr.participant1_id ELSE cr.participant2_id END,
    'txt',
    (ARRAY[
        'พี่ครับ พรุ่งนี้มีงานให้ครับ เส้นทาง แหลมฉบัง-มาบตาพุด',
        'รับครับ ต้องไปรับของกี่โมงครับ?',
        '8 โมงเช้าครับ ที่ท่าเรือแหลมฉบัง ประตู 3',
        'รับทราบครับ จะไปถึงก่อนเวลาครับ',
        'สินค้าเป็นตู้คอนเทนเนอร์ 40 ฟุต นะครับ',
        'รับทราบครับ เตรียมรถหัวลากให้เรียบร้อยแล้วครับ',
        'ดีครับ ขับขี่ปลอดภัยนะครับ',
        'ครับผม ขอบคุณครับ',
        'ถึงแล้วครับ กำลังรอคิวขึ้นของ',
        'รับทราบครับ แจ้งเมื่อออกจากท่าเรือด้วยนะครับ',
        'ออกจากท่าเรือแล้วครับ คาดว่าถึง 11 โมงครับ',
        'ดีครับ ผมแจ้งลูกค้าให้แล้ว',
        'ถึงปลายทางแล้วครับ กำลังรอลงของ',
        'เรียบร้อยครับ ขอบคุณมากครับ',
        'ยินดีครับ ไว้มีงานอีกนะครับ',
        'ครับผม'
    ])[1 + ((s - 1) % 16)],
    CASE WHEN s < 10 THEN true ELSE false END,
    NOW() - ((50 - s) || ' minutes')::interval
FROM chat_rooms cr
CROSS JOIN generate_series(1, 10) s
WHERE cr.participant1_id IS NOT NULL AND cr.participant2_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM chat_messages cm WHERE cm.room_id = cr.id
  )
LIMIT 200;

-- Update last_message_at for all rooms
UPDATE chat_rooms cr
SET last_message_at = COALESCE(
    (SELECT MAX(created_at) FROM chat_messages cm WHERE cm.room_id = cr.id),
    cr.last_message_at
);

COMMIT;

-- ============================================================================
-- SECTION 7: ADDITIONAL PACKAGES
-- ============================================================================

BEGIN;

INSERT INTO packages (id, code, name, description_th, description_en, type, duration_value, duration_unit, price, is_active, start_date, end_date, remark)
VALUES
    (uuid_generate_v4(), 'PKG-STARTER', 'Starter Package', 'แพ็กเกจเริ่มต้น', 'Starter package for new users', 'monthly', 1, 'month', 1999, true, CURRENT_DATE, CURRENT_DATE + '365 days'::interval, 'Basic features'),
    (uuid_generate_v4(), 'PKG-PRO', 'Professional Package', 'แพ็กเกจมืออาชีพ', 'Professional package', 'monthly', 1, 'month', 4999, true, CURRENT_DATE, CURRENT_DATE + '365 days'::interval, 'All features'),
    (uuid_generate_v4(), 'PKG-ENTERPRISE', 'Enterprise Package', 'แพ็กเกจองค์กร', 'Enterprise package', 'annual', 1, 'year', 49999, true, CURRENT_DATE, CURRENT_DATE + '365 days'::interval, 'Custom support')
ON CONFLICT (code) DO UPDATE SET price = EXCLUDED.price, updated_at = NOW();

COMMIT;

-- ============================================================================
-- DONE: Full demo seed completed!
-- ============================================================================
