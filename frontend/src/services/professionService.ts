import api from './api';

export interface Profession {
  id?: number;
  name: string;
  description: string;
  fundamento_legal: string;
  requisitos: string;
  atribuicoes: number | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getProfessions = async (): Promise<Profession[]> => {
  const response = await api.get('/professions');
  return response.data;
};

export const getProfessionById = async (id: number): Promise<Profession> => {
  const response = await api.get(`/professions/${id}`);
  return response.data;
};

export const createProfession = async (profession: Profession): Promise<Profession> => {
  const response = await api.post('/professions', profession);
  return response.data;
};

export const updateProfession = async (id: number, profession: Partial<Profession>): Promise<Profession> => {
  const response = await api.put(`/professions/${id}`, profession);
  return response.data;
};

export const deleteProfession = async (id: number): Promise<void> => {
  await api.delete(`/professions/${id}`);
};
