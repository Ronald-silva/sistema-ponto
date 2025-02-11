import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'
import { AuthContext } from '../contexts/AuthContext'

// Mock do useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

// Mock do contexto de autenticação
const mockAuthContext = {
  signIn: vi.fn(),
  user: null,
  loading: false,
}

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <Login />
    </AuthContext.Provider>
  )
}

describe('Login Component', () => {
  it('deve renderizar corretamente', () => {
    renderLogin()
    expect(screen.getByText('Sistema de Ponto')).toBeInTheDocument()
    expect(screen.getByText('Funcionário')).toBeInTheDocument()
    expect(screen.getByText('Administrador')).toBeInTheDocument()
  })

  it('deve mostrar campos de CPF e obras para funcionário', async () => {
    renderLogin()
    
    // Clica no botão de funcionário
    const funcionarioButton = screen.getByText('Funcionário').closest('button')
    expect(funcionarioButton).toBeInTheDocument()
    if (funcionarioButton) {
      await userEvent.click(funcionarioButton)
    }

    // Verifica se os campos corretos são exibidos
    expect(screen.getByLabelText('CPF')).toBeInTheDocument()
    expect(screen.getByLabelText('Obras')).toBeInTheDocument()
    
    // Verifica se as opções de obras estão presentes
    expect(screen.getByText('Obra Residencial Vila Verde')).toBeInTheDocument()
    expect(screen.getByText('Obra Comercial Centro Empresarial')).toBeInTheDocument()
    expect(screen.getByText('Obra Industrial Parque Fabril')).toBeInTheDocument()
  })

  it('deve mostrar campo de senha para administrador', async () => {
    renderLogin()
    
    // Clica no botão de administrador
    const adminButton = screen.getByText('Administrador').closest('button')
    expect(adminButton).toBeInTheDocument()
    if (adminButton) {
      await userEvent.click(adminButton)
    }

    // Verifica se o campo de senha é exibido
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('deve formatar o CPF corretamente', async () => {
    renderLogin()
    
    // Seleciona tipo funcionário
    const funcionarioButton = screen.getByText('Funcionário').closest('button')
    if (funcionarioButton) {
      await userEvent.click(funcionarioButton)
    }

    // Digite um CPF sem formatação
    const cpfInput = screen.getByLabelText('CPF')
    await userEvent.type(cpfInput, '12345678900')

    // Verifica se o CPF foi formatado
    expect(cpfInput).toHaveValue('123.456.789-00')
  })

  it('deve chamar signIn ao submeter o formulário de administrador', async () => {
    renderLogin()
    
    // Seleciona tipo administrador
    const adminButton = screen.getByText('Administrador').closest('button')
    if (adminButton) {
      await userEvent.click(adminButton)
    }

    // Preenche a senha
    const senhaInput = screen.getByLabelText('Senha')
    await userEvent.type(senhaInput, 'senha123')

    // Submete o formulário
    const submitButton = screen.getByText('Entrar')
    await userEvent.click(submitButton)

    // Verifica se signIn foi chamado com os parâmetros corretos
    expect(mockAuthContext.signIn).toHaveBeenCalledWith({
      userType: 'ADMIN',
      password: 'senha123',
    })
  })

  it('deve chamar signIn ao submeter o formulário de funcionário', async () => {
    renderLogin()
    
    // Seleciona tipo funcionário
    const funcionarioButton = screen.getByText('Funcionário').closest('button')
    if (funcionarioButton) {
      await userEvent.click(funcionarioButton)
    }

    // Preenche o CPF
    const cpfInput = screen.getByLabelText('CPF')
    await userEvent.type(cpfInput, '12345678900')

    // Seleciona uma obra
    const obraSelect = screen.getByLabelText('Obras')
    await userEvent.selectOptions(obraSelect, '1') // Seleciona a primeira obra

    // Submete o formulário
    const submitButton = screen.getByText('Entrar')
    await userEvent.click(submitButton)

    // Verifica se signIn foi chamado com os parâmetros corretos
    expect(mockAuthContext.signIn).toHaveBeenCalledWith({
      userType: 'EMPLOYEE',
      cpf: '123.456.789-00',
      projectId: '1',
    })
  })
})
