export function adminAuthMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  if (!req.usuario.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  
  next()
} 