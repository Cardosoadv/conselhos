import { Request, Response } from 'express';
import * as professionService from '../services/professionService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const professions = await professionService.fetchAllProfessions();
    return res.status(200).json(professions);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar profissões' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const profession = await professionService.fetchProfessionById(id);
    return res.status(200).json(profession);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newProfession = await professionService.addProfession(req.body);
    return res.status(201).json(newProfession);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const updatedProfession = await professionService.editProfession(id, req.body);
    return res.status(200).json(updatedProfession);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteProfession = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await professionService.removeProfession(id);
    return res.status(200).json({ message: 'Profissão removida com sucesso' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
