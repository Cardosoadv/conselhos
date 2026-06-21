import fs from 'fs';
import path from 'path';
import pool, { initDB } from './db';

const migrationsPath = path.join(__dirname, '../migrations');

export const runMigrations = async () => {
  try {
    await initDB(); // ensures connection and migrations table
    const connection = await pool.getConnection();

    const files = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    
    // Get already run migrations
    const [rows] = await connection.query('SELECT version, name FROM migrations');
    const executedMigrations = (rows as any[]).map(row => row.name);

    let migrationsRan = 0;

    for (const file of files) {
      if (!executedMigrations.includes(file)) {
        console.log(`⏳ Executing migration: ${file}`);
        const migrationPath = path.join(migrationsPath, file);
        
        // Import migration
        const migration = await import(migrationPath);
        
        if (migration.query) {
          await connection.query(migration.query);
          
          const version = file.split('_')[0] || '0000';
          await connection.query('INSERT INTO migrations (version, name) VALUES (?, ?)', [version, file]);
          console.log(`✅ Migration ${file} executed successfully.`);
          migrationsRan++;
        } else {
          console.warn(`⚠️ No 'query' exported in migration: ${file}`);
        }
      }
    }
    
    connection.release();
    if (migrationsRan === 0) {
      console.log('🎉 No pending migrations to run.');
    } else {
      console.log(`🎉 All ${migrationsRan} pending migrations executed.`);
    }
  } catch (error) {
    console.error('❌ Error executing migrations:', error);
  } finally {
    process.exit(0);
  }
};

// Run standalone if called directly
if (require.main === module) {
  runMigrations();
}
