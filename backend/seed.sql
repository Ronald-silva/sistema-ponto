-- Inserir projetos de teste
INSERT INTO projects (name, location, start_date, status, category, company, active)
VALUES 
  ('Construção Residencial Vila Verde', 'Rua das Flores, 123', '2025-01-01', 'ACTIVE', 'CONSTRUCTION', 'Construtora ABC', true),
  ('Reforma Shopping Center', 'Av. Principal, 456', '2025-02-01', 'ACTIVE', 'RENOVATION', 'Construtora XYZ', true),
  ('Manutenção Predial', 'Rua Comercial, 789', '2025-03-01', 'ACTIVE', 'MAINTENANCE', 'Construtora 123', true);

-- Inserir usuário de teste
INSERT INTO users (name, cpf, email, password, role, active, salary)
VALUES 
  ('João Silva', '12345678900', 'joao@email.com', 'senha123', 'EMPLOYEE', true, 5000.00);
