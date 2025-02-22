-- Criar tabela de obras (projects)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar o updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela de funcionários (employees)
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    salary DECIMAL(10,2) NOT NULL,
    birth_date DATE NOT NULL,
    admission_date DATE NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar trigger para atualizar o updated_at em employees
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela de vínculo entre funcionários e obras
CREATE TABLE IF NOT EXISTS employee_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, project_id, start_date)
);

-- Criar trigger para atualizar o updated_at em employee_projects
CREATE TRIGGER update_employee_projects_updated_at
    BEFORE UPDATE ON employee_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar políticas de segurança RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_projects ENABLE ROW LEVEL SECURITY;

-- Políticas para projetos
CREATE POLICY "Projetos visíveis para usuários autenticados"
    ON projects FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas administradores podem modificar projetos"
    ON projects FOR ALL
    USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'user_role' = 'ADMIN');

-- Políticas para funcionários
CREATE POLICY "Funcionários visíveis para usuários autenticados"
    ON employees FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas administradores podem modificar funcionários"
    ON employees FOR ALL
    USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'user_role' = 'ADMIN');

-- Políticas para vínculos
CREATE POLICY "Vínculos visíveis para usuários autenticados"
    ON employee_projects FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas administradores podem modificar vínculos"
    ON employee_projects FOR ALL
    USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'user_role' = 'ADMIN');

\d projects;
