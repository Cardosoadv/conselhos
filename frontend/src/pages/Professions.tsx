import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Switch, FormControlLabel
} from '@mui/material';
import { getProfessions, createProfession, updateProfession, deleteProfession, type Profession } from '../services/professionService';

export default function Professions() {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Profession>({
    name: '',
    description: '',
    fundamento_legal: '',
    requisitos: '',
    atribuicoes: null,
    active: true
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getProfessions();
      setProfessions(data);
    } catch (error) {
      console.error('Erro ao buscar profissões', error);
      showSnackbar('Erro ao buscar profissões', 'error');
    }
  };

  const handleOpen = (profession?: Profession) => {
    if (profession) {
      setEditingId(profession.id!);
      setFormData(profession);
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', fundamento_legal: '', requisitos: '', atribuicoes: null, active: true });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId) {
        await updateProfession(editingId, formData);
        showSnackbar('Profissão atualizada com sucesso', 'success');
      } else {
        await createProfession(formData);
        showSnackbar('Profissão criada com sucesso', 'success');
      }
      setOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao salvar profissão', error);
      showSnackbar(error.response?.data?.error || 'Erro ao salvar profissão', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta profissão?')) {
      try {
        await deleteProfession(id);
        showSnackbar('Profissão excluída com sucesso', 'success');
        fetchData();
      } catch (error: any) {
        console.error('Erro ao excluir profissão', error);
        showSnackbar(error.response?.data?.error || 'Erro ao excluir profissão', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Profissões</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Nova Profissão
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Fundamento Legal</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professions.map((prof) => (
              <TableRow key={prof.id}>
                <TableCell>{prof.id}</TableCell>
                <TableCell>{prof.name}</TableCell>
                <TableCell>{prof.fundamento_legal}</TableCell>
                <TableCell>{prof.active ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleOpen(prof)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => prof.id && handleDelete(prof.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
            {professions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhuma profissão encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editar Profissão' : 'Nova Profissão'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nome" name="name" value={formData.name} onChange={handleInputChange} fullWidth required />
            <TextField label="Descrição" name="description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={3} />
            <TextField label="Fundamento Legal" name="fundamento_legal" value={formData.fundamento_legal} onChange={handleInputChange} fullWidth />
            <TextField label="Requisitos" name="requisitos" value={formData.requisitos} onChange={handleInputChange} fullWidth multiline rows={3} />
            <TextField label="Atribuições (ID)" name="atribuicoes" type="number" value={formData.atribuicoes || ''} onChange={handleInputChange} fullWidth />
            <FormControlLabel
              control={<Switch checked={formData.active} onChange={handleInputChange} name="active" />}
              label="Ativo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
