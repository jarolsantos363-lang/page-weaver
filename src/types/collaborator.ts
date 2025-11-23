export type CollaboratorRole = 'admin' | 'editor' | 'viewer';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: CollaboratorRole;
  addedAt: number;
  addedBy: string; // ID del usuario que lo agregó
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  collaborators: string[]; // IDs de colaboradores
  ownerId: string; // ID del propietario
  createdAt: number;
  updatedAt: number;
}

