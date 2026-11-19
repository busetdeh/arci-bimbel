-- ==============================================================================
-- ARCI BIMBEL - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Skema relational lengkap mencakup: Profil User, RBAC, Cabang, Program,
-- Lead CRM, Kelas & Rombel, Siswa & Wali, Presensi, Tagihan & Pembayaran,
-- Modul Materi, Broadcast, Audit Log, dan Row Level Security (RLS).
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin_akademik',
  'admin_keuangan',
  'tutor',
  'parent',
  'student'
);

CREATE TYPE grade_level AS ENUM (
  'SD',
  'SMP',
  'SMA',
  'UTBK',
  'Privat'
);

CREATE TYPE lead_stage AS ENUM (
  'baru',
  'dihubungi',
  'trial',
  'siap',
  'batal'
);

CREATE TYPE attendance_status AS ENUM (
  'hadir',
  'izin',
  'sakit',
  'alpa'
);

CREATE TYPE invoice_status AS ENUM (
  'unpaid',
  'verify',
  'paid',
  'overdue',
  'cancelled'
);

-- ==============================================================================
-- 3. TABEL UTAMA
-- ==============================================================================

-- Profil Pengguna (Sinkronisasi dengan auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cabang Bimbel
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Jakarta',
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Program Belajar
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  level grade_level NOT NULL,
  description TEXT,
  price_monthly NUMERIC NOT NULL,
  price_total NUMERIC,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead & Pipeline Calon Siswa
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  grade_level TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'Website Form',
  stage lead_stage NOT NULL DEFAULT 'baru',
  notes TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Kelas & Rombel
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE RESTRICT,
  branch_id UUID REFERENCES branches(id) ON DELETE RESTRICT,
  tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 8,
  schedule_days TEXT NOT NULL,
  schedule_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'full', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Data Siswa
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nisn TEXT UNIQUE,
  full_name TEXT NOT NULL,
  school_origin TEXT,
  current_grade TEXT,
  target_university TEXT,
  target_major TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Data Orang Tua / Wali
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Relasi Siswa & Orang Tua (Bisa multi-anak per orang tua)
CREATE TABLE student_parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'Orang Tua / Wali',
  is_primary_contact BOOLEAN DEFAULT true,
  UNIQUE(student_id, parent_id)
);

-- Pendaftaran & Rombel Siswa (Enrollment)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_number TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'dropped')),
  onboarding_checklist JSONB DEFAULT '{"identity_verified": true, "class_assigned": true, "payment_verified": false, "portal_account_created": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sesi Jadwal Kelas
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  topic TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rekam Presensi Siswa per Sesi
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  status attendance_status NOT NULL DEFAULT 'hadir',
  check_in_time TIME,
  notes TEXT,
  corrected_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  corrected_at TIMESTAMPTZ,
  UNIQUE(session_id, student_id)
);

-- Tagihan & SPP (Invoices)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES parents(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  month_period TEXT,
  description TEXT,
  due_date DATE NOT NULL,
  status invoice_status NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bukti & Pembayaran (Payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Modul Materi & Tugas
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  type TEXT DEFAULT 'modul' CHECK (type IN ('modul', 'latihan', 'tugas', 'solusi')),
  due_date DATE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Siaran & Broadcast WhatsApp
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_segment TEXT NOT NULL,
  recipients_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Log Keamanan
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. TRIGGER: AUTO-CREATE PROFILE SAAT USER MENDAFTAR DI SUPABASE AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- API privileges. RLS tetap menjadi lapisan pembatas data per baris.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON branches, programs TO anon, authenticated;
GRANT INSERT ON leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  profiles,
  branches,
  programs,
  leads,
  classes,
  students,
  parents,
  student_parents,
  enrollments,
  attendance_sessions,
  attendance_records,
  invoices,
  payments,
  materials,
  announcements,
  audit_logs
TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  profiles,
  branches,
  programs,
  leads,
  classes,
  students,
  parents,
  student_parents,
  enrollments,
  attendance_sessions,
  attendance_records,
  invoices,
  payments,
  materials,
  announcements,
  audit_logs
TO service_role;

-- Helper Function: Cek Role User
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Kebijakan Umum:
-- 1. Data Publik (Cabang & Program) dapat dibaca siapa saja
CREATE POLICY "Public read branches" ON branches FOR SELECT USING (is_active = true);
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (is_active = true);

-- 2. Staff (Super Admin, Akademik, Keuangan) memiliki akses penuh ke data operasional
CREATE POLICY "Staff all on leads" ON leads FOR ALL USING (
  current_user_role() IN ('super_admin', 'admin_akademik', 'admin_keuangan')
);
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff all on classes" ON classes FOR ALL USING (
  current_user_role() IN ('super_admin', 'admin_akademik', 'tutor')
);

CREATE POLICY "Staff all on students" ON students FOR ALL USING (
  current_user_role() IN ('super_admin', 'admin_akademik', 'admin_keuangan', 'tutor')
);

CREATE POLICY "Staff all on invoices" ON invoices FOR ALL USING (
  current_user_role() IN ('super_admin', 'admin_keuangan')
);

-- 3. Siswa & Orang Tua hanya membaca data miliknya
CREATE POLICY "Student read own profile" ON students FOR SELECT USING (
  user_id = auth.uid()
);

CREATE POLICY "Parent read own students" ON students FOR SELECT USING (
  id IN (
    SELECT sp.student_id FROM student_parents sp
    JOIN parents p ON sp.parent_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Parent read own invoices" ON invoices FOR SELECT USING (
  parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
);

-- ==============================================================================
-- 6. DATA AWAL (SEED DATA SAMPLE)
-- ==============================================================================
INSERT INTO branches (name, code, address, city, phone) VALUES
('Cabang Sudirman Utama', 'SDR', 'Jl. Jend. Sudirman Kav. 24, Jakarta Selatan', 'Jakarta', '0812-3456-7890'),
('Cabang Kebayoran Baru', 'KBY', 'Jl. Pendidikan No. 42, Kebayoran Baru', 'Jakarta', '0813-8899-2211'),
('Kelas Online Nasional', 'ONL', 'Live Interaktif via Zoom Pro & Google Meet', 'Jakarta', '0821-1234-5678');

INSERT INTO programs (code, name, level, price_monthly, price_total, is_featured, description) VALUES
('UTBK-2026', 'Intensif UTBK-SNBT 2026', 'UTBK', 1450000, 14500000, true, 'Spesialisasi TPS, Penalaran Matematika, dan Literasi berstandar IRT nasional.'),
('SMP-REG', 'Bimbel Reguler SMP (Kelas 7–9)', 'SMP', 750000, 7500000, false, 'Pendampingan mata pelajaran kurikulum merdeka dan persiapan ASPD/ujian sekolah.'),
('SMA-REG', 'Bimbel Reguler SMA (Kelas 10–12)', 'SMA', 950000, 9500000, false, 'Pemantapan konsep dasar IPA/IPS, persiapan ujian semester, dan portofolio rapor.'),
('SD-REG', 'Bimbel Reguler SD (Kelas 4–6)', 'SD', 550000, 5500000, false, 'Membangun pondasi matematika dasar, membaca pemahaman, dan sains interaktif.');
