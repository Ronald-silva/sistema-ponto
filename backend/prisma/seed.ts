import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        cpf: '000.000.000-00',
        role: UserRole.ADMIN,
        active: true,
        email: 'admin@example.com',
        password: '123456'
      }
    })

    console.log('Admin criado:', admin)

    // Criar alguns funcionários
    const employees = await Promise.all([
      prisma.user.create({
        data: {
          name: 'João Silva',
          cpf: '111.111.111-11',
          role: UserRole.EMPLOYEE,
          birth_date: new Date('1990-01-15'),
          admission_date: new Date('2023-01-10'),
          active: true,
          salary: 2500
        }
      }),
      prisma.user.create({
        data: {
          name: 'Maria Santos',
          cpf: '222.222.222-22',
          role: UserRole.EMPLOYEE,
          birth_date: new Date('1985-06-20'),
          admission_date: new Date('2023-02-15'),
          active: true,
          salary: 3000
        }
      })
    ])

    console.log('Funcionários criados:', employees)

    // Criar alguns projetos
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'Construção Residencial Vila Verde',
          description: 'Construção de condomínio residencial',
          companyId: '1',
          status: 'ACTIVE'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Reforma Shopping Center',
          description: 'Reforma e ampliação de shopping',
          companyId: '2',
          status: 'ACTIVE'
        }
      })
    ])

    console.log('Projetos criados:', projects)

    // Associar funcionários aos projetos
    const userProjects = await Promise.all([
      prisma.userProject.create({
        data: {
          userId: employees[0].id,
          projectId: projects[0].id
        }
      }),
      prisma.userProject.create({
        data: {
          userId: employees[1].id,
          projectId: projects[1].id
        }
      })
    ])

    console.log('Associações de funcionários e projetos criadas:', userProjects)

    // Criar alguns registros de ponto
    const timeRecords = await Promise.all([
      prisma.timeRecord.create({
        data: {
          userId: employees[0].id,
          projectId: projects[0].id,
          type: 'ENTRY',
          timestamp: new Date('2024-02-19T08:00:00Z')
        }
      }),
      prisma.timeRecord.create({
        data: {
          userId: employees[0].id,
          projectId: projects[0].id,
          type: 'EXIT',
          timestamp: new Date('2024-02-19T17:00:00Z')
        }
      })
    ])

    console.log('Registros de ponto criados:', timeRecords)

  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 