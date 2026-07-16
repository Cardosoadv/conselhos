import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getSettings } from './settingsModel';

export interface ProfessionalAddress {
  id?: number;
  professional_id?: number;
  type: 'residencial' | 'profissional' | 'outro';
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  correspondence: boolean;
  active: boolean;
}

export interface Professional {
  id?: number;
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  birth_date?: string;
  registration_number?: number | null;
  foto?: string | null;
  digital?: string | null;
  assinatura?: string | null;
  created_at?: Date;
  updated_at?: Date;

  // Relations
  addresses?: ProfessionalAddress[];
  professions?: number[]; // Array of profession IDs
  profession_registrations?: { [professionId: number]: number | null }; // Map of professionId to its registration number (used for per-profession mode)
}

// Check if a CPF already exists in database (except for current professional ID)
export const checkCpfExists = async (cpf: string, excludeId?: number): Promise<boolean> => {
  const cleanCpf = cpf.replace(/\D/g, '');
  let query = 'SELECT id FROM professionals WHERE REPLACE(REPLACE(cpf, ".", ""), "-", "") = ?';
  const params: any[] = [cleanCpf];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows.length > 0;
};

// Calculate the next registration number
export const getNextRegistrationNumber = async (): Promise<number> => {
  const settings = await getSettings();
  const regTipo = settings?.registro_tipo || 'unico';
  const regInicio = settings?.registro_inicio !== undefined ? Number(settings.registro_inicio) : 1;
  const regFim = settings?.registro_fim !== undefined ? Number(settings.registro_fim) : 999999;

  let currentMax = 0;

  if (regTipo === 'unico') {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT MAX(registration_number) as max_reg FROM professionals');
    currentMax = rows[0]?.max_reg || 0;
  } else {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT MAX(registration_number) as max_reg FROM professional_professions');
    currentMax = rows[0]?.max_reg || 0;
  }

  let nextReg = Math.max(currentMax + 1, regInicio);

  if (nextReg > regFim) {
    throw new Error(`Número de registro sequencial (${nextReg}) excedeu o limite máximo configurado (${regFim})`);
  }

  return nextReg;
};

// Retrieve all professionals with their professions and addresses
export const getAllProfessionals = async (): Promise<Professional[]> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM professionals ORDER BY name ASC');
  const professionals = rows as Professional[];

  for (const prof of professionals) {
    // Get addresses
    const [addrRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM professional_addresses WHERE professional_id = ?',
      [prof.id]
    );
    prof.addresses = (addrRows as ProfessionalAddress[]).map(addr => ({
      ...addr,
      correspondence: !!addr.correspondence,
      active: !!addr.active
    }));

    // Get professions
    const [profRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM professional_professions WHERE professional_id = ?',
      [prof.id]
    );
    prof.professions = profRows.map(pr => pr.profession_id);

    const regMap: { [key: number]: number | null } = {};
    profRows.forEach(pr => {
      regMap[pr.profession_id] = pr.registration_number;
    });
    prof.profession_registrations = regMap;
  }

  return professionals;
};

// Get a professional by ID with complete relations
export const getProfessionalById = async (id: number): Promise<Professional | null> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM professionals WHERE id = ?', [id]);
  if (rows.length === 0) return null;

  const prof = rows[0] as Professional;

  // Get addresses
  const [addrRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM professional_addresses WHERE professional_id = ?',
    [prof.id]
  );
  prof.addresses = (addrRows as ProfessionalAddress[]).map(addr => ({
    ...addr,
    correspondence: !!addr.correspondence,
    active: !!addr.active
  }));

  // Get professions
  const [profRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM professional_professions WHERE professional_id = ?',
    [prof.id]
  );
  prof.professions = profRows.map(pr => pr.profession_id);

  const regMap: { [key: number]: number | null } = {};
  profRows.forEach(pr => {
    regMap[pr.profession_id] = pr.registration_number;
  });
  prof.profession_registrations = regMap;

  return prof;
};

// Create a professional along with addresses and professions
export const createProfessional = async (profData: Professional): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, cpf, email, phone, birth_date, registration_number, foto, digital, assinatura, addresses, professions, profession_registrations } = profData;

    // 1. Insert Professional basic info
    const profQuery = `
      INSERT INTO professionals (name, cpf, email, phone, birth_date, registration_number, foto, digital, assinatura)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const profValues = [
      name,
      cpf,
      email,
      phone || null,
      birth_date || null,
      registration_number || null,
      foto || null,
      digital || null,
      assinatura || null
    ];

    const [profResult] = await connection.query<ResultSetHeader>(profQuery, profValues);
    const professionalId = profResult.insertId;

    // 2. Insert Addresses
    if (addresses && addresses.length > 0) {
      const addrQuery = `
        INSERT INTO professional_addresses (professional_id, type, cep, street, number, complement, neighborhood, city, state, correspondence, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      for (const addr of addresses) {
        const addrValues = [
          professionalId,
          addr.type,
          addr.cep || '',
          addr.street || '',
          addr.number || '',
          addr.complement || '',
          addr.neighborhood || '',
          addr.city || '',
          addr.state || '',
          addr.correspondence ? 1 : 0,
          addr.active !== false ? 1 : 0
        ];
        await connection.query(addrQuery, addrValues);
      }
    }

    // 3. Insert Professions
    if (professions && professions.length > 0) {
      const pProfQuery = `
        INSERT INTO professional_professions (professional_id, profession_id, registration_number)
        VALUES (?, ?, ?)
      `;
      for (const pId of professions) {
        const regNum = profession_registrations && profession_registrations[pId] !== undefined
          ? profession_registrations[pId]
          : null;
        await connection.query(pProfQuery, [professionalId, pId, regNum]);
      }
    }

    await connection.commit();
    return professionalId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Update a professional along with addresses and professions
export const updateProfessional = async (id: number, profData: Partial<Professional>): Promise<boolean> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update basic info if provided
    const fields: string[] = [];
    const values: any[] = [];

    if (profData.name !== undefined) { fields.push('name = ?'); values.push(profData.name); }
    if (profData.cpf !== undefined) { fields.push('cpf = ?'); values.push(profData.cpf); }
    if (profData.email !== undefined) { fields.push('email = ?'); values.push(profData.email); }
    if (profData.phone !== undefined) { fields.push('phone = ?'); values.push(profData.phone); }
    if (profData.birth_date !== undefined) { fields.push('birth_date = ?'); values.push(profData.birth_date); }
    if (profData.registration_number !== undefined) { fields.push('registration_number = ?'); values.push(profData.registration_number); }
    if (profData.foto !== undefined) { fields.push('foto = ?'); values.push(profData.foto); }
    if (profData.digital !== undefined) { fields.push('digital = ?'); values.push(profData.digital); }
    if (profData.assinatura !== undefined) { fields.push('assinatura = ?'); values.push(profData.assinatura); }

    if (fields.length > 0) {
      values.push(id);
      const profQuery = `UPDATE professionals SET ${fields.join(', ')} WHERE id = ?`;
      await connection.query(profQuery, values);
    }

    // 2. Sync Addresses (delete existing and insert new is cleanest and extremely robust)
    if (profData.addresses !== undefined) {
      // Delete existing
      await connection.query('DELETE FROM professional_addresses WHERE professional_id = ?', [id]);

      // Insert new
      const addrQuery = `
        INSERT INTO professional_addresses (professional_id, type, cep, street, number, complement, neighborhood, city, state, correspondence, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      for (const addr of profData.addresses) {
        const addrValues = [
          id,
          addr.type,
          addr.cep || '',
          addr.street || '',
          addr.number || '',
          addr.complement || '',
          addr.neighborhood || '',
          addr.city || '',
          addr.state || '',
          addr.correspondence ? 1 : 0,
          addr.active !== false ? 1 : 0
        ];
        await connection.query(addrQuery, addrValues);
      }
    }

    // 3. Sync Professions
    if (profData.professions !== undefined) {
      // Delete existing
      await connection.query('DELETE FROM professional_professions WHERE professional_id = ?', [id]);

      // Insert new
      const pProfQuery = `
        INSERT INTO professional_professions (professional_id, profession_id, registration_number)
        VALUES (?, ?, ?)
      `;
      for (const pId of profData.professions) {
        const regNum = profData.profession_registrations && profData.profession_registrations[pId] !== undefined
          ? profData.profession_registrations[pId]
          : null;
        await connection.query(pProfQuery, [id, pId, regNum]);
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

// Delete a professional
export const deleteProfessional = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM professionals WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
