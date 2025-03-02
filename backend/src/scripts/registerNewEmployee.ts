import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function registerNewEmployee() {
  try {
    console.log('🚀 Iniciando registro do novo funcionário...')

    const password = '123456'
    const hashedPassword = await hash(password, 8)

    const newEmployee = {
      name: 'max renato call',
      cpf: '69863215475',
      email: 'max.renato.call@example.com',
      role: 'SERVENTE',
      salary: 3000.00,
      birth_date: new Date('1990-01-01'),
      admission_date: new Date('2024-03-02'),
      password: hashedPassword,
      active: true
    }

    const existingEmployee = await prisma.user.findUnique({
      where: { cpf: newEmployee.cpf }
    })

    if (existingEmployee) {
      console.log(`⚠️ Funcionário com CPF ${newEmployee.cpf} já existe. Atualizando...`)
      await prisma.user.update({
        where: { cpf: newEmployee.cpf },
        data: newEmployee
      })
    } else {
      console.log(`✨ Registrando novo funcionário: ${newEmployee.name}`)
      await prisma.user.create({
        data: newEmployee
      })
    }

    console.log('\n✅ Registro concluído com sucesso!')
    console.log('📝 Dados para login:')
    console.log(`👤 CPF: ${newEmployee.cpf}`)
    console.log(`🔑 Senha: ${password}`)
    console.log(`📧 Email: ${newEmployee.email}`)
    console.log(`👔 Cargo: ${newEmployee.role}`)

  } catch (error) {
    console.error('❌ Erro ao registrar funcionário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

registerNewEmployee() 