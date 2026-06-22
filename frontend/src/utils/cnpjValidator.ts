export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não alfanuméricos
  cnpj = cnpj.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (cnpj.length !== 14) return false;

  // Verifica se todos os caracteres são iguais, o que é inválido (ex: 00000000000000)
  if (/^(\w)\1{13}$/.test(cnpj)) return false;

  const calculateDigit = (cnpj: string, factorStart: number): number => {
    let sum = 0;
    let factor = factorStart;

    for (let i = 0; i < cnpj.length; i++) {
      const char = cnpj[i];
      const charValue = char.charCodeAt(0) - 48; // Para dígitos (0-9) retorna 0-9. Para letras (A-Z) retorna 17-42.
      sum += charValue * factor;
      factor--;
      if (factor < 2) {
        factor = 9;
      }
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cnpj.substring(0, 12), 5);
  if (firstDigit !== parseInt(cnpj[12], 10)) return false;

  const secondDigit = calculateDigit(cnpj.substring(0, 13), 6);
  if (secondDigit !== parseInt(cnpj[13], 10)) return false;

  return true;
};
