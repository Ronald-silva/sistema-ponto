-- Criar tabela de usuários estendida
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role VARCHAR(255) NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE')),
  cpf VARCHAR(14),
  name VARCHAR(255) NOT NULL,
  birth_year INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT cpf_unique UNIQUE (cpf),
  CONSTRAINT birth_year_check CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM NOW()) - 16)
);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar política para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Criar função para criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Tentar atualizar usuário existente
  UPDATE public.users 
  SET 
    id = NEW.id,
    role = COALESCE(NEW.raw_user_meta_data->>'role', role),
    name = COALESCE(NEW.raw_user_meta_data->>'name', name),
    updated_at = NOW()
  WHERE cpf = NEW.raw_user_meta_data->>'cpf';

  -- Se não atualizou nenhum usuário, criar um novo
  IF NOT FOUND THEN
    INSERT INTO public.users (id, role, name, cpf, birth_year)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.raw_user_meta_data->>'cpf',
      (NEW.raw_user_meta_data->>'birth_year')::INTEGER
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar usuário admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"role": "ADMIN", "name": "Administrador"}',
  NOW(),
  NOW()
);
