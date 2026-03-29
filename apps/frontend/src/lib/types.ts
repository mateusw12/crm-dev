export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  managerId?: string;
  tenantId?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyId?: string;
  companies?: Company;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING';
  description: string;
  date: string;
  contactId: string;
  createdAt: string;
}

export type DealStatus = 'LEAD' | 'CONTACTED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface Deal {
  id: string;
  title: string;
  value: number;
  status: DealStatus;
  contactId: string;
  contacts?: Contact;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'PENDING' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  contactId?: string;
  dealId?: string;
  contacts?: Contact;
  deals?: Deal;
  createdAt: string;
}

export interface DashboardKpis {
  totalContacts: number;
  totalDeals: number;
  openDeals: number;
  totalPipelineValue: number;
  wonValue: number;
  conversionRate: number;
  overdueTasks: number;
  dealsByStatus: { status: DealStatus; count: number; value: number }[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  groupMembers?: { userId: string; users: User }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message?: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
