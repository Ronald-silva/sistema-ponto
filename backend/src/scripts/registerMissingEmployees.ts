import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function registerMissingEmployees() {
  try {
    console.log('🚀 Iniciando registro de funcionários...')

    const employees = [
      {
        name: 'laura campos',
        cpf: '96587413358',
        email: 'laura.campos@example.com',
        role: 'ANALISTA_ADMINISTRATIVO_II',
        salary: 6000.00,
        birth_date: new Date('2000-06-04'),
        admission_date: new Date('2025-02-28'),
        password: '123456'
      },
      {
        name: 'malinda gomes',
        cpf: '98632154789',
        email: 'malinda.gomes@example.com',
        role: 'ASSISTENTE_ADM_V',
        salary: 5000.00,
        birth_date: new Date('2000-06-04'),
        admission_date: new Date('2025-02-28'),
        password: '123456'
      },
      {
        name: 'leandro matos',
        cpf: '56321478985',
        email: 'leandro.matos@example.com',
        role: 'SUPERVISOR_ADM_II',
        salary: 6000.00,
        birth_date: new Date('2000-06-04'),
        admission_date: new Date('2025-01-24'),
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

registerMissingEmployees() 