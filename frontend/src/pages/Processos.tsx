import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
    TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
    Stack,
      Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DocIcon,
  UploadFile as UploadIcon,
  Create as SignIcon,
  ArrowBack as BackIcon,
  NoteAdd as NewDocIcon,
  Download as DownloadIcon,
  CheckCircle as CheckedIcon
} from '@mui/icons-material';

import {
  getProcesses,
  getProcessById,
  getProcessByProfessionalId,
  getProcessByCompanyId,
  addDocumentToProcess,
  signDocument,
  type Process,
  type ProcessDocument
} from '../services/processService';



export default function Processos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const professionalIdParam = searchParams.get('professional_id');
  const companyIdParam = searchParams.get('company_id');
  const processIdParam = searchParams.get('process_id');

  // Core state
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ProcessDocument | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);


  // Modals
  const [openNewDocModal, setOpenNewDocModal] = useState(false);
  const [openUploadPdfModal, setOpenUploadPdfModal] = useState(false);
  const [openSignModal, setOpenSignModal] = useState(false);

  // Form states
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');

  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfBase64, setPdfBase64] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  const [signName, setSignName] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Fetch all processes or load specific one if params are present
  const loadProcessesData = async (queryStr?: string) => {
    setLoading(true);
    try {
      const data = await getProcesses(queryStr);
      setProcesses(data);
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
      showSnackbar('Erro ao carregar processos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificProcess = async (id: number) => {
    setLoading(true);
    try {
      const processDetails = await getProcessById(id);
      setSelectedProcess(processDetails);
      if (processDetails.documents && processDetails.documents.length > 0) {
        setSelectedDocument(processDetails.documents[0]);
      } else {
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do processo:', error);
      showSnackbar('Erro ao carregar o processo especificado', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {


      if (processIdParam) {
        await loadSpecificProcess(parseInt(processIdParam));
      } else if (professionalIdParam) {
        setLoading(true);
        try {
          const processDetails = await getProcessByProfessionalId(parseInt(professionalIdParam));
          setSelectedProcess(processDetails);
          if (processDetails.documents && processDetails.documents.length > 0) {
            setSelectedDocument(processDetails.documents[0]);
          }
        } catch {
          showSnackbar('Nenhum processo encontrado para este profissional', 'error');
          await loadProcessesData();
        } finally {
          setLoading(false);
        }
      } else if (companyIdParam) {
        setLoading(true);
        try {
          const processDetails = await getProcessByCompanyId(parseInt(companyIdParam));
          setSelectedProcess(processDetails);
          if (processDetails.documents && processDetails.documents.length > 0) {
            setSelectedDocument(processDetails.documents[0]);
          }
        } catch {
          showSnackbar('Nenhum processo encontrado para esta empresa', 'error');
          await loadProcessesData();
        } finally {
          setLoading(false);
        }
      } else {
        await loadProcessesData();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalIdParam, companyIdParam, processIdParam]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProcessesData(search);
  };

  const handleOpenProcess = async (procId: number) => {
    setSearchParams({ process_id: procId.toString() });
  };

  const handleBackToList = () => {
    setSelectedProcess(null);
    setSelectedDocument(null);
    setSearchParams({});
    loadProcessesData();
  };

  // Create text/HTML document
  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) {
      showSnackbar('Título do documento é obrigatório', 'error');
      return;
    }
    if (!newDocContent.trim()) {
      showSnackbar('Conteúdo do documento é obrigatório', 'error');
      return;
    }

    try {
      setLoading(true);
      await addDocumentToProcess(
        selectedProcess!.id,
        newDocTitle,
        'html',
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
            <h2 style="color: #1c5230; text-transform: uppercase; border-bottom: 2px solid #1c5230; padding-bottom: 5px;">
              ${newDocTitle}
            </h2>
            <p style="white-space: pre-line;">${newDocContent}</p>
          </div>
        `
      );
      showSnackbar('Documento incluído com sucesso!', 'success');
      setOpenNewDocModal(false);
      setNewDocTitle('');
      setNewDocContent('');

      // Reload process
      await loadSpecificProcess(selectedProcess!.id);
    } catch (error) {
      console.error(error);
      showSnackbar('Erro ao incluir documento', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Upload and protocol PDF
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPdfFileName(file.name);
      if (!pdfTitle) {
        // Suggested title
        setPdfTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPdf = async () => {
    if (!pdfTitle.trim()) {
      showSnackbar('Título do documento é obrigatório', 'error');
      return;
    }
    if (!pdfBase64) {
      showSnackbar('Selecione um arquivo PDF', 'error');
      return;
    }

    try {
      setLoading(true);
      await addDocumentToProcess(
        selectedProcess!.id,
        pdfTitle,
        'pdf',
        pdfBase64
      );
      showSnackbar('Documento PDF protocolado com sucesso!', 'success');
      setOpenUploadPdfModal(false);
      setPdfTitle('');
      setPdfBase64('');
      setPdfFileName('');

      // Reload process
      await loadSpecificProcess(selectedProcess!.id);
    } catch (error) {
      console.error(error);
      showSnackbar('Erro ao protocolar PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sign document
  const handleSignDocument = async () => {
    if (!signName.trim()) {
      showSnackbar('Nome do assinante é obrigatório', 'error');
      return;
    }

    try {
      setLoading(true);
      const updatedDoc = await signDocument(selectedDocument!.id!, signName);
      showSnackbar('Documento assinado eletronicamente com sucesso!', 'success');
      setOpenSignModal(false);
      setSignName('');

      // Update local state
      setSelectedDocument(updatedDoc);
      // Reload complete process to update the tree state
      const processDetails = await getProcessById(selectedProcess!.id);
      setSelectedProcess(processDetails);
    } catch (error) {
      console.error(error);
      showSnackbar('Erro ao assinar documento', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render process list view
  const renderListView = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Módulo de Protocolo e Processos
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Gerencie os processos administrativos integrados do Protocolo
            </Typography>
          </Box>
        </Box>

        <Paper component="form" onSubmit={handleSearchSubmit} sx={{ p: 2, mb: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="Buscar por número do processo, CPF/CNPJ ou nome"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained" color="primary" startIcon={<SearchIcon />}>
            Buscar
          </Button>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Nº do Processo</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Interessado / Razão Social</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>CPF / CNPJ</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Data de Criação</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Carregando processos...</TableCell>
                </TableRow>
              ) : processes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Nenhum processo administrativo encontrado.</TableCell>
                </TableRow>
              ) : (
                processes.map((proc) => (
                  <TableRow key={proc.id} hover>
                    <TableCell style={{ fontWeight: 'bold', color: '#1c5230' }}>{proc.process_number}</TableCell>
                    <TableCell>
                      <span className={`badge ${proc.type === 'Profissional' ? 'bg-primary' : 'bg-success'}`}>
                        {proc.type}
                      </span>
                    </TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{proc.target_name || '-'}</TableCell>
                    <TableCell>{proc.target_identifier || '-'}</TableCell>
                    <TableCell>{new Date(proc.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <span className="badge bg-secondary">{proc.status}</span>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<DocIcon />}
                        onClick={() => handleOpenProcess(proc.id)}
                      >
                        Abrir no Protocolo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Helper to check if string is base64 pdf data URI
  const getPdfSrc = (content: string) => {
    if (content.startsWith('data:application/pdf;base64,')) {
      return content;
    }
    return `data:application/pdf;base64,${content}`;
  };

  // Render official visualizer view
  const renderSEIView = () => {
    if (!selectedProcess) return null;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', border: '1px solid #c3c3c3', borderRadius: '4px', overflow: 'hidden' }}>
        {/* PROTOCOLO GREEN HEADER BANNER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1c5230', color: 'white', px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '1px', display: 'flex', alignItems: 'center' }}>
              sei<span style={{ color: '#ffb703', fontWeight: 'bold', fontStyle: 'normal' }}>!</span>
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, fontWeight: 500, fontSize: '0.95rem', borderLeft: '1px solid rgba(255,255,255,0.4)', pl: 2 }}>
              Conselhos - Sistema Eletrônico de Informações
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            startIcon={<BackIcon />}
            onClick={handleBackToList}
            sx={{
              color: '#1c5230',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#e1e1e1'
              }
            }}
          >
            Voltar à Lista
          </Button>
        </Box>

        {/* PROTOCOLO ACTION ICON TOOLBAR */}
        <Box sx={{ display: 'flex', gap: 1, backgroundColor: '#f1f1f1', borderBottom: '1px solid #c3c3c3', p: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Incluir Documento de Texto (HTML)">
            <Button
              variant="outlined"
              size="small"
              startIcon={<NewDocIcon />}
              onClick={() => setOpenNewDocModal(true)}
              sx={{ color: '#333', borderColor: '#ccc', backgroundColor: 'white', '&:hover': { backgroundColor: '#e6e6e6', borderColor: '#bbb' } }}
            >
              Incluir Documento
            </Button>
          </Tooltip>

          <Tooltip title="Protocolar Arquivo PDF Externo">
            <Button
              variant="outlined"
              size="small"
              startIcon={<UploadIcon />}
              onClick={() => setOpenUploadPdfModal(true)}
              sx={{ color: '#333', borderColor: '#ccc', backgroundColor: 'white', '&:hover': { backgroundColor: '#e6e6e6', borderColor: '#bbb' } }}
            >
              Protocolar PDF
            </Button>
          </Tooltip>

          {selectedDocument && !selectedDocument.signed_by && (
            <Tooltip title="Assinar Eletronicamente o Documento Selecionado">
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<SignIcon />}
                onClick={() => setOpenSignModal(true)}
              >
                Assinar Documento
              </Button>
            </Tooltip>
          )}

          {selectedDocument && selectedDocument.type === 'pdf' && (
            <Tooltip title="Baixar Arquivo PDF Original">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                href={getPdfSrc(selectedDocument.content)}
                download={`${selectedDocument.title}.pdf`}
                sx={{ color: '#333', borderColor: '#ccc', backgroundColor: 'white', '&:hover': { backgroundColor: '#e6e6e6', borderColor: '#bbb' } }}
              >
                Baixar PDF
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* PROTOCOLO SPLIT WORKSPACE: LEFT TREE PANEL & RIGHT DOC VISUALIZER */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>

          {/* LEFT SIDEBAR: PROCESS TREE */}
          <Box sx={{ width: '320px', minWidth: '300px', backgroundColor: '#f9f9f9', borderRight: '1px solid #c3c3c3', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, backgroundColor: '#eaedea', borderBottom: '1px solid #c3c3c3' }}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
                Processo nº
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1c5230', mt: 0.5 }}>
                {selectedProcess.process_number}
              </Typography>
              <Typography variant="body2" color="textPrimary" sx={{ mt: 1, fontWeight: 500, fontSize: '0.85rem' }}>
                👥 {selectedProcess.type}: {selectedProcess.target_name}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                🆔 Cadastro: {selectedProcess.target_identifier}
              </Typography>
            </Box>

            {/* DOCUMENT TREE VIEW */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
              <Typography variant="subtitle2" sx={{ px: 1, py: 1, fontWeight: 'bold', fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #eee' }}>
                🗂️ Documentos da Árvore
              </Typography>

              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {selectedProcess.documents && selectedProcess.documents.length === 0 ? (
                  <Typography variant="caption" sx={{ p: 2, textAlign: 'center', display: 'block', color: '#999' }}>
                    Nenhum documento anexado.
                  </Typography>
                ) : (
                  selectedProcess.documents?.map((doc) => {
                    const isSelected = selectedDocument?.id === doc.id;
                    const isSigned = !!doc.signed_by;

                    return (
                      <Box
                        key={doc.id}
                        onClick={() => setSelectedDocument(doc)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.2,
                          borderRadius: '3px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#d1e7dd' : 'transparent',
                          color: isSelected ? '#0f5132' : '#333',
                          borderLeft: isSelected ? '4px solid #1c5230' : '4px solid transparent',
                          '&:hover': {
                            backgroundColor: isSelected ? '#d1e7dd' : '#f1f1f1'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                          <Typography sx={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                            {doc.type === 'pdf' ? '📕' : '📄'}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: isSelected ? 'bold' : 'normal',
                              fontSize: '0.85rem'
                            }}
                          >
                            {doc.title}
                          </Typography>
                        </Box>
                        {isSigned && (
                          <Tooltip title="Assinado Eletronicamente">
                            <CheckedIcon sx={{ fontSize: 16, color: '#198754', ml: 1 }} />
                          </Tooltip>
                        )}
                      </Box>
                    );
                  })
                )}
              </Stack>
            </Box>
          </Box>

          {/* RIGHT SIDEBAR: DOCUMENT CONTAINER & PREVIEW */}
          <Box sx={{ flexGrow: 1, backgroundColor: '#e5e5e5', overflowY: 'auto', p: 3, display: 'flex', justifyContent: 'center' }}>
            {selectedDocument ? (
              <Box sx={{ width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* WHITE SHEET OF PAPER */}
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: 'white',
                    p: 4,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    borderRadius: '2px',
                    minHeight: '600px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* PROTOCOLO ELECTRONIC SIGNATURE SEAL WATERMARK BANNER */}
                  {selectedDocument.signed_by && (
                    <Box sx={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      border: '2px solid #198754',
                      borderRadius: '4px',
                      p: '4px 10px',
                      backgroundColor: 'rgba(25, 135, 84, 0.05)',
                      color: '#198754',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transform: 'rotate(2deg)',
                      textAlign: 'center'
                    }}>
                      🔏 ASSINADO ELETRONICAMENTE<br/>
                      <span style={{ fontSize: '0.65rem', fontWeight: 'normal', color: '#555' }}>
                        Por: {selectedDocument.signed_by}
                      </span>
                    </Box>
                  )}

                  {/* DOCUMENT BODY */}
                  {selectedDocument.type === 'html' ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedDocument.content }} />
                  ) : (
                    <Box sx={{ width: '100%', height: '650px', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ p: 1, mb: 1, backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="textSecondary">
                          📎 Arquivo PDF externo anexado: <strong>{selectedDocument.title}.pdf</strong>
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          href={getPdfSrc(selectedDocument.content)}
                          download={`${selectedDocument.title}.pdf`}
                        >
                          Baixar PDF
                        </Button>
                      </Box>
                      <iframe
                        src={getPdfSrc(selectedDocument.content)}
                        title={selectedDocument.title}
                        width="100%"
                        height="100%"
                        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </Box>
                  )}

                  {/* PROTOCOLO OFFICAL SEAL BLOCK AT BOTTOM IF SIGNED */}
                  {selectedDocument.signed_by && (
                    <Box sx={{
                      mt: 6,
                      p: 2,
                      border: '1px solid #198754',
                      borderRadius: '4px',
                      backgroundColor: '#f8fff9',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2
                    }}>
                      <div style={{ fontSize: '1.8rem', color: '#198754' }}>🔏</div>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#198754', fontSize: '0.8rem' }}>
                          Documento Assinado Eletronicamente
                        </Typography>
                        <Typography variant="caption" color="textPrimary" sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
                          Assinado por <strong>{selectedDocument.signed_by}</strong> em {new Date(selectedDocument.signed_at!).toLocaleString('pt-BR')}.
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                          Assinatura válida em conformidade com as diretrizes do sistema de Protocolo do Conselho sob autenticação única criptográfica.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="textSecondary">
                  Selecione um documento na árvore à esquerda para visualizar seu conteúdo.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* MODAL: NEW DOC (HTML) */}
        <Dialog open={openNewDocModal} onClose={() => setOpenNewDocModal(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#1c5230' }}>
            Incluir Documento Administrativo (Texto do Protocolo)
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <TextField
                required
                label="Título do Documento"
                placeholder="Ex: Parecer Técnico, Despacho, Certidão"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                required
                label="Conteúdo / Texto do Documento"
                placeholder="Digite o texto administrativo oficial do documento..."
                value={newDocContent}
                onChange={(e) => setNewDocContent(e.target.value)}
                multiline
                rows={12}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewDocModal(false)}>Cancelar</Button>
            <Button onClick={handleCreateDocument} variant="contained" color="primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Incluir Documento'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* MODAL: PROTOCOL PDF */}
        <Dialog open={openUploadPdfModal} onClose={() => setOpenUploadPdfModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#1c5230' }}>
            Protocolar Documento PDF Externo
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <TextField
                required
                label="Nome/Título do Documento PDF"
                placeholder="Ex: RG, Diploma de Formação, CNH"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                fullWidth
                size="small"
              />

              <Box>
                <input
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id="upload-pdf-file"
                  type="file"
                  onChange={handlePdfFileChange}
                />
                <label htmlFor="upload-pdf-file">
                  <Button variant="outlined" component="span" startIcon={<UploadIcon />} fullWidth sx={{ p: 2 }}>
                    Selecionar Arquivo PDF
                  </Button>
                </label>
                {pdfFileName && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
                    📎 {pdfFileName} carregado com sucesso.
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUploadPdfModal(false)}>Cancelar</Button>
            <Button onClick={handleUploadPdf} variant="contained" color="primary" disabled={loading || !pdfBase64}>
              {loading ? 'Protocolando...' : 'Protocolar Arquivo'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* MODAL: SIGN DOC */}
        <Dialog open={openSignModal} onClose={() => setOpenSignModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#1c5230' }}>
            Assinar Documento Eletronicamente
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography variant="body2" color="textSecondary">
                Ao assinar, você aplicará um carimbo de conformidade e veracidade inalterável neste documento eletrônico de processo.
              </Typography>
              <TextField
                required
                label="Nome do Assinante / Cargo"
                placeholder="Ex: Dra. Juliana Silva - Diretora de Registros"
                value={signName}
                onChange={(e) => setSignName(e.target.value)}
                fullWidth
                autoFocus
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSignModal(false)}>Cancelar</Button>
            <Button onClick={handleSignDocument} variant="contained" color="success" disabled={loading}>
              {loading ? 'Assinando...' : 'Confirmar Assinatura'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {selectedProcess ? renderSEIView() : renderListView()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
