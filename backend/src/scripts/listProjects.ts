import { prisma } from '../lib/prisma'

async function listProjects() {
  try {
    console.log('Buscando projetos ativos...')

    const projects = await prisma.project.findMany({
      where: {
        active: true
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    })

    console.log('\nTotal de projetos:', projects.length)
    console.log('\nProjetos encontrados:')
    projects.forEach(project => {
      console.log('\n-------------------')
      console.log(`Nome: ${project.name}`)
      console.log(`Empresa ID: ${project.companyId}`)
      console.log(`Status: ${project.status}`)
      console.log(`Ativo: ${project.active}`)
      if (project.users.length > 0) {
        console.log('Funcionários:')
        project.users.forEach(up => {
          console.log(`  - ${up.user.name} (${up.user.cpf})`)
        })
      }
    })

  } catch (error) {
    console.error('Erro ao listar projetos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listProjects() 