import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function testEmployeeRegistration() {
  try {
    console.log('🚀 Iniciando teste de cadastro de funcionário...')

    const novoFuncionario = {
      name: 'José Teste',
      cpf: '12345678901',
      role: 'SERVENTE',
      salary: 3000.00,
      birth_date: new Date('1990-01-01'),
      admission_date: new Date(),
      password: await bcrypt.hash('123456', 10),
      active: true
    }

    // Verifica se já existe um funcionário com este CPF
    const funcionarioExistente = await prisma.user.findUnique({
      where: { cpf: novoFuncionario.cpf }
    })

    if (funcionarioExistente) {
      console.log('⚠️ CPF já cadastrado. Tentando outro CPF...')
      novoFuncionario.cpf = '98765432101'
    }

    // Tenta criar o funcionário
    const funcionarioCriado = await prisma.user.create({
      data: novoFuncionario,
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        salary: true,
        birth_date: true,
        admission_date: true,
        active: true
      }
    })

    console.log('✅ Funcionário cadastrado com sucesso!')
    console.log('📝 Dados do funcionário:')
    console.log(JSON.stringify(funcionarioCriado, null, 2))

  } catch (error) {
    console.error('❌ Erro ao cadastrar funcionário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEmployeeRegistration() 