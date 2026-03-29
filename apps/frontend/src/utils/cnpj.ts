/** Calcula um dígito verificador do CNPJ */
function calcDigit(digits: string, length: number): number {
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(digits[length - i]) * pos--;
    if (pos < 2) pos = 9;
  }
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

/** Verifica se um CNPJ (com ou sem máscara) é válido */
export function isValidCnpj(value: string): boolean {
  const d = value.replace(/\D/g, '');
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  return (
    calcDigit(d, 12) === parseInt(d[12]) &&
    calcDigit(d, 13) === parseInt(d[13])
  );
}

/** Aplica a máscara 00.000.000/0000-00 */
export function maskCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/^(\d{2})/, '$1.')
    .replace(/^(\d{2}\.\d{3})/, '$1.')
    .replace(/^(\d{2}\.\d{3}\.\d{3})/, '$1/')
    .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})/, '$1-');
}

/** Remove máscara (retorna somente dígitos) */
export function cleanCnpj(value: string): string {
  return value.replace(/\D/g, '');
}
