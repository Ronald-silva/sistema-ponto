-- Criar tabela de registros de ponto
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('ENTRY', 'EXIT')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  face_match_score FLOAT,
  location_latitude FLOAT,
  location_longitude FLOAT,
  device_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
