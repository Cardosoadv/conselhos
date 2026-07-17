import api from './api';

export interface ProcessDocument {
  id?: number;
  process_id: number;
  title: string;
  type: 'html' | 'pdf';
  content: string; // HTML string or base64 PDF string
  signed_by?: string | null;
  signed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Process {
  id: number;
  process_number: string;
  professional_id?: number | null;
  company_id?: number | null;
  type: 'Profissional' | 'Empresa';
  status: string;
  created_at: string;
  updated_at: string;
  target_name?: string; // Virtual name of professional/company
  target_identifier?: string; // CPF or CNPJ
  documents?: ProcessDocument[];
}

export const getProcesses = async (search?: string): Promise<Process[]> => {
  const response = await api.get('/processes', {
    params: { search }
  });
  return response.data;
};

export const getProcessById = async (id: number): Promise<Process> => {
  const response = await api.get(`/processes/${id}`);
  return response.data;
};

export const getProcessByProfessionalId = async (professionalId: number): Promise<Process> => {
  const response = await api.get(`/processes/by-professional/${professionalId}`);
  return response.data;
};

export const getProcessByCompanyId = async (companyId: number): Promise<Process> => {
  const response = await api.get(`/processes/by-company/${companyId}`);
  return response.data;
};

export const addDocumentToProcess = async (
  processId: number,
  title: string,
  type: 'html' | 'pdf',
  content: string
): Promise<ProcessDocument> => {
  const response = await api.post(`/processes/${processId}/documents`, {
    title,
    type,
    content
  });
  return response.data;
};

export const signDocument = async (docId: number, signedBy: string): Promise<ProcessDocument> => {
  const response = await api.post(`/processes/documents/${docId}/sign`, {
    signedBy
  });
  return response.data;
};
