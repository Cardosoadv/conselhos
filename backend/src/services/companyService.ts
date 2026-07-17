import { Company, getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany, checkCnpjExists } from '../model/companyModel';
import * as processModel from '../model/processModel';
import { generateCompanyFichaHTML } from '../utils/documentGenerator';
import { validateCNPJ } from '../utils/cnpjValidator';

export const fetchAllCompanies = async (): Promise<Company[]> => {
  return await getAllCompanies();
};

export const fetchCompanyById = async (id: number): Promise<Company> => {
  const company = await getCompanyById(id);
  if (!company) {
    throw new Error('Empresa não encontrada');
  }
  return company;
};

export const addCompany = async (data: Company): Promise<Company> => {
  // 1. Basic validation
  if (!data.razao_social || data.razao_social.trim() === '') {
    throw new Error('A Razão Social é obrigatória');
  }
  if (!data.nome_fantasia || data.nome_fantasia.trim() === '') {
    throw new Error('O Nome Fantasia é obrigatório');
  }
  if (!data.cnpj || data.cnpj.trim() === '') {
    throw new Error('O CNPJ é obrigatório');
  }

  // 2. CNPJ validation
  if (!validateCNPJ(data.cnpj)) {
    throw new Error('O CNPJ fornecido é inválido');
  }

  // 3. Unique CNPJ check
  const cnpjExists = await checkCnpjExists(data.cnpj);
  if (cnpjExists) {
    throw new Error('Este CNPJ já está cadastrado para outra empresa');
  }

  // 4. Association rule: must have at least one associated professional
  if (!data.professionals || data.professionals.length === 0) {
    throw new Error('A empresa deve estar vinculada a pelo menos um profissional');
  }

  const insertId = await createCompany(data);
  const created = await getCompanyById(insertId);
  if (!created) {
    throw new Error('Erro ao buscar empresa cadastrada');
  }

  try {
    // Create automatic process for company
    const processId = await processModel.createProcess({
      company_id: insertId,
      type: 'Empresa'
    });

    // Generate automatic document Ficha de Cadastro
    const fichaHtml = await generateCompanyFichaHTML(created);
    await processModel.createDocument({
      process_id: processId,
      title: 'Ficha de Cadastro da Empresa',
      type: 'html',
      content: fichaHtml
    });
  } catch (err) {
    console.error('Erro ao gerar processo automático para empresa:', err);
    // Do not crash the return of company creation
  }

  return created;
};

export const editCompany = async (id: number, data: Partial<Company>): Promise<Company> => {
  const existing = await getCompanyById(id);
  if (!existing) {
    throw new Error('Empresa não encontrada');
  }

  // Basic validations if fields are being updated
  if (data.razao_social !== undefined && (!data.razao_social || data.razao_social.trim() === '')) {
    throw new Error('A Razão Social não pode ser vazia');
  }
  if (data.nome_fantasia !== undefined && (!data.nome_fantasia || data.nome_fantasia.trim() === '')) {
    throw new Error('O Nome Fantasia não pode ser vazio');
  }

  if (data.cnpj !== undefined) {
    if (!data.cnpj || data.cnpj.trim() === '') {
      throw new Error('O CNPJ não pode ser vazio');
    }
    if (!validateCNPJ(data.cnpj)) {
      throw new Error('O CNPJ fornecido é inválido');
    }
    const cnpjExists = await checkCnpjExists(data.cnpj, id);
    if (cnpjExists) {
      throw new Error('Este CNPJ já está cadastrado para outra empresa');
    }
  }

  if (data.professionals !== undefined) {
    if (data.professionals.length === 0) {
      throw new Error('A empresa deve estar vinculada a pelo menos um profissional');
    }
  }

  await updateCompany(id, data);
  const updated = await getCompanyById(id);
  if (!updated) {
    throw new Error('Erro ao buscar empresa atualizada');
  }
  return updated;
};

export const removeCompany = async (id: number): Promise<boolean> => {
  const existing = await getCompanyById(id);
  if (!existing) {
    throw new Error('Empresa não encontrada');
  }
  return await deleteCompany(id);
};
