// Auto-generated dataset: FHI 2026 & FHTB 2026 exhibition registrations (30 rows).
// Edit here if you want to swap in your own data — keep the same table name/columns
// or update js/problems.js and the schema table in js/problems.js to match.
const DATA_SQL = `-- Dummy dataset: FHI & FHTB exhibition registrations
-- Works on SQL Server (T-SQL). For MySQL/Postgres, change [ ] to backticks/quotes.
DROP TABLE IF EXISTS registrations;
CREATE TABLE registrations (
    reg_id           INT PRIMARY KEY,
    full_name        VARCHAR(100),
    email            VARCHAR(100),
    phone            VARCHAR(30),
    company          VARCHAR(100),
    job_title        VARCHAR(50),
    city             VARCHAR(50),
    event            VARCHAR(20),
    reg_date         TEXT,
    ticket_type      VARCHAR(20),
    product_interest VARCHAR(50),
    checked_in       INTEGER
);

INSERT INTO registrations VALUES (1, 'Budi Santoso', 'budi.santoso@gmail.com', '081234567890', 'PT Boga Rasa', 'Owner', 'Jakarta Selatan', 'FHI 2026', '2026-05-12', 'Trade Visitor', 'Food & Beverage', 1);
INSERT INTO registrations VALUES (2, 'Siti Rahayu', 'siti.rahayu@hotelmulia.com', '+6281298765432', 'Hotel Mulia', 'F&B Manager', 'Jakarta Pusat', 'FHI 2026', '2026-05-14', 'VIP', 'Hotel Supplies', 1);
INSERT INTO registrations VALUES (3, 'Andi Wijaya', 'andi.wijaya@gmail.com', '6285712345678', 'Warung Kopi Andi', 'Owner', 'Bogor', 'FHI 2026', '2026-06-01', 'Visitor', 'Coffee & Tea', 0);
INSERT INTO registrations VALUES (4, 'Dewi Lestari', 'DEWI.LESTARI@yahoo.com', '0813-5555-1234', 'PT Sukses Catering', 'Executive Chef', 'Depok', 'FHI 2026', '2026-06-03', 'Trade Visitor', 'Kitchen Equipment', 1);
INSERT INTO registrations VALUES (5, 'Rudi Hartono', 'rudi.h@grandhyatt.com', '081211122233', 'Grand Hyatt', 'Purchasing Manager', 'Jakarta Pusat', 'FHI 2026', '2026-06-05', 'VIP', 'Hospitality Equipment', 1);
INSERT INTO registrations VALUES (6, 'Maya Putri', 'maya.putri@gmail.com', '085611223344', 'Bakery Maya', 'Owner', 'Tangerang', 'FHI 2026', '2026-06-07', 'Visitor', 'Bakery & Pastry', 0);
INSERT INTO registrations VALUES (7, 'Agus Salim', 'agus.salim@santika.com', '+62 812 3456 7000', 'Hotel Santika', 'General Manager', 'Bekasi', 'FHI 2026', '2026-06-08', 'VIP', 'Hotel Supplies', 1);
INSERT INTO registrations VALUES (8, 'Rina Marlina', 'rina.marlina@gmail.com', '08977665544', 'PT Fresh Ingredients', 'Procurement', 'Jakarta Barat', 'FHI 2026', '2026-06-10', 'Trade Visitor', 'Food Ingredients', 1);
INSERT INTO registrations VALUES (9, 'Hendra Gunawan', 'hendra.g@gmail.com', '081399988877', NULL, 'Head Chef', 'Bandung', 'FHI 2026', '2026-06-11', 'Visitor', 'Kitchen Equipment', 0);
INSERT INTO registrations VALUES (10, 'Lia Kusuma', 'lia.kusuma@aston.com', '0821-1234-5678', 'Aston Hotel', 'Marketing', 'Surabaya', 'FHI 2026', '2026-06-12', 'Trade Visitor', 'Hotel Supplies', 1);
INSERT INTO registrations VALUES (11, 'Fajar Nugroho', 'fajar.n@gmail.com', '085722334455', 'Kedai Fajar', 'Owner', 'Jakarta Selatan', 'FHI 2026', '2026-06-13', 'Visitor', 'Coffee & Tea', 1);
INSERT INTO registrations VALUES (12, 'Sri Wahyuni', 'sri.wahyuni@gmail.com', '081266778899', 'PT Boga Rasa', 'Operations Manager', 'Jakarta Selatan', 'FHI 2026', '2026-06-14', 'Trade Visitor', 'Food & Beverage', 0);
INSERT INTO registrations VALUES (13, 'Bambang Sutrisno', 'bambang.s@ibis.com', '+6281377889900', 'Ibis Hotel', NULL, 'Yogyakarta', 'FHI 2026', '2026-06-15', 'VIP', 'Hospitality Equipment', 1);
INSERT INTO registrations VALUES (14, 'Nia Ramadhani', 'nia.r@gmail.com', '0895-6677-8899', 'Catering Nia', 'Director', 'Bekasi', 'FHI 2026', '2026-06-16', 'Trade Visitor', 'Food & Beverage', 1);
INSERT INTO registrations VALUES (15, 'Doni Prasetyo', 'doni.p@gmail.com', '081244556677', 'Coffee Lab', 'Barista', 'Jakarta Pusat', 'FHI 2026', '2026-06-17', 'Visitor', 'Coffee & Tea', 0);
INSERT INTO registrations VALUES (16, 'Wati Susanti', 'wati.susanti@gmail.com', '085811223300', 'PT Sukses Catering', 'Purchasing Manager', 'Depok', 'FHTB 2026', '2026-06-18', 'Trade Visitor', 'Kitchen Equipment', 1);
INSERT INTO registrations VALUES (17, 'Eko Prabowo', 'eko.prabowo@thepatra.com', '081233445566', 'The Patra Bali', 'General Manager', 'Denpasar', 'FHTB 2026', '2026-06-19', 'VIP', 'Hotel Supplies', 1);
INSERT INTO registrations VALUES (18, 'Ratna Sari', 'ratna.sari@gmail.com', '087855667788', 'Bakery Ratna', 'Owner', 'Semarang', 'FHTB 2026', '2026-06-20', 'Visitor', 'Bakery & Pastry', 0);
INSERT INTO registrations VALUES (19, 'Yusuf Maulana', 'yusuf.m@gmail.com', '081255667788', 'Warung Makan Yusuf', 'Owner', 'Medan', 'FHTB 2026', '2026-06-21', 'Visitor', 'Food & Beverage', 1);
INSERT INTO registrations VALUES (20, 'Indah Permata', 'indah.p@ayana.com', '+6281388990011', 'Ayana Resort', 'F&B Manager', 'Denpasar', 'FHTB 2026', '2026-06-22', 'VIP', 'Hospitality Equipment', 1);
INSERT INTO registrations VALUES (21, 'Bayu Aji', 'bayu.aji@gmail.com', '085644556677', 'PT Fresh Ingredients', 'Procurement', 'Jakarta Barat', 'FHTB 2026', '2026-06-23', 'Trade Visitor', 'Food Ingredients', 0);
INSERT INTO registrations VALUES (22, 'Citra Dewi', 'citra.dewi@gmail.com', '081277889900', 'Restoran Citra', 'Executive Chef', 'Bandung', 'FHTB 2026', '2026-06-24', 'Trade Visitor', 'Kitchen Equipment', 1);
INSERT INTO registrations VALUES (23, 'Gilang Ramadhan', 'gilang.r@gmail.com', NULL, 'Kopi Gilang', 'Owner', 'Jakarta Selatan', 'FHTB 2026', '2026-06-25', 'Visitor', 'Coffee & Tea', 1);
INSERT INTO registrations VALUES (24, 'Putri Ayu', 'putri.ayu@sheraton.com', '081299001122', 'Sheraton', 'Marketing', 'Jakarta Pusat', 'FHTB 2026', '2026-06-26', 'Trade Visitor', 'Hotel Supplies', 0);
INSERT INTO registrations VALUES (25, 'Ahmad Fauzi', 'ahmad.fauzi@gmail.com', '085733445500', 'Catering Fauzi', 'Director', 'Bekasi', 'FHTB 2026', '2026-06-27', 'Trade Visitor', 'Food & Beverage', 1);
INSERT INTO registrations VALUES (26, 'Budi Santoso', 'budi.santoso@gmail.com', '081234567890', 'PT Boga Rasa', 'Owner', 'Jakarta Selatan', 'FHTB 2026', '2026-06-28', 'Trade Visitor', 'Food & Beverage', 1);
INSERT INTO registrations VALUES (27, 'Lina Marlina', 'lina.m@gmail.com', '081255443322', 'Toko Roti Lina', 'Owner', 'Tangerang', 'FHTB 2026', '2026-06-29', 'Visitor', 'Bakery & Pastry', 0);
INSERT INTO registrations VALUES (28, 'Reza Pratama', 'reza.p@gmail.com', '085788990011', 'PT Boga Rasa', 'F&B Manager', 'Jakarta Selatan', 'FHTB 2026', '2026-06-30', 'Trade Visitor', 'Food & Beverage', 1);
INSERT INTO registrations VALUES (29, 'Dian Sastro', 'dian.s@gmail.com', '081344556600', NULL, 'Head Chef', 'Depok', 'FHTB 2026', '2026-07-01', 'Visitor', 'Kitchen Equipment', 0);
INSERT INTO registrations VALUES (30, 'Fahmi Idris', 'fahmi.idris@gmail.com', '085699887766', 'Cafe Fahmi', 'Owner', 'Jakarta Timur', 'FHTB 2026', '2026-07-02', 'Visitor', 'Coffee & Tea', 1);

DROP TABLE IF EXISTS exhibitors;
CREATE TABLE exhibitors (
    exhibitor_id INT PRIMARY KEY,
    company      VARCHAR(100),
    category     VARCHAR(50),
    booth_no     VARCHAR(10),
    event        VARCHAR(20),
    country      VARCHAR(50)
);

INSERT INTO exhibitors VALUES (1, 'PT Fresh Ingredients', 'Food Ingredients', 'A-12', 'FHI 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (2, 'PT Sukses Catering', 'Kitchen Equipment', 'A-08', 'FHI 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (3, 'Coffee Lab', 'Coffee & Tea', 'B-15', 'FHI 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (4, 'Kopi Nusantara Roastery', 'Coffee & Tea', 'B-16', 'FHTB 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (5, 'Global Kitchen Solutions', 'Kitchen Equipment', 'A-01', 'FHI 2026', 'Singapore');
INSERT INTO exhibitors VALUES (6, 'Bali Hospitality Supplies', 'Hospitality Equipment', 'C-02', 'FHTB 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (7, 'Jaya Bakery Ingredients', 'Bakery & Pastry', 'B-05', 'FHI 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (8, 'Mitra Hotel Amenities', 'Hotel Supplies', 'C-10', 'FHI 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (9, 'Fresh Dairy Indonesia', 'Food Ingredients', 'A-14', 'FHTB 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (10, 'Prima Kemasan Pangan', 'Food & Beverage', 'A-20', 'FHTB 2026', 'Indonesia');
INSERT INTO exhibitors VALUES (11, 'Solusi Dapur Modern', 'Kitchen Equipment', 'B-22', 'FHTB 2026', 'Malaysia');
INSERT INTO exhibitors VALUES (12, 'Roti & Kue Nusantara', 'Bakery & Pastry', 'B-09', 'FHTB 2026', 'Indonesia');
`;
