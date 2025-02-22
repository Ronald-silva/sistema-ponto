const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
})

// Função para testar login de admin
async function testAdminLogin() {
  try {
    console.log('🔄 Tentando login como admin...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    })

    if (error) throw error

    console.log('✅ Admin login successful!')
    console.log('Access Token:', data.session.access_token.substring(0, 20) + '...')
    return data
  } catch (error) {
    console.error('❌ Admin login failed:', error.message)
    return null
  }
}

// Função para testar login de funcionário
async function testEmployeeLogin() {
  try {
    console.log('🔄 Tentando login como funcionário...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: '123.456.789-00@employee.com',
      password: '123.456.789-00'
    })

    if (error) throw error

    console.log('✅ Employee login successful!')
    console.log('Access Token:', data.session.access_token.substring(0, 20) + '...')
    return data
  } catch (error) {
    console.error('❌ Employee login failed:', error.message)
    return null
  }
}

// Função para verificar os dados do usuário
async function getUserData(session) {
  if (!session) return null

  try {
    console.log('🔄 Buscando dados do usuário...')
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) throw error

    console.log('✅ User profile:', profile)
    return profile
  } catch (error) {
    console.error('❌ Error fetching user profile:', error.message)
    return null
  }
}

// Executar os testes
async function runTests() {
  console.log('\n🔑 Testing Admin Login...')
  const adminSession = await testAdminLogin()
  if (adminSession) {
    await getUserData(adminSession.session)
  }

  console.log('\n🔑 Testing Employee Login...')
  const employeeSession = await testEmployeeLogin()
  if (employeeSession) {
    await getUserData(employeeSession.session)
  }
}

// Executar os testes e tratar erros não capturados
runTests().catch(error => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
