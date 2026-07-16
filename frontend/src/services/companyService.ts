import api from './api';

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
  created_at?: string;
  updated_at?: string;
  professionals?: CompanyProfessional[];
}

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get('/companies');
  return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

export const createCompany = async (company: Company): Promise<Company> => {
  const response = await api.post('/companies', company);
  return response.data;
};

export const updateCompany = async (id: number, company: Partial<Company>): Promise<Company> => {
  const response = await api.put(`/companies/${id}`, company);
  return response.data;
};

export const deleteCompany = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};
