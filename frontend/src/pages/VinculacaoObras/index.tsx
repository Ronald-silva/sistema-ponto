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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import { api } from '../../services/api';

interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  obras: Obra[];
}

interface Obra {
  id: number;
  nome: string;
  ativa: boolean;
}

export function VinculacaoObras() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selectedObra, setSelectedObra] = useState<number | ''>('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [usuariosResponse, obrasResponse] = await Promise.all([
        api.get<Usuario[]>('/usuarios'),
        api.get<Obra[]>('/obras')
      ]);

      setUsuarios(usuariosResponse.data);
      setObras(obrasResponse.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleOpenDialog = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setSelectedObra('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedObra('');
  };

  const handleVincular = async () => {
    if (!selectedUser || !selectedObra) return;

    try {
      await api.post(`/obras/${selectedObra}/vincular`, {
        userId: selectedUser.id
      });
      await carregarDados();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao vincular usuário à obra');
      console.error(err);
    }
  };

  const handleDesvincular = async (userId: number, obraId: number) => {
    try {
      await api.delete(`/obras/${obraId}/desvincular/${userId}`);
      await carregarDados();
    } catch (err) {
      setError('Erro ao desvincular usuário da obra');
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
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Vinculação de Funcionários às Obras
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Obras Vinculadas</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.cpf}</TableCell>
                <TableCell>{usuario.cargo}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {usuario.obras.map((obra) => (
                      <Chip
                        key={obra.id}
                        label={obra.nome}
                        onDelete={() => handleDesvincular(usuario.id, obra.id)}
                        color={obra.ativa ? 'primary' : 'default'}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(usuario)}
                  >
                    Vincular Obra
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Vincular {selectedUser?.nome} a uma Obra
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Obra</InputLabel>
            <Select
              value={selectedObra}
              onChange={(e) => setSelectedObra(e.target.value as number)}
              label="Obra"
            >
              {obras
                .filter((obra) => obra.ativa)
                .filter((obra) => !selectedUser?.obras.some(u => u.id === obra.id))
                .map((obra) => (
                  <MenuItem key={obra.id} value={obra.id}>
                    {obra.nome}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleVincular}
            variant="contained"
            color="primary"
            disabled={!selectedObra}
          >
            Vincular
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 