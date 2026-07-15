import api from './api';

export interface ProfessionalAddress {
  id?: number;
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
  addresses: ProfessionalAddress[];
  professions: number[];
  profession_registrations: { [professionId: number]: number | null };
}

export const getProfessionals = async (): Promise<Professional[]> => {
  const response = await api.get('/professionals');
  return response.data;
};

export const getProfessionalById = async (id: number): Promise<Professional> => {
  const response = await api.get(`/professionals/${id}`);
  return response.data;
};

export const createProfessional = async (data: Professional): Promise<Professional> => {
  const response = await api.post('/professionals', data);
  return response.data;
};

export const updateProfessional = async (id: number, data: Partial<Professional>): Promise<Professional> => {
  const response = await api.put(`/professionals/${id}`, data);
  return response.data;
};

export const deleteProfessional = async (id: number): Promise<void> => {
  await api.delete(`/professionals/${id}`);
};

export const getNextRegistrationNumber = async (): Promise<number> => {
  const response = await api.get('/professionals/next-registration');
  return response.data.next_registration_number;
};
