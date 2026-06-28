export const query = `
    CREATE TABLE IF NOT EXISTS professions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      fundamento_legal VARCHAR(255),
      requisitos TEXT,
      atribuicoes INT UNSIGNED,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (atribuicoes) REFERENCES atribuicoes(id) ON DELETE SET NULL
    )
  `;
