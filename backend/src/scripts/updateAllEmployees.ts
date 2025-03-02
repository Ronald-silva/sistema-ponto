import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function updateAllEmployees() {
  try {
    console.log('🔍 Buscando todos os funcionários...')
    
    const employees = await prisma.user.findMany({
      where: {
        NOT: {
          role: 'ADMIN'
        }
      }
    })

    console.log(`📊 Total de funcionários encontrados: ${employees.length}`)

    for (const employee of employees) {
      console.log(`\n🔄 Atualizando funcionário: ${employee.name}`)
      console.log(`   CPF: ${employee.cpf}`)
      
      // Definir cargo com base no nome
      let role = 'SERVENTE' // cargo padrão
      if (employee.name === 'mauro landin') role = 'SUPERVISOR_OBRA'
      if (employee.name === 'laura campos') role = 'ANALISTA_ADMINISTRATIVO_II'
      if (employee.name === 'malinda gomes') role = 'ASSISTENTE_ADM_V'
      if (employee.name === 'leandro matos') role = 'SUPERVISOR_ADM_II'

      // Gerar senha padrão e hash
      const password = '123456'
      const hashedPassword = await hash(password, 8)

      // Atualizar funcionário
      await prisma.user.update({
        where: { id: employee.id },
        data: {
          role,
          password: hashedPassword,
          active: true,
          email: `${employee.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
          birth_date: employee.birth_date || new Date('1990-01-01'),
          admission_date: employee.admission_date || new Date('2024-01-01')
        }
      })

      console.log(`   ✅ Atualizado com sucesso!`)
      console.log(`   📧 Email: ${employee.name.replace(/\s+/g, '.').toLowerCase()}@example.com`)
      console.log(`   🔑 Senha: ${password}`)
      console.log(`   👔 Cargo: ${role}`)
    }

    console.log('\n✅ Atualização concluída com sucesso!')
  } catch (error) {
    console.error('\n❌ Erro ao atualizar funcionários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAllEmployees() 