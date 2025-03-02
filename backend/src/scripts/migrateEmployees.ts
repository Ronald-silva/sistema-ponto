import { createClient } from '@supabase/supabase-js'
import { prisma } from '../lib/prisma'

const supabase = createClient(
  'https://eyevyovjlxycqixkvxoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94'
)

async function migrateEmployees() {
  try {
    console.log('Iniciando migração de funcionários do Supabase para o Neon...')

    // Busca todos os usuários do Supabase
    const { data: supabaseUsers, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      throw new Error(`Erro ao buscar usuários do Supabase: ${error.message}`)
    }

    console.log(`\nEncontrados ${supabaseUsers.length} usuários no Supabase`)

    // Migra cada usuário para o Neon
    for (const user of supabaseUsers) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { cpf: user.cpf }
        })

        if (existingUser) {
          console.log(`Usuário ${user.name} (CPF: ${user.cpf}) já existe no Neon. Pulando...`)
          continue
        }

        // Define o papel do usuário (ADMIN para administradores, EMPLOYEE para os demais)
        const role = user.role.toLowerCase().includes('admin') ? 'ADMIN' : 'EMPLOYEE'

        await prisma.user.create({
          data: {
            name: user.name,
            cpf: user.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos do CPF
            role,
            active: user.active ?? true,
            salary: user.salary ?? 0,
            birth_date: user.birth_date ? new Date(user.birth_date) : new Date(),
            admission_date: user.admission_date ? new Date(user.admission_date) : new Date(),
            email: user.email ?? `${user.cpf.replace(/\D/g, '')}@example.com`,
            password: '$2a$08$Gu4HRX5BaQYJ.q4vD5ybpuB0BxKQFD4H7LTEDQaYzGqeR7o.V5Eni' // senha padrão: 123456
          }
        })

        console.log(`Usuário ${user.name} migrado com sucesso!`)

      } catch (userError) {
        console.error(`Erro ao migrar usuário ${user.name}:`, userError)
      }
    }

    console.log('\nMigração concluída!')

  } catch (error) {
    console.error('Erro durante a migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateEmployees() 