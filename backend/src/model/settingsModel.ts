import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

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
  registro_tipo: string;
  registro_inicio: number;
  registro_fim: number;
  created_at?: Date;
  updated_at?: Date;
}

export const getSettings = async (): Promise<Settings | null> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM settings WHERE id = 1');
  if (rows.length === 0) {
    return null;
  }
  return rows[0] as Settings;
};

export const updateSettings = async (settings: Partial<Settings>): Promise<boolean> => {
  const {
    sistema_profissoes,
    nivel,
    razao_social,
    cnpj,
    sede,
    endereco,
    telefone,
    email,
    logotipo,
    registro_tipo,
    registro_inicio,
    registro_fim
  } = settings;

  // We use INSERT ... ON DUPLICATE KEY UPDATE to handle both cases where the row might not exist yet
  const query = `
    INSERT INTO settings (
      id, sistema_profissoes, nivel, razao_social, cnpj, sede, endereco, telefone, email, logotipo,
      registro_tipo, registro_inicio, registro_fim
    ) VALUES (
      1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    ) ON DUPLICATE KEY UPDATE
      sistema_profissoes = VALUES(sistema_profissoes),
      nivel = VALUES(nivel),
      razao_social = VALUES(razao_social),
      cnpj = VALUES(cnpj),
      sede = VALUES(sede),
      endereco = VALUES(endereco),
      telefone = VALUES(telefone),
      email = VALUES(email),
      logotipo = VALUES(logotipo),
      registro_tipo = VALUES(registro_tipo),
      registro_inicio = VALUES(registro_inicio),
      registro_fim = VALUES(registro_fim)
  `;

  const values = [
    sistema_profissoes || '',
    nivel || '',
    razao_social || '',
    cnpj || '',
    sede || '',
    endereco || '',
    telefone || '',
    email || '',
    logotipo || '',
    registro_tipo || 'unico',
    registro_inicio !== undefined ? Number(registro_inicio) : 1,
    registro_fim !== undefined ? Number(registro_fim) : 999999
  ];

  const [result] = await pool.query(query, values);
  const affectedRows = (result as any).affectedRows;
  
  return affectedRows > 0;
};
