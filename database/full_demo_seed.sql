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

-- Link all new factories to international routes
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
    'confirmed'::route_status,
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
  AND mr.display_code LIKE 'RT-INT-%'
ON CONFLICT (display_code) DO UPDATE SET offer_price = EXCLUDED.offer_price, updated_at = NOW();

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
  AND mr.display_code LIKE 'RT-BKK-%'
  AND random() < 0.3
ON CONFLICT (display_code) DO UPDATE SET offer_price = EXCLUDED.offer_price, updated_at = NOW();

COMMIT;

-- ============================================================================
-- SECTION 5: CHAT DATA
-- ============================================================================

BEGIN;

-- Create chat rooms between existing demo users
INSERT INTO chat_rooms (id, participant1_id, participant2_id, last_message_at)
SELECT 
    uuid_generate_v4(),
    u1.id,
    u2.id,
    NOW() - (ROW_NUMBER() OVER() || ' hours')::interval
FROM (SELECT id FROM users WHERE role = 'ORGANIZATION' LIMIT 5) u1
CROSS JOIN (SELECT id FROM users WHERE role = 'ORGANIZATION' OFFSET 5 LIMIT 5) u2
ON CONFLICT DO NOTHING;

-- Add sample chat messages
INSERT INTO chat_messages (id, room_id, sender_id, message_type, content, is_read)
SELECT 
    uuid_generate_v4(),
    cr.id,
    CASE WHEN s % 2 = 1 THEN cr.participant1_id ELSE cr.participant2_id END,
    'txt',
    (ARRAY[
        'สวัสดีครับ ต้องการสอบถามเรื่องการขนส่งครับ',
        'สวัสดีครับ ยินดีให้บริการครับ',
        'ราคาเส้นทาง กรุงเทพ-เชียงใหม่ เท่าไหร่ครับ?',
        '15,000 บาท/เที่ยว สำหรับรถ 10 ล้อครับ',
        'รับทราบครับ ขอใบเสนอราคาด้วยครับ',
        'ส่งให้ทางอีเมลเลยนะครับ',
        'ขอบคุณครับ',
        'ยินดีครับ มีอะไรสอบถามเพิ่มเติมได้เลยครับ',
        'ต้องการรถวันไหนครับ?',
        'วันจันทร์หน้าครับ พร้อมส่งสินค้า 8 โมงเช้า',
        'รับทราบครับ จะจัดรถให้ครับ',
        'ขอบคุณมากครับ'
    ])[1 + (s % 12)],
    CASE WHEN s < 8 THEN true ELSE false END
FROM chat_rooms cr
CROSS JOIN generate_series(1, 12) s
WHERE cr.participant1_id IS NOT NULL
LIMIT 100
ON CONFLICT DO NOTHING;

-- Update last_message_at for all rooms
UPDATE chat_rooms cr
SET last_message_at = COALESCE(
    (SELECT MAX(created_at) FROM chat_messages cm WHERE cm.room_id = cr.id),
    cr.last_message_at
);

COMMIT;

-- ============================================================================
-- SECTION 6: ADDITIONAL PACKAGES
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
