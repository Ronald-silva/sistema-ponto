import { prisma } from '../lib/prisma'

async function associateEmployeeToProject() {
  try {
    console.log('Associando funcionário ao projeto...')

    // Buscar o funcionário pelo CPF
    const employee = await prisma.user.findUnique({
      where: {
        cpf: '55555555555'
      }
    })

    if (!employee) {
      throw new Error('Funcionário não encontrado')
    }

    // Buscar o projeto ativo
    const project = await prisma.project.findFirst({
      where: {
        active: true,
        companyId: '2' // Urban Engenharia
      }
    })

    if (!project) {
      throw new Error('Projeto não encontrado')
    }

    // Verificar se já existe a associação
    const existingAssociation = await prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: employee.id,
          projectId: project.id
        }
      }
    })

    if (existingAssociation) {
      console.log('Funcionário já está associado ao projeto')
      return
    }

    // Criar a associação
    await prisma.userProject.create({
      data: {
        userId: employee.id,
        projectId: project.id
      }
    })

    console.log(`Funcionário ${employee.name} associado ao projeto ${project.name}`)

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

associateEmployeeToProject() 