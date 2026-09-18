export const query = `
  ALTER TABLE company_professionals
  ADD COLUMN area VARCHAR(255) NULL,
  ADD COLUMN data_aprovacao DATE NULL,
  ADD COLUMN numero_reuniao VARCHAR(100) NULL,
  ADD COLUMN fundamento_legal VARCHAR(255) NULL;
`;
