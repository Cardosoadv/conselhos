export const validateCPF = (cpf: string): boolean => {
  if (!cpf) return false;

  // Remove non-digits
  const cleanCPF = cpf.replace(/\D/g, '');

  // Must be 11 digits
  if (cleanCPF.length !== 11) return false;

  // Must not be a known invalid CPF (e.g. all digits same)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(9))) return false;

  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};
