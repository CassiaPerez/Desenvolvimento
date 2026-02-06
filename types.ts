export enum ProjectStatus {
  ONLINE = 'Online/No Ar',
  IN_PROGRESS = 'Em Andamento',
  PENDING = 'Pendente',
  DELAYED = 'Atrasado'
}

export interface TeamMember {
  id: string;
  avatarUrl: string;
  name: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  sector: string;
  technologies: string[];
  status: ProjectStatus;
  progress: number;
  updatedAt: string;
  team: TeamMember[];
  url?: string;
}