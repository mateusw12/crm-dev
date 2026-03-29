import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IsCnpj } from '../../../common/validators/is-cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: 'Company name', example: 'Acme Corporation' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsCnpj({ message: 'CNPJ inválido' })
  @ApiProperty({ description: 'Company CNPJ', example: '12.345.678/0001-90' })
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  @ApiProperty({ description: 'Company CEP', example: '12345678' })
  cep: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Company industry', example: 'Technology' })
  industry?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Company website URL', example: 'https://www.acme.com' })
  website?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Company phone number', example: '(11) 1234-5678' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Company address', example: 'Rua Exemplo, 123, São Paulo, SP' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ description: 'Additional notes about the company', example: 'Important client, handle with care' })
  notes?: string;
}
