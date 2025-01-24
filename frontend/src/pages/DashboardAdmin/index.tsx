import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../services/api';

interface Metrica {
  totalUsuarios: number;
  totalHorasExtras: number;
  horasExtrasPendentes: number;
  registrosHoje: number;
}

interface RegistroPonto {
  id: number;
  usuarioId: number;
  usuario: {
    nome: string;
  };
  data: string;
  tipo: string;
}

interface HoraExtra {
  id: number;
  usuarioId: number;
  usuario: {
    nome: string;
  };
  data: string;
  quantidade: number;
  status: string;
}

export function DashboardAdmin() {
  const [metricas, setMetricas] = useState<Metrica>({
    totalUsuarios: 0,
    totalHorasExtras: 0,
    horasExtrasPendentes: 0,
    registrosHoje: 0,
  });
  const [ultimosRegistros, setUltimosRegistros] = useState<RegistroPonto[]>([]);
  const [horasExtrasPendentes, setHorasExtrasPendentes] = useState<HoraExtra[]>([]);

  useEffect(() => {
    loadMetricas();
    loadUltimosRegistros();
    loadHorasExtrasPendentes();
  }, []);

  const loadMetricas = async () => {
    try {
      const response = await api.get('/metricas');
      setMetricas(response.data);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  };

  const loadUltimosRegistros = async () => {
    try {
      const response = await api.get('/registros/ultimos');
      setUltimosRegistros(response.data);
    } catch (error) {
      console.error('Erro ao carregar últimos registros:', error);
    }
  };

  const loadHorasExtrasPendentes = async () => {
    try {
      const response = await api.get('/horas-extras/pendentes');
      setHorasExtrasPendentes(response.data);
    } catch (error) {
      console.error('Erro ao carregar horas extras pendentes:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Administrativo
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{metricas.totalUsuarios}</Typography>
              <Typography color="textSecondary">Total de Funcionários</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{metricas.registrosHoje}</Typography>
              <Typography color="textSecondary">Registros Hoje</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimerIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{metricas.totalHorasExtras}h</Typography>
              <Typography color="textSecondary">Total Horas Extras</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{metricas.horasExtrasPendentes}</Typography>
              <Typography color="textSecondary">Horas Extras Pendentes</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Últimos Registros de Ponto
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Funcionário</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Tipo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ultimosRegistros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{registro.usuario.nome}</TableCell>
                    <TableCell>
                      {format(new Date(registro.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(registro.data), 'HH:mm:ss', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{registro.tipo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Horas Extras Pendentes
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Funcionário</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {horasExtrasPendentes.map((horaExtra) => (
                  <TableRow key={horaExtra.id}>
                    <TableCell>{horaExtra.usuario.nome}</TableCell>
                    <TableCell>
                      {format(new Date(horaExtra.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{horaExtra.quantidade}h</TableCell>
                    <TableCell>{horaExtra.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
} 