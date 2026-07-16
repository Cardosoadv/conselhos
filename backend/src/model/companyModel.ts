import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface CompanyProfessional {
  professional_id: number;
  vinculo_type: string;
  name?: string;
  cpf?: string;
}

export interface Company {
  id?: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email?: string | null;
  phone?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  created_at?: Date;
  updated_at?: Date;

  // Relations
  professionals?: CompanyProfessional[];
}

export const checkCnpjExists = async (cnpj: string, excludeId?: number): Promise<boolean> => {
  const cleanCnpj = cnpj.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  let query = 'SELECT id FROM companies WHERE REPLACE(REPLACE(REPLACE(cnpj, ".", ""), "-", ""), "/", "") = ?';
  const params: any[] = [cleanCnpj];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows.length > 0;
};

export const getAllCompanies = async (): Promise<Company[]> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM companies ORDER BY razao_social ASC');
  const companies = rows as Company[];

  for (const company of companies) {
    const [profRows] = await pool.query<RowDataPacket[]>(`
      SELECT cp.professional_id, cp.vinculo_type, p.name, p.cpf
      FROM company_professionals cp
      JOIN professionals p ON cp.professional_id = p.id
      WHERE cp.company_id = ?
    `, [company.id]);

    company.professionals = profRows as CompanyProfessional[];
  }

  return companies;
};

export const getCompanyById = async (id: number): Promise<Company | null> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM companies WHERE id = ?', [id]);
  if (rows.length === 0) return null;

  const company = rows[0] as Company;

  const [profRows] = await pool.query<RowDataPacket[]>(`
    SELECT cp.professional_id, cp.vinculo_type, p.name, p.cpf
    FROM company_professionals cp
    JOIN professionals p ON cp.professional_id = p.id
    WHERE cp.company_id = ?
  `, [company.id]);

  company.professionals = profRows as CompanyProfessional[];

  return company;
};

export const createCompany = async (companyData: Company): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      razao_social,
      nome_fantasia,
      cnpj,
      email,
      phone,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      professionals
    } = companyData;

    const query = `
      INSERT INTO companies (
        razao_social, nome_fantasia, cnpj, email, phone,
        cep, street, number, complement, neighborhood, city, state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      razao_social,
      nome_fantasia,
      cnpj,
      email || null,
      phone || null,
      cep || null,
      street || null,
      number || null,
      complement || null,
      neighborhood || null,
      city || null,
      state || null
    ];

    const [result] = await connection.query<ResultSetHeader>(query, values);
    const companyId = result.insertId;

    if (professionals && professionals.length > 0) {
      const linkQuery = `
        INSERT INTO company_professionals (company_id, professional_id, vinculo_type)
        VALUES (?, ?, ?)
      `;
      for (const p of professionals) {
        await connection.query(linkQuery, [companyId, p.professional_id, p.vinculo_type]);
      }
    }

    await connection.commit();
    return companyId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateCompany = async (id: number, companyData: Partial<Company>): Promise<boolean> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const fields: string[] = [];
    const values: any[] = [];

    if (companyData.razao_social !== undefined) { fields.push('razao_social = ?'); values.push(companyData.razao_social); }
    if (companyData.nome_fantasia !== undefined) { fields.push('nome_fantasia = ?'); values.push(companyData.nome_fantasia); }
    if (companyData.cnpj !== undefined) { fields.push('cnpj = ?'); values.push(companyData.cnpj); }
    if (companyData.email !== undefined) { fields.push('email = ?'); values.push(companyData.email); }
    if (companyData.phone !== undefined) { fields.push('phone = ?'); values.push(companyData.phone); }
    if (companyData.cep !== undefined) { fields.push('cep = ?'); values.push(companyData.cep); }
    if (companyData.street !== undefined) { fields.push('street = ?'); values.push(companyData.street); }
    if (companyData.number !== undefined) { fields.push('number = ?'); values.push(companyData.number); }
    if (companyData.complement !== undefined) { fields.push('complement = ?'); values.push(companyData.complement); }
    if (companyData.neighborhood !== undefined) { fields.push('neighborhood = ?'); values.push(companyData.neighborhood); }
    if (companyData.city !== undefined) { fields.push('city = ?'); values.push(companyData.city); }
    if (companyData.state !== undefined) { fields.push('state = ?'); values.push(companyData.state); }

    if (fields.length > 0) {
      values.push(id);
      const query = `UPDATE companies SET ${fields.join(', ')} WHERE id = ?`;
      await connection.query(query, values);
    }

    if (companyData.professionals !== undefined) {
      await connection.query('DELETE FROM company_professionals WHERE company_id = ?', [id]);

      if (companyData.professionals.length > 0) {
        const linkQuery = `
          INSERT INTO company_professionals (company_id, professional_id, vinculo_type)
          VALUES (?, ?, ?)
        `;
        for (const p of companyData.professionals) {
          await connection.query(linkQuery, [id, p.professional_id, p.vinculo_type]);
        }
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteCompany = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM companies WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
