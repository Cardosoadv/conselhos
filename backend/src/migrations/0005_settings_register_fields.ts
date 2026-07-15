export const query = `
  ALTER TABLE settings
  ADD COLUMN registro_tipo VARCHAR(50) DEFAULT 'unico',
  ADD COLUMN registro_inicio INT DEFAULT 1,
  ADD COLUMN registro_fim INT DEFAULT 999999
`;
