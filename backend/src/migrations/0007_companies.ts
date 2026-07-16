export const query = `
  CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    cep VARCHAR(20) NULL,
    street VARCHAR(255) NULL,
    number VARCHAR(50) NULL,
    complement VARCHAR(255) NULL,
    neighborhood VARCHAR(255) NULL,
    city VARCHAR(255) NULL,
    state VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS company_professionals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    professional_id INT NOT NULL,
    vinculo_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_professional (company_id, professional_id)
  );

  ALTER TABLE settings ADD COLUMN tipos_vinculo TEXT NULL;
`;
