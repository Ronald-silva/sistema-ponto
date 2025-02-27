export const auth = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: '1d'
  }
}; 