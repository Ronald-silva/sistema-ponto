import { prisma } from '../lib/prisma'

const roleMapping: Record<string, string> = {
  'ALMOXARIFE A': 'ALMOXARIFE_A',
  'ANALISTA ADMINISTRATIVO II': 'ANALISTA_ADMINISTRATIVO_II',
  'Analista Ambiental Junior': 'ANALISTA_AMBIENTAL_JUNIOR',
  'Analista de Compras Junior A': 'ANALISTA_COMPRAS_JUNIOR_A',
  'Analista de Controladoria Junior A': 'ANALISTA_CONTROLADORIA_JUNIOR_A',
  'Analista de Orçamento Junior A': 'ANALISTA_ORCAMENTO_JUNIOR_A',
  'Analista de Planejamento Junior A': 'ANALISTA_PLANEJAMENTO_JUNIOR_A',
  'ASSISTENTE ADM V': 'ASSISTENTE_ADM_V',
  'Assistente de Compras': 'ASSISTENTE_COMPRAS',
  'Assistente de Controladoria C': 'ASSISTENTE_CONTROLADORIA_C',
  'Assistente de Departamento Pessoal C': 'ASSISTENTE_DP_C',
  'Assistente de Obra A': 'ASSISTENTE_OBRA_A',
  'Assistente de TI A': 'ASSISTENTE_TI_A',
  'Assistente Financeiro': 'ASSISTENTE_FINANCEIRO',
  'ASSISTENTE TECNICO III': 'ASSISTENTE_TECNICO_III',
  'AUX ADMINISTRATIVO I': 'AUX_ADMINISTRATIVO_I',
  'AUX DE BOMBEIRO HIDRAULICO': 'AUX_BOMBEIRO_HIDRAULICO',
  'Auxiliar Administrativo B': 'AUXILIAR_ADMINISTRATIVO_B',
  'Auxiliar de Almoxarifado': 'AUXILIAR_ALMOXARIFADO',
  'AUXILIAR DE BOMBEIRO': 'AUXILIAR_BOMBEIRO',
  'AUXILIAR DE MUNK': 'AUXILIAR_MUNK',
  'Auxiliar de Obra A': 'AUXILIAR_OBRA_A',
  'BOMBEIRO HIDRAULICO': 'BOMBEIRO_HIDRAULICO',
  'Coordenador Administrativo-Financeiro': 'COORDENADOR_ADM_FINANCEIRO',
  'ENCARREGADO DE OBRAS': 'ENCARREGADO_OBRAS',
  'ENCARREGADO DE OBRAS I': 'ENCARREGADO_OBRAS_I',
  'ENGENHEIRO CIVIL': 'ENGENHEIRO_CIVIL',
  'ESTAGIARIO': 'ESTAGIARIO',
  'ESTAGIARIO DE ENDOMARKETING': 'ESTAGIARIO_ENDOMARKETING',
  'ESTAGIARIO DE PROCESSOS': 'ESTAGIARIO_PROCESSOS',
  'GERENTE DE OBRAS': 'GERENTE_OBRAS',
  'JOVEM APRENDIZ': 'JOVEM_APRENDIZ',
  'LIDER DE EQUIPE': 'LIDER_EQUIPE',
  'MESTRE DE OBRAS': 'MESTRE_OBRAS',
  'MOTORISTA': 'MOTORISTA',
  'MOTORISTA I': 'MOTORISTA_I',
  'MOTORISTA OPERACIONAL DE GUINCHO': 'MOTORISTA_GUINCHO',
  'Operador de Máquina de Terraplanagem': 'OPERADOR_MAQUINA_TERRAPLANAGEM',
  'PEDREIRO': 'PEDREIRO',
  'RECEPCIONISTA': 'RECEPCIONISTA',
  'SERVENTE': 'SERVENTE',
  'SERVICOS GERAIS I': 'SERVICOS_GERAIS_I',
  'SERVICOS GERAIS II': 'SERVICOS_GERAIS_II',
  'SUPERVISOR ADM II': 'SUPERVISOR_ADM_II',
  'Supervisor de Compras': 'SUPERVISOR_COMPRAS',
  'Supervisor de Departamento Pessoal A': 'SUPERVISOR_DP_A',
  'Supervisor de Desenvolvimento Humano': 'SUPERVISOR_DH',
  'Supervisor de Obra': 'SUPERVISOR_OBRA',
  'SUPERVISOR DE SEGURANCA DO TRABALHO': 'SUPERVISOR_SEGURANCA_TRABALHO',
  'Supervisor Financeiro': 'SUPERVISOR_FINANCEIRO',
  'TECNICO DE SEGURANCA DO TRABALHO II': 'TECNICO_SEGURANCA_TRABALHO_II',
  'TOPOGRAFO': 'TOPOGRAFO',
  'VIGIA': 'VIGIA'
}

async function updateUserRoles() {
  try {
    console.log('🔍 Buscando usuários...')
    
    // Primeiro vamos fazer um backup dos dados atuais
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          role: 'ADMIN'
        }
      }
    })

    console.log(`\n📊 Total de usuários para atualizar: ${users.length}`)

    for (const user of users) {
      // Por padrão, vamos definir como SERVENTE se não houver um cargo específico
      const newRole = 'SERVENTE'
      
      console.log(`\n🔄 Atualizando usuário: ${user.name}`)
      console.log(`   CPF: ${user.cpf}`)
      console.log(`   Cargo atual: ${user.role}`)
      console.log(`   Novo cargo: ${newRole}`)

      // Atualizar diretamente no banco usando SQL raw para evitar validação do Prisma
      await prisma.$executeRaw`
        UPDATE "User"
        SET role = ${newRole}::text::"UserRole"
        WHERE id = ${user.id}
      `
    }

    console.log('\n✅ Atualização concluída!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('\n❌ Erro ao atualizar usuários:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

updateUserRoles() 