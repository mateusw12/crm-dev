export interface UserRef {
  id: string;
  name?: string;
  email: string;
}

export interface ContactRef {
  id: string;
  name: string;
  email?: string;
}

export interface CompanyRef {
  id: string;
  name: string;
}

export interface DealRef {
  id: string;
  title: string;
}

export interface DeletedResponse {
  deleted: boolean;
}

export interface SuccessResponse {
  success: boolean;
}
