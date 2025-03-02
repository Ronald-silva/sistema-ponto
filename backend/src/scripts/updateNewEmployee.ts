import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function updateNewEmployee() {
  try {
    console.log('🔍 Buscando funcionário...')
    
    const cpf = '69863215475'
    const employee = await prisma.user.findUnique({
      where: { cpf }
    })

    if (!employee) {
      console.log('❌ Funcionário não encontrado!')
      return
    }

    console.log(`📊 Funcionário encontrado: ${employee.name}`)

    // Gerar senha padrão e hash
    const password = '123456'
    const hashedPassword = await hash(password, 8)

    // Atualizar funcionário
    await prisma.user.update({
      where: { id: employee.id },
      data: {
        password: hashedPassword,
        active: true,
        email: `${employee.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
        birth_date: employee.birth_date || new Date('1990-01-01'),
        admission_date: employee.admission_date || new Date('2024-01-01'),
        role: 'SERVENTE' // Definindo um cargo padrão
      }
    })

    console.log('✅ Funcionário atualizado com sucesso!')
    console.log(`📧 Email: ${employee.name.replace(/\s+/g, '.').toLowerCase()}@example.com`)
    console.log(`🔑 Senha: ${password}`)
    console.log(`👔 Cargo: SERVENTE`)

  } catch (error) {
    console.error('❌ Erro ao atualizar funcionário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateNewEmployee() 