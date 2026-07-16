import api from './api';

export interface Settings {
  id?: number;
  sistema_profissoes: string;
  nivel: string;
  razao_social: string;
  cnpj: string;
  sede: string;
  endereco: string;
  telefone: string;
  email: string;
  logotipo: string;
  registro_tipo?: string;
  registro_inicio?: number;
  registro_fim?: number;
  tipos_vinculo?: string;
}

export const getSettings = async (): Promise<Settings> => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settings: Partial<Settings>): Promise<{ message: string, settings: Settings }> => {
  const response = await api.put('/settings', settings);
  return response.data;
};
