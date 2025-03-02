import { prisma } from '../lib/prisma'

async function updateProjects() {
  try {
    console.log('Atualizando projetos...')

    // Atualizar todos os projetos ativos para terem companyId
    const projects = await prisma.project.findMany({
      where: {
        active: true
      }
    })

    for (const project of projects) {
      await prisma.project.update({
        where: {
          id: project.id
        },
        data: {
          companyId: '2' // Urban Engenharia
        }
      })
      console.log(`Projeto ${project.name} atualizado com companyId = 2`)
    }

    console.log('\nAtualização concluída!')

  } catch (error) {
    console.error('Erro ao atualizar projetos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProjects() 