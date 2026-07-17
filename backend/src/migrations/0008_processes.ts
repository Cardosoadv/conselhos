export const query = `
  CREATE TABLE IF NOT EXISTS processes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    process_number VARCHAR(50) NOT NULL UNIQUE,
    professional_id INT NULL,
    company_id INT NULL,
    type VARCHAR(50) NOT NULL, -- 'Profissional' or 'Empresa'
    status VARCHAR(50) DEFAULT 'Aberto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS process_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    process_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'html' or 'pdf'
    content LONGTEXT NOT NULL, -- HTML text or base64 PDF string
    signed_by VARCHAR(255) NULL, -- Name of user who signed
    signed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (process_id) REFERENCES processes(id) ON DELETE CASCADE
  );
`;
