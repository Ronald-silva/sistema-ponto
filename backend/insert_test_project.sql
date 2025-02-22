-- Inserir projeto de teste
INSERT INTO projects (
  name,
  location,
  start_date,
  status,
  category,
  company,
  active
)
VALUES (
  'Projeto Teste',
  'Rua Teste, 123',
  CURRENT_DATE,
  'ACTIVE',
  'CONSTRUCTION',
  'Empresa Teste',
  true
)
RETURNING *;
