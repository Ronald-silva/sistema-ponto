import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { api } from '../../services/api';

interface Obra {
  id: number;
  nome: string;
  endereco: string;
  ativa: boolean;
  createdAt: string;
}

interface NovaObra {
  nome: string;
  endereco: string;
}

export function GerenciamentoObras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [obraEmEdicao, setObraEmEdicao] = useState<Obra | null>(null);
  const [novaObra, setNovaObra] = useState<NovaObra>({ nome: '', endereco: '' });

  const carregarObras = async () => {
    try {
      setLoading(true);
      const response = await api.get<Obra[]>('/obras');
      setObras(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar obras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarObras();
  }, []);

  const handleOpenDialog = (obra?: Obra) => {
    if (obra) {
      setObraEmEdicao(obra);
      setNovaObra({ nome: obra.nome, endereco: obra.endereco });
    } else {
      setObraEmEdicao(null);
      setNovaObra({ nome: '', endereco: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setObraEmEdicao(null);
    setNovaObra({ nome: '', endereco: '' });
  };

  const handleSubmit = async () => {
    try {
      if (obraEmEdicao) {
        await api.put(`/obras/${obraEmEdicao.id}`, novaObra);
      } else {
        await api.post('/obras', novaObra);
      }
      await carregarObras();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar obra');
      console.error(err);
    }
  };

  const handleToggleStatus = async (obra: Obra) => {
    try {
      await api.put(`/obras/${obra.id}`, { ativa: !obra.ativa });
      await carregarObras();
    } catch (err) {
      setError('Erro ao alterar status da obra');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gerenciamento de Obras
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Obra
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.map((obra) => (
              <TableRow key={obra.id}>
                <TableCell>{obra.nome}</TableCell>
                <TableCell>{obra.endereco}</TableCell>
                <TableCell>
                  <Chip
                    label={obra.ativa ? 'Ativa' : 'Inativa'}
                    color={obra.ativa ? 'success' : 'default'}
                    onClick={() => handleToggleStatus(obra)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(obra.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(obra)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {obraEmEdicao ? 'Editar Obra' : 'Nova Obra'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Obra"
            fullWidth
            value={novaObra.nome}
            onChange={(e) => setNovaObra({ ...novaObra, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Endereço"
            fullWidth
            value={novaObra.endereco}
            onChange={(e) => setNovaObra({ ...novaObra, endereco: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 