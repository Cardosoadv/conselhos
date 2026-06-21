import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env['database.default.hostname'] || 'localhost',
  user: process.env['database.default.username'] || 'sistema',
  password: process.env['database.default.password'] || '123456',
  database: process.env['database.default.database'] || 'conselhos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database
export const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL.');

    // Criar tabela de usuários se não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela users verificada/criada.');
    
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error);
  }
};

export default pool;
