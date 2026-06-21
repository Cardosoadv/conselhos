import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as bcrypt from 'bcrypt';

export interface User extends RowDataPacket {
  id:           number;
  name:         string;
  email:        string;
  password?:    string;
  created_at:   Date;
  updated_at?:  Date;
  deleted_at?:  Date | null;
}

/**
 * Hashes a plain text password
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compares plain text password with a hash
 */
export async function checkPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Creates a new user
 */
export async function createUser(name: string, email: string, password: string): Promise<number> {
  const passwordHash = await hashPassword(password);
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
    [name, email, passwordHash]
  );
  return result.insertId;
}

/**
 * Finds an active user by their email (Ignores soft-deleted users)
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, password, created_at, updated_at FROM users WHERE email = ? AND deleted_at IS NULL', 
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Finds an active user by their ID (Ignores soft-deleted users)
 */
export async function findUserById(id: number): Promise<User | null> {
  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, password, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL', 
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Dynamically updates active user fields safely
 */
export async function updateUser(id: number, data: Partial<Pick<User, 'name' | 'email' | 'password'>>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return;

  fields.push('updated_at = NOW()');
  values.push(id); 

  // Added 'AND deleted_at IS NULL' to prevent updating soft-deleted users
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
  await pool.query<ResultSetHeader>(sql, values);
}

/**
 * Performs a SOFT delete by setting the deleted_at timestamp
 */
export async function deleteUser(id: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    'UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL', 
    [id]
  );
}

/**
 * Optional: Restores a soft-deleted user back to active state
 */
export async function restoreUser(id: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    'UPDATE users SET deleted_at = NULL WHERE id = ?', 
    [id]
  );
}