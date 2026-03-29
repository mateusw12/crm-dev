import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IsCnpj } from '../../../common/validators/is-cnpj.validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsCnpj({ message: 'CNPJ inválido' })
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  cep: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
