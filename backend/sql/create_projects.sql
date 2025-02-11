-- Criar tabela de projetos
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  start_date date not null,
  end_date date,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar políticas de segurança
create policy "Projetos são visíveis para todos os usuários autenticados"
  on projects for select
  to authenticated
  using (true);

create policy "Apenas admins podem criar projetos"
  on projects for insert
  to authenticated
  using (auth.jwt() ->> 'role' = 'ADMIN');

create policy "Apenas admins podem atualizar projetos"
  on projects for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'ADMIN');

create policy "Apenas admins podem deletar projetos"
  on projects for delete
  to authenticated
  using (auth.jwt() ->> 'role' = 'ADMIN');

-- Habilitar RLS (Row Level Security)
alter table projects enable row level security;

-- Inserir projeto
INSERT INTO projects (name, active)
VALUES ('JOSE RONALD DA SILVA', true);
