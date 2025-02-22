-- Primeiro dropa a tabela se ela existir
DROP TABLE IF EXISTS users;

-- Depois cria a tabela com todos os campos necessários
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
