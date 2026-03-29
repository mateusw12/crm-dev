export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum DealStatus {
  LEAD = 'LEAD',
  CONTACTED = 'CONTACTED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export enum InteractionType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  role?: UserRole;
  tenantId?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: UserRole;
  tenantId?: string;
}
