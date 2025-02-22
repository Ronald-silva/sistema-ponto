-- Remover usuários existentes (se necessário)
DELETE FROM auth.users WHERE email = 'admin@example.com';
DELETE FROM auth.users WHERE email LIKE '%@employee.com';

-- Criar usuário admin com senha
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

-- Criar usuário funcionário com CPF como senha
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
  '123.456.789-00@employee.com',
  crypt('123.456.789-00', gen_salt('bf')),
  NOW(),
  '{"role": "EMPLOYEE", "name": "Funcionário Teste", "cpf": "123.456.789-00"}',
  NOW(),
  NOW()
);
