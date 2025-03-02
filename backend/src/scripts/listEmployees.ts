import { prisma } from '../lib/prisma'

async function listEmployees() {
  try {
    console.log('🔍 Buscando todos os funcionários...')
    
    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE'
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        active: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    console.log('\n📊 Total de funcionários encontrados:', employees.length)
    console.log('\n📝 Lista de funcionários:')
    
    employees.forEach((employee, index) => {
      console.log(`\n${index + 1}. ${employee.name}`)
      console.log(`   CPF: ${employee.cpf}`)
      console.log(`   Status: ${employee.active ? '✅ Ativo' : '❌ Inativo'}`)
      console.log(`   Cargo: ${employee.role}`)
      console.log('   ----------------------------------------')
    })

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Erro ao listar funcionários:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

listEmployees() 