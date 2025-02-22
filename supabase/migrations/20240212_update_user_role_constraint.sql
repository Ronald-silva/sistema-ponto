-- Atualizar a coluna role para TEXT sem restrições
ALTER TABLE users ALTER COLUMN role TYPE TEXT;

-- Remover qualquer tipo enum associado
DROP TYPE IF EXISTS user_role CASCADE;

-- Atualizar registros existentes para um cargo válido
UPDATE users 
SET role = 'SERVICOS_GERAIS_I'
WHERE role NOT IN (
    'PEDREIRO',
    'SERVENTE',
    'MESTRE_DE_OBRAS',
    'CARPINTEIRO',
    'ARMADOR',
    'ENGENHEIRO_CIVIL',
    'ESTAGIARIO',
    'ESTAGIARIO_DE_ENDOMARKETING',
    'ESTAGIARIO_DE_PROCESSOS',
    'GERENTE_DE_OBRAS',
    'JOVEM_APRENDIZ',
    'LIDER_DE_EQUIPE',
    'MOTORISTA',
    'MOTORISTA_I',
    'MOTORISTA_OPERACIONAL_DE_GUINCHO',
    'OPERADOR_DE_MAQUINA_DE_TERRAPLANAGEM',
    'RECEPCIONISTA',
    'SERVICOS_GERAIS_I',
    'SERVICOS_GERAIS_II',
    'SUPERVISOR_ADM_II',
    'SUPERVISOR_DE_COMPRAS',
    'SUPERVISOR_DE_DEPARTAMENTO_PESSOAL_A',
    'SUPERVISOR_DE_DESENVOLVIMENTO_HUMANO',
    'SUPERVISOR_DE_OBRA',
    'SUPERVISOR_DE_SEGURANCA_DO_TRABALHO',
    'SUPERVISOR_FINANCEIRO',
    'TECNICO_EM_SEGURANCA_DO_TRABALHO_II',
    'TOPOGRAFO',
    'VIGIA'
);

-- Remover a constraint antiga
ALTER TABLE users DROP CONSTRAINT users_role_check;

-- Adicionar a nova constraint com os valores exatos do dropdown
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role = ANY(ARRAY[
    'ALMOXARIFE A'::text,
    'ANALISTA ADMINISTRATIVO II'::text,
    'Analista Ambiental Junior'::text,
    'Analista de Compras Junior A'::text,
    'Analista de Controladoria Junior A'::text,
    'Analista de Orçamento Junior A'::text,
    'Analista de Planejamento Junior A'::text,
    'ASSISTENTE ADM V'::text,
    'Assistente de Compras'::text,
    'Assistente de Controladoria C'::text,
    'Assistente de Departamento Pessoal C'::text,
    'Assistente de Obra A'::text,
    'Assistente de TI A'::text,
    'Assistente Financeiro'::text,
    'ASSISTENTE TECNICO III'::text,
    'AUX ADMINISTRATIVO I'::text,
    'AUX DE BOMBEIRO HIDRAULICO'::text,
    'Auxiliar Administrativo B'::text,
    'Auxiliar de Almoxarifado'::text,
    'AUXILIAR DE BOMBEIRO'::text,
    'AUXILIAR DE MUNK'::text,
    'Auxiliar de Obra A'::text,
    'BOMBEIRO HIDRAULICO'::text,
    'Coordenador Administrativo-Financeiro'::text,
    'ENCARREGADO DE OBRAS'::text,
    'ENCARREGADO DE OBRAS I'::text,
    'ENGENHEIRO CIVIL'::text,
    'ESTAGIARIO'::text,
    'ESTAGIARIO DE ENDOMARKETING'::text,
    'ESTAGIARIO DE PROCESSOS'::text,
    'GERENTE DE OBRAS'::text,
    'JOVEM APRENDIZ'::text,
    'LIDER DE EQUIPE'::text,
    'MESTRE DE OBRAS'::text,
    'MOTORISTA'::text,
    'MOTORISTA I'::text,
    'MOTORISTA OPERACIONAL DE GUINCHO'::text,
    'Operador de Máquina de Terraplanagem'::text,
    'PEDREIRO'::text,
    'RECEPCIONISTA'::text,
    'SERVENTE'::text,
    'SERVICOS GERAIS I'::text,
    'SERVICOS GERAIS II'::text,
    'SUPERVISOR ADM II'::text,
    'Supervisor de Compras'::text,
    'Supervisor de Departamento Pessoal A'::text,
    'Supervisor de Desenvolvimento Humano'::text,
    'Supervisor de Obra'::text,
    'SUPERVISOR DE SEGURANCA DO TRABALHO'::text,
    'Supervisor Financeiro'::text,
    'TECNICO DE SEGURANCA DO TRABALHO II'::text,
    'TOPOGRAFO'::text,
    'VIGIA'::text
]));
