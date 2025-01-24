import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface Obra {
  id: number;
  nome: string;
  ativa: boolean;
}

export function Login() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [obraId, setObraId] = useState<number | ''>('');
  const [obras, setObras] = useState<Obra[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingObras, setLoadingObras] = useState(false);
  const [isFuncionario, setIsFuncionario] = useState(false);
  const [verificandoCargo, setVerificandoCargo] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function loadObras() {
      try {
        setLoadingObras(true);
        setError('');
        const response = await axios.get<Obra[]>('http://localhost:8080/obras');
        const obrasAtivas = response.data.filter(obra => obra.ativa);
        
        if (obrasAtivas.length === 0) {
          setError('Não há obras ativas disponíveis');
        } else {
          setObras(obrasAtivas);
        }
      } catch (error) {
        console.error('Erro ao carregar obras:', error);
        setError('Erro ao carregar obras disponíveis');
      } finally {
        setLoadingObras(false);
      }
    }

    loadObras();
  }, []);

  // Verifica se é funcionário ao digitar o CPF
  useEffect(() => {
    const verificarUsuario = async () => {
      const cpfLimpo = cpf.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        try {
          setVerificandoCargo(true);
          setError('');
          const response = await axios.get(`http://localhost:8080/usuarios/cargo/${cpfLimpo}`);
          setIsFuncionario(response.data.cargo === 'FUNCIONARIO');
        } catch (error) {
          console.error('Erro ao verificar cargo do usuário:', error);
          setError('CPF não encontrado');
        } finally {
          setVerificandoCargo(false);
        }
      }
    };

    verificarUsuario();
  }, [cpf]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // Validações básicas
    if (!cpf.trim()) {
      setError('CPF é obrigatório');
      return;
    }

    if (!senha.trim()) {
      setError('Senha é obrigatória');
      return;
    }

    // Remove caracteres não numéricos do CPF
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setError('CPF inválido');
      return;
    }

    // Valida seleção de obra para funcionários
    if (isFuncionario && !obraId) {
      setError('Selecione uma obra para continuar');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signIn({
        cpf: cpfLimpo,
        senha,
        obra_id: obraId ? Number(obraId) : undefined
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Controle de Horas Extras
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            autoFocus
            inputProps={{
              maxLength: 11,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            error={!!error && error.includes('CPF')}
            disabled={loading || verificandoCargo}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={!!error && error.includes('Senha')}
            disabled={loading || verificandoCargo}
          />

          {(isFuncionario || verificandoCargo) && (
            <FormControl fullWidth margin="normal" error={!!error && error.includes('obra')}>
              <InputLabel>Obra</InputLabel>
              <Select
                value={obraId}
                label="Obra"
                onChange={(e) => setObraId(e.target.value as number)}
                disabled={loadingObras || loading || verificandoCargo}
                required={isFuncionario}
              >
                {loadingObras || verificandoCargo ? (
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      {verificandoCargo ? 'Verificando usuário...' : 'Carregando obras...'}
                    </Box>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem value="">
                      <em>Selecione uma obra</em>
                    </MenuItem>
                    {obras.map((obra) => (
                      <MenuItem key={obra.id} value={obra.id}>
                        {obra.nome}
                      </MenuItem>
                    ))}
                  </>
                )}
              </Select>
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || loadingObras || verificandoCargo}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 