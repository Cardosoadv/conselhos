import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Process {
  id?: number;
  process_number: string;
  professional_id?: number | null;
  company_id?: number | null;
  type: 'Profissional' | 'Empresa';
  status?: string;
  created_at?: Date;
  updated_at?: Date;

  // Virtual fields / joined
  target_name?: string; // Professional or Company name
  target_identifier?: string; // CPF or CNPJ
}

export interface ProcessDocument {
  id?: number;
  process_id: number;
  title: string;
  type: 'html' | 'pdf';
  content: string; // HTML string or base64 PDF
  signed_by?: string | null;
  signed_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

// Generate the next process number in YYYY.000000 format
export const generateNextProcessNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const yearStr = currentYear.toString();

  // Find the max sequence for the current year
  // In process_number (e.g. "2026.000001"), the first 4 chars is the year, and the rest after the "." is the sequence
  const query = `
    SELECT MAX(CAST(SUBSTRING(process_number, 6) AS UNSIGNED)) as max_seq
    FROM processes
    WHERE process_number LIKE ?
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [`${yearStr}.%`]);
  const currentMax = rows[0]?.max_seq || 0;
  const nextSeq = currentMax + 1;

  // Left pad with zeros to 6 digits
  const paddedSeq = nextSeq.toString().padStart(6, '0');
  return `${yearStr}.${paddedSeq}`;
};

// Create a new process
export const createProcess = async (processData: Partial<Process>): Promise<number> => {
  const processNumber = processData.process_number || await generateNextProcessNumber();
  const { professional_id, company_id, type, status = 'Aberto' } = processData;

  const query = `
    INSERT INTO processes (process_number, professional_id, company_id, type, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query<ResultSetHeader>(query, [
    processNumber,
    professional_id || null,
    company_id || null,
    type,
    status
  ]);

  return result.insertId;
};

// Retrieve all processes with search filters
export const getAllProcesses = async (search?: string): Promise<Process[]> => {
  let query = `
    SELECT p.*,
           CASE
             WHEN p.type = 'Profissional' THEN prof.name
             WHEN p.type = 'Empresa' THEN comp.razao_social
           END as target_name,
           CASE
             WHEN p.type = 'Profissional' THEN prof.cpf
             WHEN p.type = 'Empresa' THEN comp.cnpj
           END as target_identifier
    FROM processes p
    LEFT JOIN professionals prof ON p.professional_id = prof.id
    LEFT JOIN companies comp ON p.company_id = comp.id
  `;

  const params: any[] = [];

  if (search && search.trim() !== '') {
    const searchLike = `%${search.trim()}%`;
    query += `
      WHERE p.process_number LIKE ?
         OR prof.name LIKE ?
         OR prof.cpf LIKE ?
         OR comp.razao_social LIKE ?
         OR comp.nome_fantasia LIKE ?
         OR comp.cnpj LIKE ?
    `;
    params.push(searchLike, searchLike, searchLike, searchLike, searchLike, searchLike);
  }

  query += ' ORDER BY p.created_at DESC';

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows as Process[];
};

// Get a process by ID
export const getProcessById = async (id: number): Promise<Process | null> => {
  const query = `
    SELECT p.*,
           CASE
             WHEN p.type = 'Profissional' THEN prof.name
             WHEN p.type = 'Empresa' THEN comp.razao_social
           END as target_name,
           CASE
             WHEN p.type = 'Profissional' THEN prof.cpf
             WHEN p.type = 'Empresa' THEN comp.cnpj
           END as target_identifier
    FROM processes p
    LEFT JOIN professionals prof ON p.professional_id = prof.id
    LEFT JOIN companies comp ON p.company_id = comp.id
    WHERE p.id = ?
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
  if (rows.length === 0) return null;
  return rows[0] as Process;
};

// Get process by Professional ID
export const getProcessByProfessionalId = async (professionalId: number): Promise<Process | null> => {
  const query = `
    SELECT p.*, prof.name as target_name, prof.cpf as target_identifier
    FROM processes p
    JOIN professionals prof ON p.professional_id = prof.id
    WHERE p.professional_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [professionalId]);
  if (rows.length === 0) return null;
  return rows[0] as Process;
};

// Get process by Company ID
export const getProcessByCompanyId = async (companyId: number): Promise<Process | null> => {
  const query = `
    SELECT p.*, comp.razao_social as target_name, comp.cnpj as target_identifier
    FROM processes p
    JOIN companies comp ON p.company_id = comp.id
    WHERE p.company_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [companyId]);
  if (rows.length === 0) return null;
  return rows[0] as Process;
};

// Create a document inside a process
export const createDocument = async (docData: Partial<ProcessDocument>): Promise<number> => {
  const { process_id, title, type, content } = docData;

  const query = `
    INSERT INTO process_documents (process_id, title, type, content)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query<ResultSetHeader>(query, [
    process_id,
    title,
    type,
    content
  ]);

  return result.insertId;
};

// Get all documents for a process
export const getDocumentsByProcessId = async (processId: number): Promise<ProcessDocument[]> => {
  const query = `
    SELECT * FROM process_documents
    WHERE process_id = ?
    ORDER BY created_at ASC
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [processId]);
  return rows as ProcessDocument[];
};

// Get a single document by ID
export const getDocumentById = async (id: number): Promise<ProcessDocument | null> => {
  const query = `SELECT * FROM process_documents WHERE id = ?`;
  const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
  if (rows.length === 0) return null;
  return rows[0] as ProcessDocument;
};

// Sign a document electronically
export const signDocument = async (id: number, signedBy: string): Promise<boolean> => {
  const query = `
    UPDATE process_documents
    SET signed_by = ?, signed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const [result] = await pool.query<ResultSetHeader>(query, [signedBy, id]);
  return result.affectedRows > 0;
};
