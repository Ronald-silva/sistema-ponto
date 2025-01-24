import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';
import { api } from '../../services/api';

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  senha?: string;
  cargo: string;
  obra_id?: number;
}

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  senha: yup.string().when('id', {
    is: (id: number) => !id,
    then: (schema) => schema.required('Senha é obrigatória'),
    otherwise: (schema) => schema,
  }),
  cargo: yup.string().required('Cargo é obrigatório'),
  obra_id: yup.number(),
});

const cargos = ['ADMIN', 'FUNCIONARIO'];

export function FormUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      loadUsuario();
    }
  }, [id]);

  const loadUsuario = async () => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      reset(response.data);
    } catch (err) {
      setError('Erro ao carregar usuário');
      navigate('/dashboard/usuarios');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (id) {
        await api.put(`/usuarios/${id}`, data);
      } else {
        await api.post('/usuarios', data);
      }
      navigate('/dashboard/usuarios');
    } catch (err) {
      setError('Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {id ? 'Editar Usuário' : 'Novo Usuário'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
        <TextField
          fullWidth
          label="Nome"
          margin="normal"
          {...register('nome')}
          error={!!errors.nome}
          helperText={errors.nome?.message}
        />

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          label="CPF"
          margin="normal"
          {...register('cpf')}
          error={!!errors.cpf}
          helperText={errors.cpf?.message}
        />

        {!id && (
          <TextField
            fullWidth
            label="Senha"
            type="password"
            margin="normal"
            {...register('senha')}
            error={!!errors.senha}
            helperText={errors.senha?.message}
          />
        )}

        <TextField
          fullWidth
          select
          label="Cargo"
          margin="normal"
          {...register('cargo')}
          error={!!errors.cargo}
          helperText={errors.cargo?.message}
        >
          {cargos.map((cargo) => (
            <MenuItem key={cargo} value={cargo}>
              {cargo}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/usuarios')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 