-- Configuração inicial da tabela users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    salary TEXT,
    birth_date DATE NOT NULL,
    admission_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuração da tabela time_records
CREATE TABLE IF NOT EXISTS time_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    entry_time TIMESTAMPTZ NOT NULL,
    exit_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurar CORS
DO $$ 
BEGIN
    PERFORM set_config('app.settings.cors_origins', '*', false);
END $$;

-- Criar função para registrar ponto
CREATE OR REPLACE FUNCTION register_time(
    p_user_id UUID,
    p_entry_time TIMESTAMPTZ DEFAULT NULL,
    p_exit_time TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    entry_time TIMESTAMPTZ,
    exit_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Se não foi fornecido horário de entrada, usar NOW()
    IF p_entry_time IS NULL THEN
        p_entry_time := NOW();
    END IF;

    -- Inserir novo registro
    RETURN QUERY
    INSERT INTO time_records (user_id, entry_time, exit_time)
    VALUES (p_user_id, p_entry_time, p_exit_time)
    RETURNING *;
END;
$$;

-- Configurar políticas de segurança para time_records
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own time records"
    ON time_records
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time records"
    ON time_records
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time records"
    ON time_records
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
