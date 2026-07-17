import { Professional } from '../model/professionalModel';
import { Company } from '../model/companyModel';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

// Helper to format date DD/MM/YYYY
const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR');
};

export const generateProfessionalFichaHTML = async (prof: Professional): Promise<string> => {
  // Fetch profession names if we have profession IDs
  let professionsStr = '-';
  if (prof.professions && prof.professions.length > 0) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT name FROM professions WHERE id IN (?)',
      [prof.professions]
    );
    professionsStr = rows.map(r => r.name).join(', ');
  }

  const addressesHtml = prof.addresses && prof.addresses.length > 0
    ? prof.addresses.map((addr, idx) => `
        <div style="margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 10px;">
          <strong>Endereço ${idx + 1} (${addr.type}):</strong><br/>
          ${addr.street}, ${addr.number} ${addr.complement ? `- ${addr.complement}` : ''}<br/>
          Bairro: ${addr.neighborhood} | CEP: ${addr.cep}<br/>
          Cidade: ${addr.city} - ${addr.state}<br/>
          ${addr.correspondence ? '<span style="color: green; font-weight: bold;">[Destinatário de Correspondência]</span>' : ''}
          ${addr.active === false ? '<span style="color: red;">[Inativo]</span>' : ''}
        </div>
      `).join('')
    : '<p>Nenhum endereço cadastrado.</p>';

  const photoHtml = prof.foto
    ? `<img src="${prof.foto}" style="max-width: 120px; max-height: 150px; border: 1px solid #ccc; padding: 4px; border-radius: 4px;" alt="Foto"/>`
    : '<div style="width: 120px; height: 150px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.9rem;">Sem Foto</div>';

  const digitalHtml = prof.digital
    ? `<img src="${prof.digital}" style="max-width: 100px; max-height: 100px; border: 1px solid #ccc; padding: 4px; border-radius: 4px;" alt="Digital"/>`
    : '<div style="width: 100px; height: 100px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.8rem; text-align: center;">Sem Digital</div>';

  const signatureHtml = prof.assinatura
    ? `<img src="${prof.assinatura}" style="max-width: 200px; max-height: 60px; border-bottom: 1px solid #333;" alt="Assinatura"/>`
    : '<div style="width: 200px; height: 40px; border-bottom: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.8rem;">Sem Assinatura</div>';

  const regNumStr = prof.registration_number ? prof.registration_number.toString() : 'Pendente';

  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <!-- CABEÇALHO OFICIAL -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="width: 15%; text-align: center; vertical-align: middle;">
            <div style="font-size: 2.5rem;">🏛️</div>
          </td>
          <td style="text-align: center; vertical-align: middle; padding: 0 10px;">
            <h2 style="margin: 0; font-size: 1.3rem; color: #1c5230; text-transform: uppercase;">Conselho Regional de Registro Profissional</h2>
            <h3 style="margin: 5px 0 0 0; font-size: 1.1rem; color: #555; font-weight: normal;">Sistema Eletrônico de Informações - SEI</h3>
          </td>
          <td style="width: 15%; text-align: center; vertical-align: middle;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #1c5230;">FICHA</div>
          </td>
        </tr>
      </table>

      <h1 style="text-align: center; font-size: 1.5rem; border-bottom: 2px solid #1c5230; padding-bottom: 8px; margin-bottom: 25px; color: #1c5230; text-transform: uppercase;">
        Ficha de Inscrição e Cadastro de Profissional
      </h1>

      <!-- CORPO DE INFORMAÇÕES EM GRADE -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="vertical-align: top; padding: 10px; border: 1px solid #ddd; width: 75%;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; width: 30%;"><strong>Nome Completo:</strong></td>
                <td style="padding: 5px 0; color: #111;">${prof.name}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>CPF:</strong></td>
                <td style="padding: 5px 0; color: #111;">${prof.cpf}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>E-mail:</strong></td>
                <td style="padding: 5px 0; color: #111;">${prof.email}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Telefone:</strong></td>
                <td style="padding: 5px 0; color: #111;">${prof.phone || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Data de Nascimento:</strong></td>
                <td style="padding: 5px 0; color: #111;">${formatDate(prof.birth_date)}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Nº Registro Geral:</strong></td>
                <td style="padding: 5px 0; color: #1c5230; font-weight: bold;">${regNumStr}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Profissão(ões):</strong></td>
                <td style="padding: 5px 0; color: #111;">${professionsStr}</td>
              </tr>
            </table>
          </td>
          <td style="vertical-align: middle; text-align: center; padding: 10px; border: 1px solid #ddd; width: 25%;">
            ${photoHtml}
          </td>
        </tr>
      </table>

      <!-- BIOMETRIA -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ddd;">
        <tr style="background-color: #f9f9f9;">
          <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #1c5230;" colspan="2">Biometria e Assinatura</th>
        </tr>
        <tr>
          <td style="width: 50%; padding: 15px; border-right: 1px solid #ddd; text-align: center;">
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 0.9rem; color: #555;">Impressão Digital</div>
            ${digitalHtml}
          </td>
          <td style="width: 50%; padding: 15px; text-align: center; vertical-align: middle;">
            <div style="font-weight: bold; margin-bottom: 15px; font-size: 0.9rem; color: #555;">Assinatura Digitalizada</div>
            <div style="height: 80px; display: flex; align-items: center; justify-content: center;">
              ${signatureHtml}
            </div>
          </td>
        </tr>
      </table>

      <!-- ENDEREÇOS -->
      <div style="border: 1px solid #ddd; margin-bottom: 30px;">
        <div style="background-color: #f9f9f9; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1c5230;">
          Endereços de Correspondência e Contato
        </div>
        <div style="padding: 15px;">
          ${addressesHtml}
        </div>
      </div>

      <!-- RODAPÉ DE VALIDAÇÃO ELETRÔNICA -->
      <div style="margin-top: 50px; border-top: 2px solid #ccc; padding-top: 15px; font-size: 0.8rem; color: #666; text-align: left;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 10%;">
              <div style="font-size: 2.2rem; color: #1c5230;">📄</div>
            </td>
            <td style="vertical-align: top; padding-left: 10px;">
              <span style="font-weight: bold; color: #333;">Documento Gerado Eletronicamente</span><br/>
              Este documento foi produzido e certificado eletronicamente pelo módulo de protocolo do Sistema de Gestão de Conselhos em <strong>${formatDate(new Date())} às ${new Date().toLocaleTimeString('pt-BR')}</strong>.<br/>
              A autenticidade deste documento pode ser confirmada em nossos portais oficiais de processos eletrônicos.
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;
};

export const generateCompanyFichaHTML = async (comp: Company): Promise<string> => {
  // Build professionals links table
  const proflsHtml = comp.professionals && comp.professionals.length > 0
    ? comp.professionals.map((p, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
          <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${p.cpf}</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #1c5230;">${p.vinculo_type}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3" style="padding: 10px; text-align: center; color: red;">Nenhum profissional vinculado.</td></tr>';

  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <!-- CABEÇALHO OFICIAL -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="width: 15%; text-align: center; vertical-align: middle;">
            <div style="font-size: 2.5rem;">🏛️</div>
          </td>
          <td style="text-align: center; vertical-align: middle; padding: 0 10px;">
            <h2 style="margin: 0; font-size: 1.3rem; color: #1c5230; text-transform: uppercase;">Conselho Regional de Registro Profissional</h2>
            <h3 style="margin: 5px 0 0 0; font-size: 1.1rem; color: #555; font-weight: normal;">Sistema Eletrônico de Informações - SEI</h3>
          </td>
          <td style="width: 15%; text-align: center; vertical-align: middle;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #1c5230;">FICHA</div>
          </td>
        </tr>
      </table>

      <h1 style="text-align: center; font-size: 1.5rem; border-bottom: 2px solid #1c5230; padding-bottom: 8px; margin-bottom: 25px; color: #1c5230; text-transform: uppercase;">
        Ficha de Inscrição e Cadastro de Empresa
      </h1>

      <!-- CORPO DE INFORMAÇÕES -->
      <div style="border: 1px solid #ddd; margin-bottom: 25px;">
        <div style="background-color: #f9f9f9; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1c5230;">
          Dados Cadastrais da Pessoa Jurídica
        </div>
        <table style="width: 100%; border-collapse: collapse; padding: 15px;">
          <tr>
            <td style="padding: 8px 15px; width: 25%;"><strong>Razão Social:</strong></td>
            <td style="padding: 8px 15px; color: #111;"><strong>${comp.razao_social}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 15px;"><strong>Nome Fantasia:</strong></td>
            <td style="padding: 8px 15px; color: #111;">${comp.nome_fantasia}</td>
          </tr>
          <tr>
            <td style="padding: 8px 15px;"><strong>CNPJ:</strong></td>
            <td style="padding: 8px 15px; color: #111;">${comp.cnpj}</td>
          </tr>
          <tr>
            <td style="padding: 8px 15px;"><strong>E-mail:</strong></td>
            <td style="padding: 8px 15px; color: #111;">${comp.email || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 15px;"><strong>Telefone:</strong></td>
            <td style="padding: 8px 15px; color: #111;">${comp.phone || '-'}</td>
          </tr>
        </table>
      </div>

      <!-- ENDEREÇO -->
      <div style="border: 1px solid #ddd; margin-bottom: 25px;">
        <div style="background-color: #f9f9f9; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1c5230;">
          Endereço Comercial / Sede
        </div>
        <div style="padding: 15px;">
          <strong>Endereço Sede:</strong><br/>
          ${comp.street || '-'}, ${comp.number || '-'} ${comp.complement ? `- ${comp.complement}` : ''}<br/>
          Bairro: ${comp.neighborhood || '-'} | CEP: ${comp.cep || '-'}<br/>
          Cidade: ${comp.city || '-'} - ${comp.state || '-'}
        </div>
      </div>

      <!-- PROFISSIONAIS VINCULADOS -->
      <div style="border: 1px solid #ddd; margin-bottom: 30px;">
        <div style="background-color: #f9f9f9; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1c5230;">
          Quadro de Responsáveis e Profissionais Vinculados
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f1f1f1;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left; color: #333;">Profissional</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left; color: #333;">CPF</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left; color: #333;">Tipo de Vínculo</th>
              </tr>
            </thead>
            <tbody>
              ${proflsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- RODAPÉ DE VALIDAÇÃO ELETRÔNICA -->
      <div style="margin-top: 50px; border-top: 2px solid #ccc; padding-top: 15px; font-size: 0.8rem; color: #666; text-align: left;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 10%;">
              <div style="font-size: 2.2rem; color: #1c5230;">📄</div>
            </td>
            <td style="vertical-align: top; padding-left: 10px;">
              <span style="font-weight: bold; color: #333;">Documento Gerado Eletronicamente</span><br/>
              Este documento foi produzido e certificado eletronicamente pelo módulo de protocolo do Sistema de Gestão de Conselhos em <strong>${formatDate(new Date())} às ${new Date().toLocaleTimeString('pt-BR')}</strong>.<br/>
              A autenticidade deste documento pode ser confirmada em nossos portais oficiais de processos eletrônicos.
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;
};
