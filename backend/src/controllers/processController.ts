import { Request, Response } from 'express';
import * as processModel from '../model/processModel';

export const getAll = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const processes = await processModel.getAllProcesses(search);
    return res.status(200).json(processes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar processos' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de processo inválido' });
    }

    const processObj = await processModel.getProcessById(id);
    if (!processObj) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    const documents = await processModel.getDocumentsByProcessId(id);
    return res.status(200).json({
      ...processObj,
      documents
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar processo' });
  }
};

export const getByProfessional = async (req: Request, res: Response) => {
  try {
    const professionalId = parseInt(req.params.professionalId as string);
    if (isNaN(professionalId)) {
      return res.status(400).json({ error: 'ID do profissional inválido' });
    }

    const processObj = await processModel.getProcessByProfessionalId(professionalId);
    if (!processObj) {
      return res.status(404).json({ error: 'Processo não encontrado para este profissional' });
    }

    const documents = await processModel.getDocumentsByProcessId(processObj.id!);
    return res.status(200).json({
      ...processObj,
      documents
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar processo do profissional' });
  }
};

export const getByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(req.params.companyId as string);
    if (isNaN(companyId)) {
      return res.status(400).json({ error: 'ID da empresa inválido' });
    }

    const processObj = await processModel.getProcessByCompanyId(companyId);
    if (!processObj) {
      return res.status(404).json({ error: 'Processo não encontrado para esta empresa' });
    }

    const documents = await processModel.getDocumentsByProcessId(processObj.id!);
    return res.status(200).json({
      ...processObj,
      documents
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar processo da empresa' });
  }
};

export const addDocument = async (req: Request, res: Response) => {
  try {
    const processId = parseInt(req.params.id as string);
    if (isNaN(processId)) {
      return res.status(400).json({ error: 'ID de processo inválido' });
    }

    const { title, type, content } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'O título do documento é obrigatório' });
    }
    if (!type || (type !== 'html' && type !== 'pdf')) {
      return res.status(400).json({ error: 'Tipo de documento inválido (deve ser html ou pdf)' });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'O conteúdo do documento é obrigatório' });
    }

    // Verify process exists
    const processObj = await processModel.getProcessById(processId);
    if (!processObj) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    const docId = await processModel.createDocument({
      process_id: processId,
      title,
      type,
      content
    });

    const createdDoc = await processModel.getDocumentById(docId);
    return res.status(201).json(createdDoc);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao adicionar documento ao processo' });
  }
};

export const signDoc = async (req: Request, res: Response) => {
  try {
    const docId = parseInt(req.params.docId as string);
    if (isNaN(docId)) {
      return res.status(400).json({ error: 'ID de documento inválido' });
    }

    const { signedBy } = req.body;
    if (!signedBy || signedBy.trim() === '') {
      return res.status(400).json({ error: 'O nome do assinante é obrigatório' });
    }

    // Verify document exists
    const doc = await processModel.getDocumentById(docId);
    if (!doc) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    await processModel.signDocument(docId, signedBy);
    const updatedDoc = await processModel.getDocumentById(docId);
    return res.status(200).json(updatedDoc);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao assinar documento' });
  }
};
