import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host:               process.env['database.default.hostname'],
  user:               process.env['database.default.username'],
  password:           process.env['database.default.password'],
  database:           process.env['database.default.database'],
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  multipleStatements: true
});

// Initialize database
export const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL.');

    // Criar tabela de usuários se não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        version VARCHAR(25) NOT NULL,
        name VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela migrations verificada/criada.');

    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error);
  }
};

export default pool;
