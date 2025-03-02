import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: "Administrador",
        cpf: "000.000.000-00",
        role: "ADMIN",
        active: true,
        email: "admin@example.com",
        password: "123456",
        salary: 5000.00,
        birth_date: new Date("1990-01-01"),
        admission_date: new Date("2020-01-01")
      }
    })

    console.log('Admin criado:', admin)

    // Criar projetos de teste
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: "Projeto A",
          description: "Descrição do Projeto A",
          companyId: "1", // CDG Engenharia
          active: true,
          status: "Em Andamento"
        }
      }),
      prisma.project.create({
        data: {
          name: "Projeto B",
          description: "Descrição do Projeto B",
          companyId: "2", // Urban Engenharia
          active: true,
          status: "Em Andamento"
        }
      }),
      prisma.project.create({
        data: {
          name: "Projeto C",
          description: "Descrição do Projeto C",
          companyId: "3", // Consórcio Aquiraz PDD
          active: false, // Projeto inativo para teste
          status: "Concluído"
        }
      })
    ])

    console.log('Projetos criados:', projects)

  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 