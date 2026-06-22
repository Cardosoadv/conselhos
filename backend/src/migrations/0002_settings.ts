export const query = `
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY DEFAULT 1,
      sistema_profissoes VARCHAR(255),
      nivel VARCHAR(255),
      razao_social VARCHAR(255),
      cnpj VARCHAR(20),
      sede VARCHAR(255),
      endereco VARCHAR(255),
      telefone VARCHAR(20),
      email VARCHAR(255),
      logotipo VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  
