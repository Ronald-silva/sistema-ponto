-- Função para registrar ponto
CREATE OR REPLACE FUNCTION register_time(
  p_user_id UUID,
  p_type TEXT,
  p_timestamp TIMESTAMPTZ
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Inserir o registro de ponto
  INSERT INTO time_records (user_id, type, timestamp)
  VALUES (p_user_id, p_type, p_timestamp)
  RETURNING json_build_object(
    'id', id,
    'user_id', user_id,
    'type', type,
    'timestamp', timestamp
  ) INTO v_result;

  RETURN v_result;
END;
$$;
