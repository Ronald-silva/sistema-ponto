import { prisma } from '../lib/prisma'

async function listUsers() {
  try {
    console.log('Buscando usuários cadastrados...')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        active: true,
        salary: true,
        birth_date: true,
        admission_date: true,
        userProjects: {
          include: {
            project: true
          }
        }
      }
    })

    console.log('\nTotal de usuários:', users.length)
    console.log('\nUsuários encontrados:')
    users.forEach(user => {
      console.log('\n-------------------')
      console.log(`Nome: ${user.name}`)
      console.log(`CPF: ${user.cpf}`)
      console.log(`Email: ${user.email}`)
      console.log(`Cargo: ${user.role}`)
      console.log(`Ativo: ${user.active}`)
      console.log(`Salário: R$ ${user.salary}`)
      console.log(`Data de Nascimento: ${user.birth_date.toLocaleDateString('pt-BR')}`)
      console.log(`Data de Admissão: ${user.admission_date.toLocaleDateString('pt-BR')}`)
      if (user.userProjects.length > 0) {
        console.log('Projetos:')
        user.userProjects.forEach(up => {
          console.log(`  - ${up.project.name}`)
        })
      }
    })

  } catch (error) {
    console.error('Erro ao listar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers() 