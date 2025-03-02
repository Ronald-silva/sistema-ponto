import { prisma } from '../lib/prisma'

async function createTestEmployee() {
  try {
    console.log('Criando funcionário de teste...')

    const testEmployee = await prisma.user.create({
      data: {
        name: 'Funcionário Teste',
        email: 'funcionario@teste.com',
        password: '$2a$08$Gu4HRX5BaQYJ.q4vD5ybpuB0BxKQFD4H7LTEDQaYzGqeR7o.V5Eni', // senha: 123456
        cpf: '55555555555',
        role: 'EMPLOYEE',
        salary: 2000,
        birth_date: new Date('1990-01-01'),
        admission_date: new Date('2024-01-01'),
        active: true
      }
    })

    console.log('Funcionário criado:', testEmployee)

    // Associar o funcionário ao projeto
    const project = await prisma.project.findFirst({
      where: {
        active: true
      }
    })

    if (project) {
      await prisma.userProject.create({
        data: {
          userId: testEmployee.id,
          projectId: project.id
        }
      })

      console.log('Funcionário associado ao projeto:', project.name)
    }

  } catch (error) {
    console.error('Erro ao criar funcionário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestEmployee() 