import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyevyovjlxycqixkvxoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      process.exit(1);
    }

    console.log('Usuários encontrados:', users);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

main();
