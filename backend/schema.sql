-- Habilitar a extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar função de trigger para atualizar o updated_at
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar a tabela users com todos os campos necessários
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE')),
    active BOOLEAN DEFAULT true,
    salary DOUBLE PRECISION,
    birth_date DATE,
    admission_date DATE,
    face_encoding TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar trigger para atualizar o updated_at na tabela users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela de projetos
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    estimated_end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELLED')),
    category VARCHAR(50) CHECK (category IN ('CONSTRUCTION', 'RENOVATION', 'MAINTENANCE', 'INFRASTRUCTURE', 'OTHER')),
    company VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar trigger para atualizar o updated_at na tabela projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela de registros de ponto
DROP TABLE IF EXISTS time_entries CASCADE;
CREATE TABLE time_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('ENTRY', 'EXIT')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    face_match_score DOUBLE PRECISION,
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    device_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar trigger para atualizar o updated_at na tabela time_entries
DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS users_select ON users;
DROP POLICY IF EXISTS users_insert ON users;
DROP POLICY IF EXISTS users_update ON users;
DROP POLICY IF EXISTS users_delete ON users;

DROP POLICY IF EXISTS projects_select ON projects;
DROP POLICY IF EXISTS projects_insert ON projects;
DROP POLICY IF EXISTS projects_update ON projects;
DROP POLICY IF EXISTS projects_delete ON projects;

DROP POLICY IF EXISTS time_entries_select ON time_entries;
DROP POLICY IF EXISTS time_entries_insert ON time_entries;
DROP POLICY IF EXISTS time_entries_update ON time_entries;
DROP POLICY IF EXISTS time_entries_delete ON time_entries;

-- Políticas para users
CREATE POLICY users_select ON users FOR SELECT USING (true);
CREATE POLICY users_insert ON users FOR INSERT WITH CHECK (true);
CREATE POLICY users_update ON users FOR UPDATE USING (true);
CREATE POLICY users_delete ON users FOR DELETE USING (true);

-- Políticas para projects (permitir acesso anônimo)
CREATE POLICY projects_select ON projects 
    FOR SELECT 
    USING (true);

CREATE POLICY projects_insert ON projects 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY projects_update ON projects 
    FOR UPDATE 
    USING (true);

CREATE POLICY projects_delete ON projects 
    FOR DELETE 
    USING (true);

-- Políticas para time_entries
CREATE POLICY time_entries_select ON time_entries FOR SELECT USING (true);
CREATE POLICY time_entries_insert ON time_entries FOR INSERT WITH CHECK (true);
CREATE POLICY time_entries_update ON time_entries FOR UPDATE USING (true);
CREATE POLICY time_entries_delete ON time_entries FOR DELETE USING (true);
