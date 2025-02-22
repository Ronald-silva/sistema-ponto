-- Remover todas as colunas relacionadas à autenticação
ALTER TABLE users 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS encrypted_password,
DROP COLUMN IF EXISTS email_confirmed_at,
DROP COLUMN IF EXISTS confirmation_token,
DROP COLUMN IF EXISTS confirmation_sent_at,
DROP COLUMN IF EXISTS recovery_token,
DROP COLUMN IF EXISTS recovery_sent_at,
DROP COLUMN IF EXISTS email_change_token_new,
DROP COLUMN IF EXISTS email_change,
DROP COLUMN IF EXISTS email_change_sent_at,
DROP COLUMN IF EXISTS last_sign_in_at,
DROP COLUMN IF EXISTS raw_app_meta_data,
DROP COLUMN IF EXISTS raw_user_meta_data,
DROP COLUMN IF EXISTS is_super_admin,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS phone_confirmed_at,
DROP COLUMN IF EXISTS phone_change,
DROP COLUMN IF EXISTS phone_change_token,
DROP COLUMN IF EXISTS phone_change_sent_at,
DROP COLUMN IF EXISTS confirmed_at,
DROP COLUMN IF EXISTS email_change_token_current,
DROP COLUMN IF EXISTS email_change_confirm_status,
DROP COLUMN IF EXISTS banned_until,
DROP COLUMN IF EXISTS reauthentication_token,
DROP COLUMN IF EXISTS reauthentication_sent_at,
DROP COLUMN IF EXISTS is_sso_user,
DROP COLUMN IF EXISTS deleted_at,
DROP COLUMN IF EXISTS is_anonymous,
DROP COLUMN IF EXISTS invited_at,
DROP COLUMN IF EXISTS instance_id;
