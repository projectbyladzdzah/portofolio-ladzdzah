-- ============================================================
-- FIX SUPABASE STORAGE ROW-LEVEL SECURITY (RLS) FOR PORTFOLIO
-- ============================================================
-- Script ini untuk mengatasi error:
-- "new row violates row-level security policy for table 'objects'"
--
-- CARA MENGGUNAKAN (Hanya 10 detik):
-- 1. Buka https://supabase.com/dashboard -> Pilih Project Anda
-- 2. Di sidebar kiri, klik menu "SQL Editor"
-- 3. Klik tombol "New Query" di bagian atas
-- 4. Copy & Paste seluruh kode di bawah ini, lalu klik "RUN" (tombol hijau)
-- ============================================================

-- 1. Pastikan bucket 'portfolio-assets' ada dan disetel PUBLIC
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];

-- 2. Bersihkan policy lama pada tabel storage.objects yang mungkin memblokir
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all updates to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_assets_public_select" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_assets_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_assets_public_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_assets_public_delete" ON storage.objects;

-- 3. Kebijakan BACA (SELECT): Semua pengunjung web bisa melihat foto & sertifikat
CREATE POLICY "portfolio_assets_public_select"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-assets');

-- 4. Kebijakan UNGGAH (INSERT): Izinkan admin mengunggah file foto/banner/sertifikat ke bucket
CREATE POLICY "portfolio_assets_public_insert"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'portfolio-assets');

-- 5. Kebijakan PERBARUI (UPDATE): Izinkan memperbarui atau mengganti file yang sudah ada
CREATE POLICY "portfolio_assets_public_update"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

-- 6. Kebijakan HAPUS (DELETE): Izinkan menghapus file dari bucket
CREATE POLICY "portfolio_assets_public_delete"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'portfolio-assets');

-- ============================================================
-- SELESAI! Setelah query ini dijalankan, upload foto dari admin
-- akan langsung tersimpan di CDN Supabase Storage tanpa error RLS.
-- ============================================================
