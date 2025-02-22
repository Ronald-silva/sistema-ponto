-- Habilitar o CORS para todos os endpoints
ALTER SYSTEM SET http.cors.origins = '*';

-- Se você quiser restringir apenas para seu domínio do Vercel, use:
-- ALTER SYSTEM SET http.cors.origins = 'https://seu-app.vercel.app';

-- Habilitar todos os métodos HTTP necessários
ALTER SYSTEM SET http.cors.allowed_methods = 'GET,POST,PUT,DELETE,OPTIONS';

-- Permitir headers customizados
ALTER SYSTEM SET http.cors.allowed_headers = 'Authorization,Content-Type,Accept,Origin,User-Agent';

-- Configurar o tempo máximo de cache para preflight requests
ALTER SYSTEM SET http.cors.max_age = '3600';

-- Permitir envio de credenciais
ALTER SYSTEM SET http.cors.expose_headers = 'Authorization';

-- Recarregar as configurações
SELECT pg_reload_conf();
