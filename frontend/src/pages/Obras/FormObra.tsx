import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
} from '@mui/material';
import { api } from '../../services/api';
import * as yup from 'yup';

interface FormData {
  nome: string;
  endereco: string;
  ativa: boolean;
}

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  endereco: yup.string().required('Endereço é obrigatório'),
});

export function FormObra() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    endereco: '',
    ativa: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadObra();
    }
  }, [id]);

  async function loadObra() {
    try {
      const response = await api.get(`/obras/${id}`);
      setFormData({
        nome: response.data.nome,
        endereco: response.data.endereco,
        ativa: response.data.ativa,
      });
    } catch (err) {
      setError('Erro ao carregar obra');
      navigate('/obras');
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await schema.validate(formData);

      if (id) {
        await api.put(`/obras/${id}`, formData);
      } else {
        await api.post('/obras', formData);
      }

      navigate('/obras');
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setError(err.message);
      } else {
        setError('Erro ao salvar obra');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {id ? 'Editar Obra' : 'Nova Obra'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativa}
                    onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                  />
                }
                label="Obra Ativa"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/obras')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
} 