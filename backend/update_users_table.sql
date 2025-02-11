-- Remover as colunas email e password
ALTER TABLE users DROP COLUMN IF EXISTS email;
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Atualizar os tipos de cargo
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN (
  'PEDREIRO',
  'SERVENTE',
  'MESTRE_DE_OBRAS',
  'CARPINTEIRO',
  'ARMADOR',
  'ELETRICISTA',
  'ENCANADOR',
  'PINTOR',
  'AZULEJISTA',
  'ENGENHEIRO',
  'ARQUITETO',
  'ALMOXARIFE',
  'ADMINISTRATIVO',
  'ADMIN'
));
