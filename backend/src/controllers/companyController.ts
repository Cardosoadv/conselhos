import { Request, Response } from 'express';
import * as companyService from '../services/companyService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const companies = await companyService.fetchAllCompanies();
    return res.status(200).json(companies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar empresas' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const company = await companyService.fetchCompanyById(id);
    return res.status(200).json(company);
  } catch (error: any) {
    return res.status(404).json({ error: error.message || 'Empresa não encontrada' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newCompany = await companyService.addCompany(req.body);
    return res.status(201).json(newCompany);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const updatedCompany = await companyService.editCompany(id, req.body);
    return res.status(200).json(updatedCompany);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteComp = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    await companyService.removeCompany(id);
    return res.status(200).json({ message: 'Empresa removida com sucesso' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
