import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as bcrypt from 'bcrypt';

export interface User extends RowDataPacket {
  id:               number;
  name:             string;
  email:            string;
  passwordHash:     string;
  created_at:       Date;
}


export async function createUser(name: string, email: string, password: string): Promise<number> {
    const createdAt = new Date();
    const passwordHash = await hashPassword(password);
    const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, createdAt]
  );
  return result.insertId;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query<User[]>('SELECT id, name, email, passwordHash, created_at FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
}

export async function findUserById(id: number): Promise<User | null> {
  const [rows] = await pool.query<User[]>('SELECT id, name, email, passwordHash, created_at FROM users WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function updateUser(data: Partial<User>, id: number): Promise<void> {
  const {name, email, passwordHash} = data;
  await pool.query<ResultSetHeader>(`UPDATE users SET ${name ? 'name = ?,' : ''} ${email ? 'email = ?,' : ''} ${passwordHash ? 'passwordHash = ?,' : ''} updated_at = NOW() WHERE id = ?`, [name, email, passwordHash, id]);
}

export async function deleteUser(id: number): Promise<void> {
  await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
}

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

async function checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
