import { Request, Response } from 'express';
import { getSettings, updateSettings, Settings } from '../model/settingsModel';
import { validateCNPJ } from '../utils/cnpjValidator';

export const getConfig = async (req: Request, res: Response) => {
  try {
    let settings = await getSettings();
    if (!settings) {
      // Retorna objeto vazio caso ainda não existam configurações
      settings = {
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
        registro_fim: 999999,
        tipos_vinculo: 'Responsável Técnico'
      } as Settings;
    } else if (!settings.tipos_vinculo) {
      settings.tipos_vinculo = 'Responsável Técnico';
    }
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar as configurações' });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const data: Partial<Settings> = req.body;

    // Se um CNPJ foi fornecido e não está vazio, validamos
    if (data.cnpj && data.cnpj.trim() !== '') {
      if (!validateCNPJ(data.cnpj)) {
        return res.status(400).json({ error: 'CNPJ inválido' });
      }
    }

    const success = await updateSettings(data);
    if (success) {
      const updatedSettings = await getSettings();
      return res.status(200).json({ message: 'Configurações atualizadas com sucesso', settings: updatedSettings });
    } else {
      return res.status(500).json({ error: 'Falha ao atualizar configurações' });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar as configurações' });
  }
};
