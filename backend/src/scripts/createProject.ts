import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createProject() {
  try {
    console.log('🚀 Iniciando criação do projeto...')

    const project = {
      name: 'Obra Teste',
      description: 'Projeto para teste de login',
      companyId: 'empresa-teste-1',
      category: 'CONSTRUCTION',
      location: 'São Paulo',
      start_date: new Date(),
      estimated_end_date: new Date('2025-12-31'),
      active: true,
      status: 'Em Andamento'
    }

    const existingProject = await prisma.project.findFirst({
      where: { 
        name: project.name,
        companyId: project.companyId
      }
    })

    if (existingProject) {
      console.log('⚠️ Projeto já existe. Atualizando...')
      await prisma.project.update({
        where: { id: existingProject.id },
        data: project
      })
      console.log('✅ Projeto atualizado com sucesso!')
    } else {
      console.log('✨ Criando novo projeto...')
      const newProject = await prisma.project.create({
        data: project
      })
      console.log('✅ Projeto criado com sucesso!')
      console.log('📝 ID do projeto:', newProject.id)
    }

  } catch (error) {
    console.error('❌ Erro ao criar projeto:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createProject() 