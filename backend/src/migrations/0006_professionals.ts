export const query = `
  CREATE TABLE IF NOT EXISTS professionals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    registration_number INT NULL,
    foto LONGTEXT NULL,
    digital LONGTEXT NULL,
    assinatura LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS professional_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    cep VARCHAR(20),
    street VARCHAR(255),
    number VARCHAR(50),
    complement VARCHAR(255),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(50),
    correspondence BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS professional_professions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    profession_id INT NOT NULL,
    registration_number INT NULL,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
    FOREIGN KEY (profession_id) REFERENCES professions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_professional_profession (professional_id, profession_id)
  );
`;
