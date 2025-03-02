import { prisma } from '../lib/prisma'

const employeeRoles = {
  'laura campos': 'ANALISTA_ADMINISTRATIVO_II',
  'leandro matos': 'SUPERVISOR_ADM_II',
  'mauro landin': 'SUPERVISOR_OBRA',
  'lauro maia': 'ENCARREGADO_OBRAS',
  'JOSE RONALD DA SILVA': 'PEDREIRO',
  'Renato Azevedo': 'ENGENHEIRO_CIVIL',
  'luisa marques': 'ASSISTENTE_ADM_V'
}

async function updateEmployeeRoles() {
  try {
    console.log('🔍 Buscando funcionários...')
    
    const employees = await prisma.user.findMany({
      where: {
        NOT: {
          role: 'ADMIN'
        }
      }
    })

    console.log(`\n📊 Total de funcionários encontrados: ${employees.length}`)

    for (const employee of employees) {
      const newRole = employeeRoles[employee.name] || 'SERVENTE'
      
      console.log(`\n🔄 Atualizando funcionário: ${employee.name}`)
      console.log(`   CPF: ${employee.cpf}`)
      console.log(`   Cargo atual: ${employee.role}`)
      console.log(`   Novo cargo: ${newRole}`)

      await prisma.user.update({
        where: { id: employee.id },
        data: { role: newRole }
      })
    }

    console.log('\n✅ Atualização concluída!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('\n❌ Erro ao atualizar funcionários:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

updateEmployeeRoles() 