-- Habilitar RLS
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;

-- Política para inserção
CREATE POLICY "Users can insert their own time records"
  ON time_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para leitura
CREATE POLICY "Users can view their own time records"
  ON time_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para atualização
CREATE POLICY "Users can update their own time records"
  ON time_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política para deleção
CREATE POLICY "Users can delete their own time records"
  ON time_records
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
