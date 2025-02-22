-- Atualizar função para criar usuário
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
    INSERT INTO public.users (id, role, name, cpf)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.raw_user_meta_data->>'cpf'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
