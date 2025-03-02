import { createClient } from '@supabase/supabase-js'
import { prisma } from '../lib/prisma'

const supabase = createClient(
  'https://eyevyovjlxycqixkvxoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94'
)

// Mapeamento de empresas
const companyMap: { [key: string]: string } = {
  'CDG Engenharia': '1',
  'Urban Engenharia': '2',
  'Consórcio Aquiraz PDD': '3',
  'Consórcio BCL': '4',
  'Consórcio BME': '5',
  'Consórcio BBJ': '6'
}

async function migrateProjects() {
  try {
    console.log('Iniciando migração de obras do Supabase para o Neon...')

    // Busca todas as obras do Supabase
    const { data: supabaseProjects, error } = await supabase
      .from('projects')
      .select('*')

    if (error) {
      throw new Error(`Erro ao buscar obras do Supabase: ${error.message}`)
    }

    console.log(`\nEncontradas ${supabaseProjects.length} obras no Supabase`)
    console.log('Dados das obras:', JSON.stringify(supabaseProjects, null, 2))

    // Migra cada obra para o Neon
    for (const project of supabaseProjects) {
      try {
        const existingProject = await prisma.project.findFirst({
          where: { 
            name: project.name,
            companyId: companyMap[project.company] || '1'
          }
        })

        if (existingProject) {
          console.log(`Obra ${project.name} já existe no Neon. Pulando...`)
          continue
        }

        await prisma.project.create({
          data: {
            name: project.name,
            description: project.description || 'Projeto de construção civil',
            companyId: companyMap[project.company] || '1',
            active: project.active ?? true,
            status: project.status || 'Em Andamento'
          }
        })

        console.log(`Obra ${project.name} migrada com sucesso!`)

      } catch (projectError) {
        console.error(`Erro ao migrar obra ${project.name}:`, projectError)
      }
    }

    console.log('\nMigração concluída!')

  } catch (error) {
    console.error('Erro durante a migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateProjects() 