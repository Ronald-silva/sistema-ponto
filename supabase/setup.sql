-- Criar tabela de profiles para estender os usuários do Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR(255) NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE')),
  cpf VARCHAR(14),
  name VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT cpf_unique UNIQUE (cpf)
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Criar função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, cpf)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'cpf'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar usuário admin
INSERT INTO auth.users (
  email,
  raw_user_meta_data,
  email_confirmed_at
)
VALUES (
  'admin@example.com',
  '{"role": "ADMIN", "name": "Administrador"}',
  now()
);

-- Criar usuário funcionário de teste
INSERT INTO auth.users (
  email,
  raw_user_meta_data,
  email_confirmed_at
)
VALUES (
  '123.456.789-00@employee.com',
  '{"role": "EMPLOYEE", "name": "Funcionário Teste", "cpf": "123.456.789-00"}',
  now()
);
