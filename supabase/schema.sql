-- ============================================================
-- LADZDZAH PROFESSIONAL PORTFOLIO - SUPABASE DATABASE SCHEMA
-- ============================================================
-- Jalankan script SQL ini di SQL Editor Dashboard Supabase Anda:
-- 1. Buka https://supabase.com -> Masuk ke Project Anda
-- 2. Klik menu 'SQL Editor' di sidebar kiri
-- 3. Klik 'New Query', paste seluruh isi file ini, lalu klik 'RUN'
-- ============================================================

-- 1. Buat Tabel portfolio_content
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by TEXT
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Baca (Public Read): Siapa saja pengunjung web bisa membaca data portofolio
DROP POLICY IF EXISTS "Public can view portfolio data" ON public.portfolio_content;
CREATE POLICY "Public can view portfolio data"
  ON public.portfolio_content
  FOR SELECT
  TO public
  USING (true);

-- 4. Kebijakan Tulis (Admin Update): Hanya admin yang terautentikasi (Authenticated) yang bisa insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can update portfolio data" ON public.portfolio_content;
CREATE POLICY "Authenticated users can update portfolio data"
  ON public.portfolio_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CATATAN KEAMANAN:
-- Pengunjung publik (anon) secara ketat HANYA diizinkan BACA (SELECT).
-- Operasi INSERT, UPDATE, dan DELETE DIBLOKIR 100% untuk anon key guna mencegah manipulasi data oleh pihak luar.

-- 6. Trigger otomatis update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_portfolio_content_updated_at ON public.portfolio_content;
CREATE TRIGGER update_portfolio_content_updated_at
    BEFORE UPDATE ON public.portfolio_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. KONFIGURASI SUPABASE STORAGE (FOTO, ASSET & SERTIFIKAT)
-- ============================================================
-- Buat bucket penyimpanan publik bernama 'portfolio-assets'
-- (Bisa juga dibuat melalui Dashboard Supabase: Menu 'Storage' -> 'New Bucket' -> 'portfolio-assets' -> centang Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- Maksimal 50MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];

-- 5a. Kebijakan Baca (Public Read): Siapa saja pengunjung web bisa melihat/mengunduh foto dan file
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
CREATE POLICY "Public can view portfolio assets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-assets');

-- 5b. Kebijakan Unggah (Authenticated Upload): Hanya Admin login yang diizinkan mengunggah file
DROP POLICY IF EXISTS "Authenticated users can upload portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

-- 5c. Kebijakan Ubah/Overwrite (Authenticated Update): Hanya Admin login yang bisa update file
DROP POLICY IF EXISTS "Authenticated users can update portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can update portfolio assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

-- 5d. Kebijakan Hapus (Authenticated Delete): Hanya Admin login yang bisa menghapus file
DROP POLICY IF EXISTS "Authenticated users can delete portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can delete portfolio assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');

-- CATATAN FLEKSIBILITAS:
-- Jika Anda juga ingin mengizinkan upload langsung dari browser saat login via Master PIN
-- tanpa membuat akun Supabase Auth terlebih dahulu, uncomment kebijakan berikut:
-- DROP POLICY IF EXISTS "Allow anon upload portfolio assets" ON storage.objects;
-- CREATE POLICY "Allow anon upload portfolio assets"
--   ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'portfolio-assets');

-- ============================================================
-- 6. PEMBUATAN AKUN ADMIN (Username: ladzdzah / Pass: Mufidz69.)
-- ============================================================
-- REKOMENDASI TERBAIK & PALING MUDAH (Lewat Dashboard Supabase):
-- 1. Buka https://supabase.com -> Masuk ke Project Anda
-- 2. Klik menu 'Authentication' di sidebar kiri -> Klik sub-menu 'Users'
-- 3. Klik tombol 'Add user' (kanan atas) -> Pilih 'Create user'
-- 4. Masukkan data berikut:
--    - Email: ladzdzah@portfolio.admin (atau email pribadi Anda)
--    - Password: Mufidz69.
--    - Centang 'Auto Confirm User?' (agar langsung aktif tanpa verifikasi email)
-- 5. Klik 'Create user'. Selesai 100%!
--
-- ============================================================
-- ALTERNATIF: JIKA INGIN MEMBUAT LEWAT SQL EDITOR:
-- Jalankan blok query di bawah ini (sudah disesuaikan dengan skema constraint Supabase terbaru):
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Bersihkan data user jika sebelumnya sempat gagal di tengah jalan
DELETE FROM auth.identities WHERE provider_id = 'ladzdzah@portfolio.admin' OR identity_data->>'email' = 'ladzdzah@portfolio.admin';
DELETE FROM auth.users WHERE email = 'ladzdzah@portfolio.admin';

-- 1. Masukkan ke auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'ladzdzah@portfolio.admin',
  crypt('Mufidz69.', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"ladzdzah","name":"Ladzdzah Hanan"}',
  now(),
  now(),
  encode(gen_random_bytes(32), 'hex'),
  encode(gen_random_bytes(32), 'hex')
);

-- 2. Masukkan ke auth.identities dengan provider_id lengkap
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
SELECT
  u.id::text,
  u.id,
  format('{"sub":"%s","email":"%s"}', u.id::text, u.email)::jsonb,
  'email',
  now(),
  now(),
  now(),
  gen_random_uuid()
FROM auth.users u
WHERE u.email = 'ladzdzah@portfolio.admin';



