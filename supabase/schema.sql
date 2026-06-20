-- Tabla de fotos
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  user_name TEXT DEFAULT 'Anónimo',
  source TEXT CHECK (source IN ('web', 'instagram')) DEFAULT 'web',
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_approved ON photos(is_approved) WHERE is_approved = true;

-- RLS (Row Level Security)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública de fotos aprobadas
CREATE POLICY "Public read approved photos"
  ON photos FOR SELECT
  USING (is_approved = true);

-- Política: inserción desde service role (API)
CREATE POLICY "Service role can insert"
  ON photos FOR INSERT
  WITH CHECK (true);

-- Bucket público
INSERT INTO storage.buckets (id, name, public)
VALUES ('pergola-photos', 'pergola-photos', true);

-- Política de upload para el bucket
CREATE POLICY "Allow public uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pergola-photos');

-- Política de lectura pública
CREATE POLICY "Allow public reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pergola-photos');

-- Tabla de Promociones (Sponsor y Sorteos)
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Promociones
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active promotions"
  ON promotions FOR SELECT
  USING (is_active = true);
