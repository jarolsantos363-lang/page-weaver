import { Collaborator, CollaboratorRole } from '@/types/collaborator';
import { nanoid } from 'nanoid';

const COLLABORATORS_KEY = 'notion-clone-collaborators';
const CURRENT_USER_KEY = 'notion-clone-current-user';

// Obtener usuario actual (simulado para uso local)
export const getCurrentUserId = (): string => {
  let userId = localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) {
    userId = nanoid();
    localStorage.setItem(CURRENT_USER_KEY, userId);
    // Crear usuario actual como admin
    const currentUser: Collaborator = {
      id: userId,
      name: 'Tú',
      email: 'usuario@local.com',
      role: 'admin',
      addedAt: Date.now(),
      addedBy: userId,
    };
    const collaborators = getCollaborators();
    if (!collaborators.find(c => c.id === userId)) {
      collaborators.push(currentUser);
      saveCollaborators(collaborators);
    }
  }
  return userId;
};

export const collaboratorStorage = {
  getCollaborators: (): Collaborator[] => {
    try {
      const data = localStorage.getItem(COLLABORATORS_KEY);
      const collaborators = data ? JSON.parse(data) : [];
      
      // Asegurar que el usuario actual existe
      const currentUserId = getCurrentUserId();
      if (!collaborators.find((c: Collaborator) => c.id === currentUserId)) {
        const currentUser: Collaborator = {
          id: currentUserId,
          name: 'Tú',
          email: 'usuario@local.com',
          role: 'admin',
          addedAt: Date.now(),
          addedBy: currentUserId,
        };
        collaborators.push(currentUser);
        saveCollaborators(collaborators);
      }
      
      return collaborators;
    } catch (error) {
      console.error('Error loading collaborators:', error);
      return [];
    }
  },

  saveCollaborators: (collaborators: Collaborator[]): void => {
    try {
      localStorage.setItem(COLLABORATORS_KEY, JSON.stringify(collaborators));
    } catch (error) {
      console.error('Error saving collaborators:', error);
    }
  },

  addCollaborator: (name: string, email: string, role: CollaboratorRole = 'editor'): Collaborator => {
    const collaborators = collaboratorStorage.getCollaborators();
    const currentUserId = getCurrentUserId();
    
    // Verificar si ya existe
    const existing = collaborators.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Este colaborador ya existe');
    }
    
    const newCollaborator: Collaborator = {
      id: nanoid(),
      name,
      email,
      role,
      addedAt: Date.now(),
      addedBy: currentUserId,
    };
    
    collaborators.push(newCollaborator);
    collaboratorStorage.saveCollaborators(collaborators);
    return newCollaborator;
  },

  updateCollaborator: (id: string, updates: Partial<Collaborator>): void => {
    const collaborators = collaboratorStorage.getCollaborators();
    const index = collaborators.findIndex(c => c.id === id);
    if (index !== -1) {
      collaborators[index] = {
        ...collaborators[index],
        ...updates,
      };
      collaboratorStorage.saveCollaborators(collaborators);
    }
  },

  removeCollaborator: (id: string): void => {
    const collaborators = collaboratorStorage.getCollaborators();
    const currentUserId = getCurrentUserId();
    
    // No permitir eliminar al usuario actual
    if (id === currentUserId) {
      throw new Error('No puedes eliminarte a ti mismo');
    }
    
    const filtered = collaborators.filter(c => c.id !== id);
    collaboratorStorage.saveCollaborators(filtered);
  },

  getCollaborator: (id: string): Collaborator | undefined => {
    const collaborators = collaboratorStorage.getCollaborators();
    return collaborators.find(c => c.id === id);
  },

  updateCurrentUser: (name: string, email?: string): void => {
    const currentUserId = getCurrentUserId();
    collaboratorStorage.updateCollaborator(currentUserId, { name, email });
  },
};

// Helper para guardar
const saveCollaborators = (collaborators: Collaborator[]) => {
  try {
    localStorage.setItem(COLLABORATORS_KEY, JSON.stringify(collaborators));
  } catch (error) {
    console.error('Error saving collaborators:', error);
  }
};

