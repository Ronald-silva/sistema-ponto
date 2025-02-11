-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários autenticados podem ler projetos" ON public.projects;
DROP POLICY IF EXISTS "Apenas admins podem modificar projetos" ON public.projects;

-- Criar novas políticas para projetos
CREATE POLICY "Usuários autenticados podem ler projetos" ON public.projects
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem inserir projetos" ON public.projects
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins podem atualizar projetos" ON public.projects
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins podem deletar projetos" ON public.projects
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );
