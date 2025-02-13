declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role: 'ADMIN' | 'EMPLOYEE'
      cpf?: string
      projectId?: string
      companyId?: string
    }
  }
}
