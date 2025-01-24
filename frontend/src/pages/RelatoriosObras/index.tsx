import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { api } from '../../services/api';

interface Obra {
  id: number;
  nome: string;
  ativa: boolean;
}

interface Metricas {
  totalHorasExtras: number;
  totalRegistrosPonto: number;
  mediaHorasExtrasPorDia: number;
  funcionariosAtivos: number;
  registrosPorDia: {
    data: string;
    total: number;
  }[];
}

export function RelatoriosObras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSelecionada, setObraSelecionada] = useState<number | ''>('');
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarObras = async () => {
    try {
      const response = await api.get<Obra[]>('/obras');
      setObras(response.data);
    } catch (err) {
      setError('Erro ao carregar obras');
      console.error(err);
    }
  };

  const carregarMetricas = async (obraId: number) => {
    try {
      setLoading(true);
      const response = await api.get<Metricas>(`/obras/${obraId}/metricas`);
      setMetricas(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar métricas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarObras();
  }, []);

  useEffect(() => {
    if (obraSelecionada) {
      carregarMetricas(obraSelecionada as number);
    }
  }, [obraSelecionada]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Relatórios e Métricas por Obra
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Selecione uma Obra</InputLabel>
          <Select
            value={obraSelecionada}
            onChange={(e) => setObraSelecionada(e.target.value as number)}
            label="Selecione uma Obra"
          >
            {obras.map((obra) => (
              <MenuItem key={obra.id} value={obra.id}>
                {obra.nome} {!obra.ativa && '(Inativa)'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : metricas && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total de Horas Extras
                </Typography>
                <Typography variant="h5">
                  {metricas.totalHorasExtras.toFixed(2)}h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Registros de Ponto
                </Typography>
                <Typography variant="h5">
                  {metricas.totalRegistrosPonto}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Média de Horas Extras/Dia
                </Typography>
                <Typography variant="h5">
                  {metricas.mediaHorasExtrasPorDia.toFixed(2)}h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Funcionários Ativos
                </Typography>
                <Typography variant="h5">
                  {metricas.funcionariosAtivos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Registros por Dia
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricas.registrosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#1976d2" name="Total de Registros" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell align="right">Total de Registros</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metricas.registrosPorDia.map((registro) => (
                    <TableRow key={registro.data}>
                      <TableCell>{registro.data}</TableCell>
                      <TableCell align="right">{registro.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Container>
  );
} 