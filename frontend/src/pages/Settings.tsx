import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tab, 
  Tabs, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';
import { getSettings, updateSettings, type Settings as SettingsType } from '../services/settingsService';
import { validateCNPJ } from '../utils/cnpjValidator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState<SettingsType>({
    sistema_profissoes: '',
    nivel: '',
    razao_social: '',
    cnpj: '',
    sede: '',
    endereco: '',
    telefone: '',
    email: '',
    logotipo: '',
    registro_tipo: 'unico',
    registro_inicio: 1,
    registro_fim: 999999
  });

  const [loading, setLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState('');
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });

    if (name === 'cnpj') {
      setCnpjError('');
    }
  };

  const handleSave = async () => {
    // Validate CNPJ first
    if (settings.cnpj && settings.cnpj.trim() !== '') {
      if (!validateCNPJ(settings.cnpj)) {
        setCnpjError('CNPJ inválido');
        setTabValue(0); // Switch to the first tab where CNPJ is
        return;
      }
    }

    setLoading(true);
    try {
      const result = await updateSettings(settings);
      setSettings(result.settings);
      setSnackbar({ open: true, message: 'Configurações salvas com sucesso!', severity: 'success' });
    } catch (error: any) {
      console.error('Erro ao salvar configurações', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Erro ao salvar configurações', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configurações do Sistema
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
            <Tab label="Identificação" />
            <Tab label="Contato e Endereço" />
            <Tab label="Configuração de Registro" />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Razão Social"
              name="razao_social"
              value={settings.razao_social}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="CNPJ"
              name="cnpj"
              value={settings.cnpj}
              onChange={handleInputChange}
              error={!!cnpjError}
              helperText={cnpjError}
              fullWidth
            />
            <TextField
              label="Sistema de Profissões"
              name="sistema_profissoes"
              value={settings.sistema_profissoes}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Nível"
              name="nivel"
              value={settings.nivel}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Logotipo (URL)"
              name="logotipo"
              value={settings.logotipo}
              onChange={handleInputChange}
              fullWidth
              placeholder="https://exemplo.com/logo.png"
            />
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={settings.telefone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Sede"
              name="sede"
              value={settings.sede}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Endereço Completo"
              name="endereco"
              value={settings.endereco}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={2}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              select
              label="Tipo de Numeração de Registro"
              name="registro_tipo"
              value={settings.registro_tipo || 'unico'}
              onChange={handleInputChange}
              fullWidth
              helperText="Define se a numeração de registro sequencial é única por profissional ou se cada profissão recebe um número diferente"
            >
              <MenuItem value="unico">Único por Profissional</MenuItem>
              <MenuItem value="por_profissao">Por Profissão do Profissional</MenuItem>
            </TextField>
            <TextField
              label="Início da Faixa de Registro"
              name="registro_inicio"
              type="number"
              value={settings.registro_inicio !== undefined ? settings.registro_inicio : 1}
              onChange={handleInputChange}
              fullWidth
              helperText="O menor número de registro permitido para geração automática"
            />
            <TextField
              label="Fim da Faixa de Registro"
              name="registro_fim"
              type="number"
              value={settings.registro_fim !== undefined ? settings.registro_fim : 999999}
              onChange={handleInputChange}
              fullWidth
              helperText="O maior número de registro permitido para geração automática"
            />
          </Box>
        </CustomTabPanel>

        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </Paper>

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
