/** Aplica a máscara 00000-000 */
export function maskCep(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, '$1-$2');
}

/** Remove máscara (retorna somente dígitos) */
export function cleanCep(value: string): string {
  return value.replace(/\D/g, '');
}

/** Verifica se o CEP tem 8 dígitos */
export function isValidCep(value: string): boolean {
  return value.replace(/\D/g, '').length === 8; 
}
