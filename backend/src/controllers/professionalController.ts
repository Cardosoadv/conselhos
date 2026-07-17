import { Request, Response } from 'express';
import * as profModel from '../model/professionalModel';
import * as processModel from '../model/processModel';
import { generateProfessionalFichaHTML } from '../utils/documentGenerator';
import { validateCPF } from '../utils/cpfValidator';

export const getNextRegNumber = async (req: Request, res: Response) => {
  try {
    const nextReg = await profModel.getNextRegistrationNumber();
    return res.status(200).json({ next_registration_number: nextReg });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao gerar número de registro' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const professionals = await profModel.getAllProfessionals();
    return res.status(200).json(professionals);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar profissionais' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const professional = await profModel.getProfessionalById(id);
    if (!professional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    return res.status(200).json(professional);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao buscar profissional' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const data: profModel.Professional = req.body;

    // 1. Basic validation
    if (!data.name || data.name.trim() === '') {
      return res.status(400).json({ error: 'O nome é obrigatório' });
    }
    if (!data.cpf || data.cpf.trim() === '') {
      return res.status(400).json({ error: 'O CPF é obrigatório' });
    }
    if (!data.email || data.email.trim() === '') {
      return res.status(400).json({ error: 'O e-mail é obrigatório' });
    }

    // 2. CPF validation
    if (!validateCPF(data.cpf)) {
      return res.status(400).json({ error: 'O CPF fornecido é inválido' });
    }

    // 3. Unique CPF check
    const cpfExists = await profModel.checkCpfExists(data.cpf);
    if (cpfExists) {
      return res.status(400).json({ error: 'Este CPF já está cadastrado para outro profissional' });
    }

    // 4. Address business rule: must have at least one active correspondence address
    const hasActiveCorrespondenceAddress = data.addresses && data.addresses.some(
      addr => addr.correspondence === true && addr.active !== false
    );
    if (!hasActiveCorrespondenceAddress) {
      return res.status(400).json({ error: 'O profissional deve ter pelo menos um endereço ativo marcado para correspondência' });
    }

    // 5. Automatic registration number generation if not manually specified
    // Note: We check if registration is not provided or is null/empty.
    // If we're in 'unico' mode and registration_number is empty, we generate one.
    if (!data.registration_number) {
      try {
        data.registration_number = await profModel.getNextRegistrationNumber();
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    }

    const insertedId = await profModel.createProfessional(data);
    const createdProf = await profModel.getProfessionalById(insertedId);

    if (createdProf) {
      try {
        // Create automatic process
        const processId = await processModel.createProcess({
          professional_id: insertedId,
          type: 'Profissional'
        });

        // Generate automatic document Ficha de Cadastro
        const fichaHtml = await generateProfessionalFichaHTML(createdProf);
        await processModel.createDocument({
          process_id: processId,
          title: 'Ficha de Cadastro do Profissional',
          type: 'html',
          content: fichaHtml
        });
      } catch (err) {
        console.error('Erro ao gerar processo automático para profissional:', err);
        // We do not fail the request if process generation fails, but log it
      }
    }

    return res.status(201).json(createdProf);
  } catch (error: any) {
    console.error('Error creating professional:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao cadastrar profissional' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const data: Partial<profModel.Professional> = req.body;

    // 1. Check if professional exists
    const existing = await profModel.getProfessionalById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    // 2. Basic validations if fields are being updated
    if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
      return res.status(400).json({ error: 'O nome não pode ser vazio' });
    }
    if (data.email !== undefined && (!data.email || data.email.trim() === '')) {
      return res.status(400).json({ error: 'O e-mail não pode ser vazio' });
    }

    if (data.cpf !== undefined) {
      if (!data.cpf || data.cpf.trim() === '') {
        return res.status(400).json({ error: 'O CPF não pode ser vazio' });
      }
      if (!validateCPF(data.cpf)) {
        return res.status(400).json({ error: 'O CPF fornecido é inválido' });
      }
      const cpfExists = await profModel.checkCpfExists(data.cpf, id);
      if (cpfExists) {
        return res.status(400).json({ error: 'Este CPF já está cadastrado para outro profissional' });
      }
    }

    // 3. Address business rule: must have at least one active correspondence address (if addresses are being updated)
    if (data.addresses !== undefined) {
      const hasActiveCorrespondenceAddress = data.addresses.some(
        addr => addr.correspondence === true && addr.active !== false
      );
      if (!hasActiveCorrespondenceAddress) {
        return res.status(400).json({ error: 'O profissional deve ter pelo menos um endereço ativo marcado para correspondência' });
      }
    }

    await profModel.updateProfessional(id, data);
    const updatedProf = await profModel.getProfessionalById(id);
    return res.status(200).json(updatedProf);
  } catch (error: any) {
    console.error('Error updating professional:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao atualizar profissional' });
  }
};

export const deleteProf = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const existing = await profModel.getProfessionalById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    await profModel.deleteProfessional(id);
    return res.status(200).json({ message: 'Profissional removido com sucesso' });
  } catch (error: any) {
    console.error('Error deleting professional:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao remover profissional' });
  }
};
