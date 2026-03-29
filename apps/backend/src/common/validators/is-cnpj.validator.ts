import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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

export function validateCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  return (
    calcDigit(digits, 12) === parseInt(digits[12]) &&
    calcDigit(digits, 13) === parseInt(digits[13])
  );
}

@ValidatorConstraint({ name: 'isCnpj', async: false })
class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    return validateCnpj(value);
  }

  defaultMessage(): string {
    return 'CNPJ inválido';
  }
}

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnpjConstraint,
    });
  };
}
