import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Profession {
  id?: number;
  name: string;
  description: string;
  fundamento_legal: string;
  requisitos: string;
  atribuicoes: number | null;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export const getAllProfessions = async (): Promise<Profession[]> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM professions');
  return rows as Profession[];
};

export const getProfessionById = async (id: number): Promise<Profession | null> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM professions WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  return rows[0] as Profession;
};

export const createProfession = async (profession: Profession): Promise<number> => {
  const { name, description, fundamento_legal, requisitos, atribuicoes, active } = profession;
  const query = `
    INSERT INTO professions (name, description, fundamento_legal, requisitos, atribuicoes, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [name, description || '', fundamento_legal || '', requisitos || '', atribuicoes || null, active !== undefined ? active : true];
  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.insertId;
};

export const updateProfession = async (id: number, profession: Partial<Profession>): Promise<boolean> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (profession.name !== undefined) { fields.push('name = ?'); values.push(profession.name); }
  if (profession.description !== undefined) { fields.push('description = ?'); values.push(profession.description); }
  if (profession.fundamento_legal !== undefined) { fields.push('fundamento_legal = ?'); values.push(profession.fundamento_legal); }
  if (profession.requisitos !== undefined) { fields.push('requisitos = ?'); values.push(profession.requisitos); }
  if (profession.atribuicoes !== undefined) { fields.push('atribuicoes = ?'); values.push(profession.atribuicoes); }
  if (profession.active !== undefined) { fields.push('active = ?'); values.push(profession.active); }

  if (fields.length === 0) return false;

  values.push(id);
  const query = `UPDATE professions SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.affectedRows > 0;
};

export const deleteProfession = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM professions WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
