import { prisma } from '../lib/prisma'

async function checkUsers() {
  try {
    console.log('🔍 Verificando todos os usuários no banco...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        active: true,
        salary: true,
        birth_date: true,
        admission_date: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('\n📊 Total de usuários:', users.length)
    console.log('\n📝 Lista detalhada (ordenada por data de criação):')
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`)
      console.log(`   CPF: ${user.cpf}`)
      console.log(`   Cargo: ${user.role}`)
      console.log(`   Status: ${user.active ? '✅ Ativo' : '❌ Inativo'}`)
      console.log(`   Salário: R$ ${user.salary?.toFixed(2)}`)
      console.log(`   Data de Nascimento: ${user.birth_date?.toLocaleDateString('pt-BR')}`)
      console.log(`   Data de Admissão: ${user.admission_date?.toLocaleDateString('pt-BR')}`)
      console.log(`   Data de Cadastro: ${user.createdAt?.toLocaleDateString('pt-BR')}`)
      console.log(`   ID: ${user.id}`)
      console.log('   ----------------------------------------')
    })

    // Verificação específica dos CPFs mencionados
    const cpfsToCheck = ['55555555555', '96587413358', '56321478985']
    
    console.log('\n🔍 Verificando CPFs específicos:')
    for (const cpf of cpfsToCheck) {
      const user = await prisma.user.findFirst({
        where: { cpf }
      })
      
      if (user) {
        console.log(`\n✅ CPF ${cpf} encontrado:`)
        console.log(`   Nome: ${user.name}`)
        console.log(`   Status: ${user.active ? 'Ativo' : 'Inativo'}`)
        console.log(`   Data de cadastro: ${user.createdAt?.toLocaleDateString('pt-BR')}`)
      } else {
        console.log(`\n❌ CPF ${cpf} não encontrado no banco`)
      }
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
    console.error('Detalhes do erro:', error instanceof Error ? error.message : 'Erro desconhecido')
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkUsers() 