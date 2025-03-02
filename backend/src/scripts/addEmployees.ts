import { prisma } from '../lib/prisma'

async function addEmployees() {
  try {
    console.log('🔍 Adicionando funcionários...')
    
    const employees = [
      {
        name: 'laura campos',
        cpf: '96587413358',
        email: 'laura.campos@empresa.com',
        password: '123456',
        role: 'EMPLOYEE',
        salary: 6000,
        birth_date: new Date('2000-06-04'),
        admission_date: new Date('2025-02-28'),
        active: true
      },
      {
        name: 'leandro matos',
        cpf: '56321478985',
        email: 'leandro.matos@empresa.com',
        password: '123456',
        role: 'EMPLOYEE',
        salary: 6000,
        birth_date: new Date('2000-06-04'),
        admission_date: new Date('2025-01-24'),
        active: true
      }
    ]

    for (const employee of employees) {
      // Verificar se já existe
      const existing = await prisma.user.findUnique({
        where: { cpf: employee.cpf }
      })

      if (existing) {
        console.log(`\n⚠️ Funcionário com CPF ${employee.cpf} já existe:`)
        console.log(`   Nome: ${existing.name}`)
        console.log(`   Status: ${existing.active ? 'Ativo' : 'Inativo'}`)
        continue
      }

      // Criar novo funcionário
      const created = await prisma.user.create({
        data: employee
      })

      console.log(`\n✅ Funcionário criado com sucesso:`)
      console.log(`   Nome: ${created.name}`)
      console.log(`   CPF: ${created.cpf}`)
      console.log(`   Status: ${created.active ? 'Ativo' : 'Inativo'}`)
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Erro ao adicionar funcionários:', error)
    console.error('Detalhes do erro:', error instanceof Error ? error.message : 'Erro desconhecido')
    await prisma.$disconnect()
    process.exit(1)
  }
}

addEmployees() 