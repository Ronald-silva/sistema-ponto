import { createClient } from '@supabase/supabase-js';

// Usar as variáveis diretamente
const supabaseUrl = 'https://eyevyovjlxycqixkvxoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Primeiro, vamos verificar os valores permitidos
    const { data: roles, error: rolesError } = await supabase
      .from('users')
      .select('role')
      .limit(1);

    console.log('Roles existentes:', roles);

    // Criar usuário admin
    const adminData = {
      name: 'Administrador',
      cpf: '222.222.222-22',
      role: 'SUPERVISOR ADM II',
      salary: '15000',
      birth_date: '1990-01-01',
      admission_date: '2024-01-01'
    };

    console.log('Tentando criar admin com:', adminData);

    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert([adminData])
      .select()
      .single();

    if (adminError) {
      console.error('Erro ao criar admin:', adminError);
      throw adminError;
    }
    console.log('Admin criado:', admin);

    // Criar usuário normal
    const userData = {
      name: 'José da Silva',
      cpf: '333.333.333-33',
      role: 'SERVICOS GERAIS I',
      salary: '3000',
      birth_date: '1995-01-01',
      admission_date: '2024-01-01'
    };

    console.log('Tentando criar usuário com:', userData);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (userError) {
      console.error('Erro ao criar usuário:', userError);
      throw userError;
    }
    console.log('Usuário criado:', user);

    console.log('\nUsuários criados com sucesso!');

  } catch (error) {
    console.error('Erro ao criar usuários:', error);
    process.exit(1);
  }
}

main();
