import jwt from 'jsonwebtoken'

const JWT_SECRET = "seu-segredo-jwt-super-secreto-e-seguro-123"

console.log('=== TESTE JWT ===')
console.log('Secret:', JWT_SECRET)

const payload = {
  sub: 'd504a949-b481-40be-a675-1528388986aa',
  role: 'ADMIN'
}

try {
  // Gerar token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  console.log('\nToken gerado:', token)

  // Verificar token
  const decoded = jwt.verify(token, JWT_SECRET)
  console.log('\nToken decodificado:', decoded)

  console.log('\nTeste concluído com sucesso!')
} catch (error) {
  console.error('\nErro no teste:', error)
} 