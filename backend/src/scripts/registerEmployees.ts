import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function registerEmployees() {
  try {
    console.log('🚀 Iniciando registro de funcionários...')

    const employees = [
      {
        name: 'mauro landin',
        cpf: '55555555555',
        email: 'mauro.landin@example.com',
        role: 'ENGENHEIRO_CIVIL',
        salary: 8000.00,
        birth_date: new Date('1985-05-15'),
        admission_date: new Date('2024-01-01'),
        password: '123456'
      },
      {
        name: 'João Silva',
        cpf: '96587413358',
        email: 'joao.silva@example.com',
        role: 'MESTRE_OBRAS',
        salary: 5000.00,
        birth_date: new Date('1978-08-22'),
        admission_date: new Date('2024-01-01'),
        password: '123456'
      },
      {
        name: 'Maria Santos',
        cpf: '56321478985',
        email: 'maria.santos@example.com',
        role: 'ANALISTA_ADMINISTRATIVO_II',
        salary: 7000.00,
        birth_date: new Date('1990-03-10'),
        admission_date: new Date('2024-01-01'),
        password: '123456'
      }
    ]

    for (const employee of employees) {
      const hashedPassword = await hash(employee.password, 8)

      const existingEmployee = await prisma.user.findUnique({
        where: { cpf: employee.cpf }
      })

      if (existingEmployee) {
        console.log(`⚠️ Funcionário com CPF ${employee.cpf} já existe. Atualizando...`)
        await prisma.user.update({
          where: { cpf: employee.cpf },
          data: {
            name: employee.name,
            email: employee.email,
            role: employee.role,
            salary: employee.salary,
            birth_date: employee.birth_date,
            admission_date: employee.admission_date,
            password: hashedPassword
          }
        })
      } else {
        console.log(`✨ Registrando novo funcionário: ${employee.name}`)
        await prisma.user.create({
          data: {
            name: employee.name,
            cpf: employee.cpf,
            email: employee.email,
            role: employee.role,
            salary: employee.salary,
            birth_date: employee.birth_date,
            admission_date: employee.admission_date,
            password: hashedPassword,
            active: true
          }
        })
      }
    }

    console.log('✅ Registro de funcionários concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao registrar funcionários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

registerEmployees() 