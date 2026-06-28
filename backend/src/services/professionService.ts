import { Profession, getAllProfessions, getProfessionById, createProfession, updateProfession, deleteProfession } from '../model/professionModel';

export const fetchAllProfessions = async () => {
  return await getAllProfessions();
};

export const fetchProfessionById = async (id: number) => {
  const profession = await getProfessionById(id);
  if (!profession) {
    throw new Error('Profissão não encontrada');
  }
  return profession;
};

export const addProfession = async (data: Profession) => {
  if (!data.name) {
    throw new Error('O nome da profissão é obrigatório');
  }
  const insertId = await createProfession(data);
  return await getProfessionById(insertId);
};

export const editProfession = async (id: number, data: Partial<Profession>) => {
  const profession = await getProfessionById(id);
  if (!profession) {
    throw new Error('Profissão não encontrada');
  }
  const updated = await updateProfession(id, data);
  if (!updated) {
    throw new Error('Nenhuma alteração foi feita');
  }
  return await getProfessionById(id);
};

export const removeProfession = async (id: number) => {
  const profession = await getProfessionById(id);
  if (!profession) {
    throw new Error('Profissão não encontrada');
  }
  return await deleteProfession(id);
};
