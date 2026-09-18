export const query = `
  ALTER TABLE processes
  ADD COLUMN parent_process_id INT NULL,
  ADD FOREIGN KEY (parent_process_id) REFERENCES processes(id) ON DELETE CASCADE;

  -- Modify the type column to allow 'ART' if it was restricted, though it is currently VARCHAR(50).
  -- We just need parent_process_id.
`;
