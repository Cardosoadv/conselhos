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

export const createArt = async (req: Request, res: Response) => {
  try {
    const { professionalId, companyId } = req.body;
    if (!professionalId || !companyId) {
      return res.status(400).json({ error: 'IDs do profissional e da empresa são obrigatórios' });
    }

    const { getProfessionalById } = await import('../model/professionalModel');
    const { getCompanyById } = await import('../model/companyModel');

    const prof = await getProfessionalById(professionalId);
    if (!prof) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    // "apenas profissional registrado pode fazer art"
    const hasRegistration = prof.registration_number || (prof.profession_registrations && Object.values(prof.profession_registrations).some(v => v !== null));
    if (!hasRegistration) {
      return res.status(403).json({ error: 'Apenas profissionais registrados podem gerar ART' });
    }

    const comp = await getCompanyById(companyId);
    if (!comp) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Get the professional's inscription process
    const profProcess = await processModel.getProcessByProfessionalId(professionalId);
    if (!profProcess) {
      return res.status(404).json({ error: 'Processo de inscrição do profissional não encontrado' });
    }

    // Create the ART Process
    const artProcessId = await processModel.createProcess({
      professional_id: professionalId,
      company_id: companyId,
      type: 'ART',
      status: 'Aberto',
      parent_process_id: profProcess.id
    });

    // Generate the ART Document
    const artHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="text-align: center;">Anotação de Responsabilidade Técnica (ART)</h2>
        <p><strong>Contratante (Empresa):</strong> ${comp.razao_social}</p>
        <p><strong>CNPJ:</strong> ${comp.cnpj}</p>
        <hr />
        <p><strong>Responsável Técnico (Profissional):</strong> ${prof.name}</p>
        <p><strong>CPF:</strong> ${prof.cpf}</p>
        <p><strong>Registro:</strong> ${prof.registration_number || 'Vinculado às profissões'}</p>
        <hr />
        <p>Declaramos para os devidos fins que o profissional acima assume a responsabilidade técnica sobre as atividades da empresa supracitada perante este Conselho.</p>
        <br/><br/>
        <p style="text-align: center;">________________________________________________<br/>Assinatura do Profissional</p>
      </div>
    `;

    const docId = await processModel.createDocument({
      process_id: artProcessId,
      title: 'Anotação de Responsabilidade Técnica',
      type: 'html',
      content: artHtml
    });

    const newProcess = await processModel.getProcessById(artProcessId);
    return res.status(201).json({ process: newProcess, docId });

  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao gerar ART' });
  }
};
