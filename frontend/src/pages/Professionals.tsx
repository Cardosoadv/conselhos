import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as DocIcon,
  Edit as EditIcon,
  Add as AddIcon,
  PhotoCamera,
  Fingerprint,
  Gesture
} from '@mui/icons-material';
import {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  getNextRegistrationNumber,
  type Professional,
  type ProfessionalAddress
} from '../services/professionalService';
import { getProfessions, type Profession } from '../services/professionService';
import { getSettings, type Settings } from '../services/settingsService';

// Basic CPF helper for format masking and validation
const formatCPF = (value: string) => {
  const clean = value.replace(/\D/g, '');
  return clean
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
};

const validateCPFAlgorithm = (cpf: string): boolean => {
  if (!cpf) return false;
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10))) return false;

  return true;
};

const initialAddress = (): ProfessionalAddress => ({
  type: 'residencial',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  correspondence: false,
  active: true
});

const initialForm = (): Professional => ({
  name: '',
  cpf: '',
  email: '',
  phone: '',
  birth_date: '',
  registration_number: null,
  foto: null,
  digital: null,
  assinatura: null,
  addresses: [
    { ...initialAddress(), correspondence: true } // At least one with correspondence by default
  ],
  professions: [],
  profession_registrations: {}
});

export default function Professionals() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfId, setSelectedProfId] = useState<number | null>(null);
  const [form, setForm] = useState<Professional>(initialForm());
  const [cpfError, setCpfError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profsData, professionsList, settingsData] = await Promise.all([
        getProfessionals(),
        getProfessions(),
        getSettings()
      ]);
      setProfessionals(profsData);
      setProfessions(professionsList.filter(p => p.active));
      setSettings(settingsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showSnackbar('Erro ao carregar os dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreate = async () => {
    setSelectedProfId(null);
    setCpfError('');
    const newForm = initialForm();

    // Pre-calculate next registration number if unique mode
    if (settings?.registro_tipo === 'unico') {
      try {
        const nextNum = await getNextRegistrationNumber();
        newForm.registration_number = nextNum;
      } catch (err: unknown) {
        console.error('Erro ao gerar registro sequencial:', err);
      }
    }

    setForm(newForm);
    setOpenDialog(true);
  };

  const handleOpenEdit = async (prof: Professional) => {
    setSelectedProfId(prof.id || null);
    setCpfError('');
    try {
      const fullProf = await getProfessionalById(prof.id!);

      // Ensure birth date is correctly formatted for date input (YYYY-MM-DD)
      if (fullProf.birth_date) {
        fullProf.birth_date = fullProf.birth_date.substring(0, 10);
      }

      setForm(fullProf);
      setOpenDialog(true);
    } catch {
      showSnackbar('Erro ao carregar detalhes do profissional', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este profissional?')) {
      try {
        await deleteProfessional(id);
        showSnackbar('Profissional excluído com sucesso', 'success');
        fetchData();
      } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        showSnackbar(err.response?.data?.error || 'Erro ao excluir profissional', 'error');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      const maskedCpf = formatCPF(value);
      setForm({ ...form, cpf: maskedCpf });

      if (maskedCpf.length === 14) {
        if (!validateCPFAlgorithm(maskedCpf)) {
          setCpfError('CPF inválido');
        } else {
          setCpfError('');
        }
      } else {
        setCpfError('O CPF deve ter 11 dígitos');
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle files uploads converting to base64
  const handleFileChange = (field: 'foto' | 'digital' | 'assinatura', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          [field]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (field: 'foto' | 'digital' | 'assinatura') => {
    setForm(prev => ({ ...prev, [field]: null }));
  };

  // Dynamic addresses management
  const handleAddAddress = () => {
    setForm(prev => ({
      ...prev,
      addresses: [...prev.addresses, initialAddress()]
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setForm(prev => {
      const list = [...prev.addresses];
      const wasCorrespondence = list[index].correspondence;
      list.splice(index, 1);

      // If we deleted the correspondence address, make the first remaining address correspondence
      if (wasCorrespondence && list.length > 0) {
        list[0].correspondence = true;
      }

      return { ...prev, addresses: list };
    });
  };

  const handleAddressChange = (index: number, field: keyof ProfessionalAddress, value: unknown) => {
    setForm(prev => {
      const list = [...prev.addresses];

      if (field === 'correspondence') {
        // Only one address can be set for correspondence.
        // Unmark all others if this one is checked true.
        if (value === true) {
          list.forEach((addr, i) => {
            addr.correspondence = i === index;
          });
        } else {
          // Can't uncheck correspondence unless another one is checked.
          // But let's allow it, and we will validate on submit.
          list[index].correspondence = value as boolean;
        }
      } else {
        list[index] = {
          ...list[index],
          [field]: value
        } as unknown as ProfessionalAddress;
      }

      return { ...prev, addresses: list };
    });
  };

  // Dynamic professions management
  const handleProfessionToggle = async (professionId: number) => {
    const isCurrentlySelected = form.professions.includes(professionId);

    let newProfessions = [...form.professions];
    const newRegistrations = { ...form.profession_registrations };

    if (isCurrentlySelected) {
      // Remove profession
      newProfessions = newProfessions.filter(id => id !== professionId);
      delete newRegistrations[professionId];
    } else {
      // Add profession
      newProfessions.push(professionId);

      // Calculate individual registration if in per_profession mode and it's blank
      if (settings?.registro_tipo === 'por_profissao' && !newRegistrations[professionId]) {
        try {
          const nextReg = await getNextRegistrationNumber();
          newRegistrations[professionId] = nextReg;
        } catch (err) {
          console.error(err);
        }
      }
    }

    setForm(prev => ({
      ...prev,
      professions: newProfessions,
      profession_registrations: newRegistrations
    }));
  };

  const handleProfessionRegChange = (professionId: number, value: string) => {
    const regNum = value ? parseInt(value) : null;
    setForm(prev => ({
      ...prev,
      profession_registrations: {
        ...prev.profession_registrations,
        [professionId]: isNaN(regNum as number) ? null : regNum
      }
    }));
  };

  const handleSave = async () => {
    // Basic fields validation
    if (!form.name || form.name.trim() === '') {
      showSnackbar('O nome é obrigatório', 'error');
      return;
    }
    if (!form.cpf || form.cpf.trim() === '') {
      showSnackbar('O CPF é obrigatório', 'error');
      return;
    }
    if (cpfError) {
      showSnackbar('Preencha um CPF válido antes de salvar', 'error');
      return;
    }
    if (!form.email || form.email.trim() === '') {
      showSnackbar('O e-mail é obrigatório', 'error');
      return;
    }

    // Addresses business validation
    if (!form.addresses || form.addresses.length === 0) {
      showSnackbar('O profissional deve possuir pelo menos um endereço', 'error');
      return;
    }

    const hasCorrespondence = form.addresses.some(addr => addr.correspondence === true && addr.active !== false);
    if (!hasCorrespondence) {
      showSnackbar('Erro: É obrigatório definir pelo menos um endereço ativo para correspondência', 'error');
      return;
    }

    // Validate registration range if specified
    if (settings?.registro_tipo === 'unico' && form.registration_number) {
      const rNum = Number(form.registration_number);
      const rMin = Number(settings.registro_inicio || 1);
      const rMax = Number(settings.registro_fim || 999999);
      if (rNum < rMin || rNum > rMax) {
        showSnackbar(`O número de registro (${rNum}) deve estar na faixa permitida de ${rMin} a ${rMax}`, 'error');
        return;
      }
    }

    if (settings?.registro_tipo === 'por_profissao') {
      for (const pId of form.professions) {
        const rNum = form.profession_registrations[pId];
        if (!rNum) {
          showSnackbar('Insira o número de registro para todas as profissões selecionadas', 'error');
          return;
        }
        const rMin = Number(settings.registro_inicio || 1);
        const rMax = Number(settings.registro_fim || 999999);
        if (rNum < rMin || rNum > rMax) {
          showSnackbar(`O número de registro (${rNum}) deve estar na faixa permitida de ${rMin} a ${rMax}`, 'error');
          return;
        }
      }
    }

    setLoading(true);
    try {
      if (selectedProfId) {
        await updateProfessional(selectedProfId, form);
        showSnackbar('Profissional atualizado com sucesso!', 'success');
      } else {
        await createProfessional(form);
        showSnackbar('Profissional cadastrado com sucesso!', 'success');
      }
      setOpenDialog(false);
      fetchData();
    } catch (error: unknown) {
      console.error('Erro ao salvar profissional', error);
      const err = error as { response?: { data?: { error?: string } } };
      showSnackbar(err.response?.data?.error || 'Erro ao salvar profissional', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cadastro de Profissionais
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Novo Profissional
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>CPF</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Telefone</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Registro(s)</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum profissional cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              professionals.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell>{prof.name}</TableCell>
                  <TableCell>{prof.cpf}</TableCell>
                  <TableCell>{prof.email}</TableCell>
                  <TableCell>{prof.phone || '-'}</TableCell>
                  <TableCell>
                    {settings?.registro_tipo === 'unico' ? (
                      <span className="badge bg-primary">Geral: {prof.registration_number || 'Não gerado'}</span>
                    ) : (
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {prof.professions.map(pId => {
                          const pName = professions.find(p => p.id === pId)?.name || 'Profissão';
                          const regNum = prof.profession_registrations[pId];
                          return (
                            <span className="badge bg-secondary" key={pId} style={{ marginRight: '4px' }}>
                              {pName}: {regNum || 'Pendente'}
                            </span>
                          );
                        })}
                        {prof.professions.length === 0 && <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Sem profissões</span>}
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => navigate(`/processos?professional_id=${prof.id}`)}
                      sx={{ mr: 1, textTransform: 'none' }}
                      startIcon={<DocIcon />}
                    >
                      Processo Protocolo
                    </Button>
                    <IconButton color="primary" onClick={() => handleOpenEdit(prof)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(prof.id!)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Creation / Edit */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {selectedProfId ? 'Editar Profissional' : 'Cadastrar Novo Profissional'}
        </DialogTitle>
        <DialogContent dividers>
          <div className="row g-3">
            {/* Section 1: Basic Info */}
            <div className="col-12">
              <Typography variant="h6" color="primary" gutterBottom>
                Dados Básicos
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </div>

            <div className="col-12 col-md-6">
              <TextField
                required
                label="Nome Completo"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="col-12 col-md-6">
              <TextField
                required
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={handleInputChange}
                error={!!cpfError}
                helperText={cpfError}
                fullWidth
                slotProps={{ htmlInput: { maxLength: 14 } }}
              />
            </div>
            <div className="col-12 col-md-4">
              <TextField
                required
                label="E-mail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="col-12 col-md-4">
              <TextField
                label="Telefone / Celular"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="col-12 col-md-4">
              <TextField
                label="Data de Nascimento"
                name="birth_date"
                type="date"
                value={form.birth_date || ''}
                onChange={handleInputChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </div>

            {/* Single Registration field if config is "unico" */}
            {settings?.registro_tipo === 'unico' && (
              <div className="col-12 col-md-4">
                <TextField
                  label="Número de Registro Sequencial"
                  name="registration_number"
                  type="number"
                  value={form.registration_number || ''}
                  onChange={handleInputChange}
                  fullWidth
                  helperText={`Sugerido automaticamente. Faixa: ${settings.registro_inicio} - ${settings.registro_fim}`}
                />
              </div>
            )}

            {/* Section 2: Biometrics */}
            <div className="col-12 mt-2">
              <Typography variant="h6" color="primary" gutterBottom>
                Documentos e Biometria
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </div>

            <div className="col-12 col-md-4">
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Foto do Profissional
                  </Typography>
                  {form.foto ? (
                    <Box sx={{ position: 'relative', my: 2 }}>
                      <img
                        src={form.foto}
                        alt="Foto"
                        style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <Button size="small" color="error" onClick={() => handleRemoveFile('foto')} sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                        Remover
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ my: 4 }}>
                      <PhotoCamera sx={{ fontSize: 50, color: '#ccc' }} />
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', my: 1 }}>
                        Nenhuma foto enviada
                      </Typography>
                    </Box>
                  )}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-foto"
                    type="file"
                    onChange={(e) => handleFileChange('foto', e)}
                  />
                  <label htmlFor="upload-foto">
                    <Button variant="outlined" component="span" size="small" startIcon={<PhotoCamera />}>
                      Enviar Foto
                    </Button>
                  </label>
                </CardContent>
              </Card>
            </div>

            <div className="col-12 col-md-4">
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Impressão Digital
                  </Typography>
                  {form.digital ? (
                    <Box sx={{ position: 'relative', my: 2 }}>
                      <img
                        src={form.digital}
                        alt="Digital"
                        style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <Button size="small" color="error" onClick={() => handleRemoveFile('digital')} sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                        Remover
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ my: 4 }}>
                      <Fingerprint sx={{ fontSize: 50, color: '#ccc' }} />
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', my: 1 }}>
                        Nenhuma digital enviada
                      </Typography>
                    </Box>
                  )}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-digital"
                    type="file"
                    onChange={(e) => handleFileChange('digital', e)}
                  />
                  <label htmlFor="upload-digital">
                    <Button variant="outlined" component="span" size="small" startIcon={<Fingerprint />}>
                      Enviar Digital
                    </Button>
                  </label>
                </CardContent>
              </Card>
            </div>

            <div className="col-12 col-md-4">
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Assinatura Digitalizada
                  </Typography>
                  {form.assinatura ? (
                    <Box sx={{ position: 'relative', my: 2 }}>
                      <img
                        src={form.assinatura}
                        alt="Assinatura"
                        style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <Button size="small" color="error" onClick={() => handleRemoveFile('assinatura')} sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                        Remover
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ my: 4 }}>
                      <Gesture sx={{ fontSize: 50, color: '#ccc' }} />
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', my: 1 }}>
                        Nenhuma assinatura enviada
                      </Typography>
                    </Box>
                  )}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-assinatura"
                    type="file"
                    onChange={(e) => handleFileChange('assinatura', e)}
                  />
                  <label htmlFor="upload-assinatura">
                    <Button variant="outlined" component="span" size="small" startIcon={<Gesture />}>
                      Enviar Assinatura
                    </Button>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Section 3: Professions Selection */}
            <div className="col-12 mt-2">
              <Typography variant="h6" color="primary" gutterBottom>
                Profissões do Profissional
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                Selecione uma ou mais profissões vinculadas ao profissional
              </Typography>
            </div>

            <div className="col-12">
              <Paper variant="outlined" sx={{ p: 2 }}>
                {professions.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    Nenhuma profissão ativa cadastrada no sistema. Cadastre profissões primeiro.
                  </Typography>
                ) : (
                  <div className="row g-2">
                    {professions.map((prof) => {
                      const isSelected = form.professions.includes(prof.id!);
                      const regNum = form.profession_registrations[prof.id!] || '';

                      return (
                        <div className="col-12 col-md-6" key={prof.id}>
                          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => handleProfessionToggle(prof.id!)}
                                  color="primary"
                                />
                              }
                              label={prof.name}
                            />

                            {/* Individual registration input if config is "por_profissao" */}
                            {settings?.registro_tipo === 'por_profissao' && isSelected && (
                              <TextField
                                label="N. Registro"
                                size="small"
                                type="number"
                                value={regNum}
                                onChange={(e) => handleProfessionRegChange(prof.id!, e.target.value)}
                                style={{ width: '150px' }}
                                helperText={`Faixa: ${settings.registro_inicio} - ${settings.registro_fim}`}
                              />
                            )}
                          </Stack>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Paper>
            </div>

            {/* Section 4: Addresses */}
            <div className="col-12 mt-2">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                  Endereços
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddAddress}
                >
                  Adicionar Endereço
                </Button>
              </Box>
              <Divider sx={{ mb: 2, mt: 1 }} />
            </div>

            {form.addresses.map((addr, index) => (
              <div className="col-12" key={index}>
                <Card variant="outlined" sx={{ backgroundColor: addr.correspondence ? '#f7faff' : '#fff' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Endereço #{index + 1} {addr.correspondence && <span className="badge bg-primary">Correspondência</span>}
                      </Typography>
                      {form.addresses.length > 1 && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleRemoveAddress(index)}
                        >
                          Remover Endereço
                        </Button>
                      )}
                    </Box>

                    <div className="row g-2">
                      <div className="col-12 col-md-3">
                        <TextField
                          select
                          label="Tipo"
                          value={addr.type}
                          onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                          fullWidth
                          size="small"
                        >
                          <MenuItem value="residencial">Residencial</MenuItem>
                          <MenuItem value="profissional">Profissional</MenuItem>
                          <MenuItem value="outro">Outro</MenuItem>
                        </TextField>
                      </div>
                      <div className="col-12 col-md-3">
                        <TextField
                          label="CEP"
                          value={addr.cep}
                          onChange={(e) => handleAddressChange(index, 'cep', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <TextField
                          label="Logradouro"
                          value={addr.street}
                          onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>
                      <div className="col-12 col-md-2">
                        <TextField
                          label="Número"
                          value={addr.number}
                          onChange={(e) => handleAddressChange(index, 'number', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>

                      <div className="col-12 col-md-4">
                        <TextField
                          label="Complemento"
                          value={addr.complement || ''}
                          onChange={(e) => handleAddressChange(index, 'complement', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>
                      <div className="col-12 col-md-3">
                        <TextField
                          label="Bairro"
                          value={addr.neighborhood}
                          onChange={(e) => handleAddressChange(index, 'neighborhood', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>
                      <div className="col-12 col-md-3">
                        <TextField
                          label="Cidade"
                          value={addr.city}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>
                      <div className="col-12 col-md-2">
                        <TextField
                          label="Estado"
                          value={addr.state}
                          onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </div>

                      <div className="col-12">
                        <Stack direction="row" spacing={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={addr.correspondence}
                                onChange={(e) => handleAddressChange(index, 'correspondence', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Usar para Correspondência"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={addr.active !== false}
                                onChange={(e) => handleAddressChange(index, 'active', e.target.checked)}
                                color="success"
                              />
                            }
                            label="Endereço Ativo"
                          />
                        </Stack>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Cadastro'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
