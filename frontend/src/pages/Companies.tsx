import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
  MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCompanies, createCompany, updateCompany, deleteCompany, type Company, type CompanyProfessional } from '../services/companyService';
import { getProfessionals, type Professional } from '../services/professionalService';
import { getSettings } from '../services/settingsService';
import { validateCNPJ } from '../utils/cnpjValidator';

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [professionalsList, setProfessionalsList] = useState<Professional[]>([]);
  const [linkTypes, setLinkTypes] = useState<string[]>(['Responsável Técnico']);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState<Company>({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    professionals: []
  });

  // Current professional assignment being configured in the form
  const [selectedProfId, setSelectedProfId] = useState<number | ''>('');
  const [selectedLinkType, setSelectedLinkType] = useState<string>('Responsável Técnico');

  // Error states
  const [cnpjError, setCnpjError] = useState('');
  const [professionalsError, setProfessionalsError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [comps, profs, settingsData] = await Promise.all([
        getCompanies(),
        getProfessionals(),
        getSettings()
      ]);
      setCompanies(comps);
      setProfessionalsList(profs);

      if (settingsData && settingsData.tipos_vinculo) {
        const parsed = settingsData.tipos_vinculo
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
        if (parsed.length > 0) {
          setLinkTypes(parsed);
          setSelectedLinkType(parsed[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showSnackbar('Erro ao carregar dados do sistema', 'error');
    }
  };

  const handleOpen = (company?: Company) => {
    setCnpjError('');
    setProfessionalsError('');
    setSelectedProfId('');
    if (linkTypes.length > 0) {
      setSelectedLinkType(linkTypes[0]);
    } else {
      setSelectedLinkType('Responsável Técnico');
    }

    if (company) {
      setEditingId(company.id!);
      setFormData({
        razao_social: company.razao_social || '',
        nome_fantasia: company.nome_fantasia || '',
        cnpj: company.cnpj || '',
        email: company.email || '',
        phone: company.phone || '',
        cep: company.cep || '',
        street: company.street || '',
        number: company.number || '',
        complement: company.complement || '',
        neighborhood: company.neighborhood || '',
        city: company.city || '',
        state: company.state || '',
        professionals: company.professionals || []
      });
    } else {
      setEditingId(null);
      setFormData({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        email: '',
        phone: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        professionals: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'cnpj') {
      setCnpjError('');
    }
  };

  const handleAddProfessional = () => {
    if (selectedProfId === '') return;

    // Check if professional is already added
    const alreadyLinked = formData.professionals?.some((p: CompanyProfessional) => p.professional_id === selectedProfId);
    if (alreadyLinked) {
      showSnackbar('Este profissional já está vinculado a esta empresa.', 'error');
      return;
    }

    const matchedProf = professionalsList.find((p: Professional) => p.id === selectedProfId);
    if (!matchedProf) return;

    const newLink: CompanyProfessional = {
      professional_id: selectedProfId,
      vinculo_type: selectedLinkType,
      name: matchedProf.name,
      cpf: matchedProf.cpf
    };

    setFormData({
      ...formData,
      professionals: [...(formData.professionals || []), newLink]
    });
    setProfessionalsError('');
    setSelectedProfId('');
  };

  const handleRemoveProfessional = (profId: number) => {
    setFormData({
      ...formData,
      professionals: (formData.professionals || []).filter((p: CompanyProfessional) => p.professional_id !== profId)
    });
  };

  const handleSave = async () => {
    // 1. Validation
    let valid = true;

    if (!formData.razao_social.trim()) {
      showSnackbar('Razão Social é obrigatória', 'error');
      valid = false;
      return;
    }
    if (!formData.nome_fantasia.trim()) {
      showSnackbar('Nome Fantasia é obrigatório', 'error');
      valid = false;
      return;
    }

    if (!formData.cnpj.trim()) {
      setCnpjError('CNPJ é obrigatório');
      valid = false;
      return;
    } else if (!validateCNPJ(formData.cnpj)) {
      setCnpjError('CNPJ inválido');
      valid = false;
      return;
    }

    if (!formData.professionals || formData.professionals.length === 0) {
      setProfessionalsError('A empresa precisa de pelo menos um profissional vinculado.');
      valid = false;
      return;
    }

    if (!valid) return;

    setLoading(true);
    try {
      if (editingId) {
        await updateCompany(editingId, formData);
        showSnackbar('Empresa atualizada com sucesso', 'success');
      } else {
        await createCompany(formData);
        showSnackbar('Empresa criada com sucesso', 'success');
      }
      setOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao salvar empresa', error);
      showSnackbar(error.response?.data?.error || 'Erro ao salvar empresa', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComp = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await deleteCompany(id);
        showSnackbar('Empresa excluída com sucesso', 'success');
        fetchData();
      } catch (error: any) {
        console.error('Erro ao excluir empresa', error);
        showSnackbar(error.response?.data?.error || 'Erro ao excluir empresa', 'error');
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
        <Typography variant="h4">Empresas</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Nova Empresa
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Razão Social</TableCell>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Profissionais Vinculados</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((comp) => (
              <TableRow key={comp.id}>
                <TableCell>{comp.id}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>{comp.razao_social}</TableCell>
                <TableCell>{comp.nome_fantasia}</TableCell>
                <TableCell>{comp.cnpj}</TableCell>
                <TableCell>
                  {comp.professionals && comp.professionals.length > 0 ? (
                    comp.professionals.map((p: CompanyProfessional, idx: number) => (
                      <div key={idx} style={{ fontSize: '0.85rem' }}>
                        👤 <strong>{p.name}</strong> ({p.vinculo_type})
                      </div>
                    ))
                  ) : (
                    <span style={{ color: 'red' }}>Nenhum vinculado</span>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => comp.id && navigate(`/processos?company_id=${comp.id}`)}
                    sx={{ mr: 1, textTransform: 'none' }}
                  >
                    Processo Protocolo
                  </Button>
                  <Button size="small" onClick={() => handleOpen(comp)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => comp.id && handleDeleteComp(comp.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhuma empresa encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>

            <Typography variant="h6" color="primary" sx={{ mb: -1 }}>Dados Básicos</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField label="Razão Social" name="razao_social" value={formData.razao_social} onChange={handleInputChange} fullWidth required />
              <TextField label="Nome Fantasia" name="nome_fantasia" value={formData.nome_fantasia} onChange={handleInputChange} fullWidth required />
              <TextField
                label="CNPJ (Alfanumérico)"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                error={!!cnpjError}
                helperText={cnpjError}
                fullWidth
                required
              />
              <TextField label="Telefone" name="phone" value={formData.phone || ''} onChange={handleInputChange} fullWidth />
            </Box>
            <Box>
              <TextField label="E-mail" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} fullWidth />
            </Box>

            <Divider />

            <Typography variant="h6" color="primary" sx={{ mb: -1 }}>Endereço</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1fr' }, gap: 2 }}>
              <TextField label="CEP" name="cep" value={formData.cep || ''} onChange={handleInputChange} fullWidth />
              <TextField label="Logradouro" name="street" value={formData.street || ''} onChange={handleInputChange} fullWidth />
              <TextField label="Número" name="number" value={formData.number || ''} onChange={handleInputChange} fullWidth />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              <TextField label="Complemento" name="complement" value={formData.complement || ''} onChange={handleInputChange} fullWidth />
              <TextField label="Bairro" name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} fullWidth />
              <TextField label="Cidade" name="city" value={formData.city || ''} onChange={handleInputChange} fullWidth />
              <TextField label="UF" name="state" value={formData.state || ''} onChange={handleInputChange} fullWidth />
            </Box>

            <Divider />

            <Typography variant="h6" color="primary" sx={{ mb: -1 }}>Profissionais Vinculados *</Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <TextField
                select
                label="Selecione um Profissional"
                value={selectedProfId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedProfId(val === '' ? '' : Number(val));
                }}
                sx={{ flexGrow: 2, minWidth: '200px' }}
              >
                <MenuItem value=""><em>Selecione...</em></MenuItem>
                {professionalsList.map((p: Professional) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.cpf})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Tipo de Vínculo"
                value={selectedLinkType}
                onChange={(e) => setSelectedLinkType(e.target.value)}
                sx={{ flexGrow: 1, minWidth: '150px' }}
              >
                {linkTypes.map((type: string, idx: number) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddProfessional}
                disabled={selectedProfId === ''}
                sx={{ height: '56px' }}
              >
                Vincular
              </Button>
            </Box>

            {professionalsError && (
              <Typography color="error" variant="body2">{professionalsError}</Typography>
            )}

            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>Lista de Profissionais Vinculados:</Typography>
              <List dense>
                {formData.professionals && formData.professionals.length > 0 ? (
                  formData.professionals.map((prof: CompanyProfessional) => (
                    <ListItem key={prof.professional_id}>
                      <ListItemText
                        primary={prof.name}
                        secondary={`Tipo de Vínculo: ${prof.vinculo_type}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveProfessional(prof.professional_id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary={<span style={{ color: 'red' }}>Nenhum profissional vinculado ainda. Adicione pelo menos um profissional acima!</span>} />
                  </ListItem>
                )}
              </List>
            </Paper>

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
