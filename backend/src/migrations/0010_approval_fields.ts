import pool from '../config/db';

export const query = `
  ALTER TABLE professionals 
  ADD COLUMN data_aprovacao DATE NULL,
  ADD COLUMN numero_reuniao VARCHAR(100) NULL;

  ALTER TABLE companies 
  ADD COLUMN registration_number INT NULL,
  ADD COLUMN data_aprovacao DATE NULL,
  ADD COLUMN numero_reuniao VARCHAR(100) NULL;
`;
