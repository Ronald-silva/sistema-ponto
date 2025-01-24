import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface HoraExtra {
  id: number;
  data: string;
  quantidade: number;
  valor_hora: number;
  percentual: number;
  valor_total: number;
  status: string;
  motivo_rejeicao?: string;
  usuario: {
    nome: string;
    cargo: string;
  };
}

export function HorasExtras() {
  const { user } = useAuth();
  const [horasExtras, setHorasExtras] = useState<HoraExtra[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('PENDENTE');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [horaExtraSelecionada, setHoraExtraSelecionada] = useState<HoraExtra | null>(null);

  useEffect(() => {
    loadHorasExtras();
  }, [filtroStatus]);

  const loadHorasExtras = async () => {
    try {
      setLoading(true);
      const response = await api.get('/horas-extras', {
        params: {
          status: filtroStatus,
          ...(user?.cargo !== 'ADMIN' && { usuario_id: user?.id })
        }
      });
      setHorasExtras(response.data);
    } catch (error) {
      setError('Erro ao carregar horas extras');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await api.post(`/horas-extras/${id}/aprovar`);
      setSuccess('Hora extra aprovada com sucesso');
      loadHorasExtras();
    } catch (error) {
      setError('Erro ao aprovar hora extra');
    }
  };

  const handleRejeitar = async () => {
    if (!horaExtraSelecionada) return;

    try {
      await api.post(`/horas-extras/${horaExtraSelecionada.id}/rejeitar`, {
        motivo_rejeicao: motivoRejeicao
      });
      setSuccess('Hora extra rejeitada com sucesso');
      setDialogOpen(false);
      setMotivoRejeicao('');
      setHoraExtraSelecionada(null);
      loadHorasExtras();
    } catch (error) {
      setError('Erro ao rejeitar hora extra');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'success';
      case 'REJEITADA':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Horas Extras</Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filtroStatus}
            label="Status"
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <MenuItem value="PENDENTE">Pendentes</MenuItem>
            <MenuItem value="APROVADA">Aprovadas</MenuItem>
            <MenuItem value="REJEITADA">Rejeitadas</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Funcionário</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Quantidade (h)</TableCell>
              <TableCell>Valor/Hora</TableCell>
              <TableCell>Percentual</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {horasExtras.map((horaExtra) => (
              <TableRow key={horaExtra.id}>
                <TableCell>{horaExtra.usuario.nome}</TableCell>
                <TableCell>
                  {format(new Date(horaExtra.data), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{horaExtra.quantidade.toFixed(2)}</TableCell>
                <TableCell>
                  {horaExtra.valor_hora.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </TableCell>
                <TableCell>{horaExtra.percentual}%</TableCell>
                <TableCell>
                  {horaExtra.valor_total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={horaExtra.status}
                    color={getStatusColor(horaExtra.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {user?.cargo === 'ADMIN' && horaExtra.status === 'PENDENTE' && (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleAprovar(horaExtra.id)}
                        title="Aprovar"
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setHoraExtraSelecionada(horaExtra);
                          setDialogOpen(true);
                        }}
                        title="Rejeitar"
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setHoraExtraSelecionada(horaExtra);
                      setDialogOpen(true);
                    }}
                    title="Visualizar Detalhes"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {horaExtraSelecionada?.status === 'PENDENTE'
            ? 'Rejeitar Hora Extra'
            : 'Detalhes da Hora Extra'}
        </DialogTitle>
        <DialogContent>
          {horaExtraSelecionada?.status === 'PENDENTE' ? (
            <TextField
              autoFocus
              margin="dense"
              label="Motivo da Rejeição"
              fullWidth
              multiline
              rows={4}
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
            />
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Status:</strong>{' '}
                <Chip
                  label={horaExtraSelecionada?.status}
                  color={getStatusColor(horaExtraSelecionada?.status || '')}
                  size="small"
                />
              </Typography>
              {horaExtraSelecionada?.motivo_rejeicao && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Motivo da Rejeição:</strong>
                  <br />
                  {horaExtraSelecionada.motivo_rejeicao}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {horaExtraSelecionada?.status === 'PENDENTE' ? 'Cancelar' : 'Fechar'}
          </Button>
          {horaExtraSelecionada?.status === 'PENDENTE' && (
            <Button onClick={handleRejeitar} color="error" variant="contained">
              Rejeitar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
} 