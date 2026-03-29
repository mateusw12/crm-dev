import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as http from 'http';
import * as https from 'https';

// keepAlive: false evita o crash UV_HANDLE_CLOSING no Windows (libuv bug com sockets persistentes)
const brasilApi = axios.create({
  baseURL: 'https://brasilapi.com.br/api',
  timeout: 10_000,
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
});

export interface CepData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  descricao_situacao_cadastral: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

@Injectable()
export class BrasilApiService {
  async lookupCep(cep: string): Promise<CepData> {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      throw new BadRequestException('error.cepInvalidLength');
    }
    try {
      const { data } = await brasilApi.get<CepData>(`/cep/v2/${clean}`);
      return data;
    } catch {
      throw new BadRequestException('error.cepNotFound');
    }
  }

  async lookupCnpj(cnpj: string): Promise<CnpjData> {
    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) {
      throw new BadRequestException('error.cnpjInvalidLength');
    }
    try {
      const { data } = await brasilApi.get<CnpjData>(`/cnpj/v1/${clean}`);
      return data;
    } catch {
      throw new BadRequestException('error.cnpjNotFound');
    }
  }
}