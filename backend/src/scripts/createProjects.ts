import { prisma } from '../lib/prisma'

const projects = [
  {
    name: 'comunidade da paz',
    description: 'Projeto de construção civil',
    companyId: '5', // Consórcio BME
    status: 'Em Andamento',
    active: true
  },
  {
    name: 'comunidade freedom',
    description: 'Projeto de construção civil',
    companyId: '5', // Consórcio BME
    status: 'Em Andamento',
    active: true
  },
  {
    name: 'residencial altamira',
    description: 'Projeto de construção civil',
    companyId: '4', // Consórcio BCL
    status: 'Em Andamento',
    active: true
  }
]

async function createProjects() {
  try {
    console.log('Iniciando criação dos projetos...')

    for (const project of projects) {
      try {
        const newProject = await prisma.project.create({
          data: project
        })
        console.log(`Projeto "${project.name}" criado com sucesso:`, newProject)
      } catch (error) {
        console.error(`Erro ao criar projeto "${project.name}":`, error)
      }
    }

    console.log('Criação concluída com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createProjects() 