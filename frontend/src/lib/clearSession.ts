import { supabase } from './supabase'

export async function clearSession() {
  // Limpar localStorage
  localStorage.removeItem('@sistema-ponto:user')
  
  // Limpar sessão do Supabase
  await supabase.auth.signOut()
}
