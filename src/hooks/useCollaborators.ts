import { useState, useEffect } from 'react';
import { Collaborator, CollaboratorRole } from '@/types/collaborator';
import { collaboratorStorage, getCurrentUserId } from '@/lib/collaboratorStorage';

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = () => {
    const loaded = collaboratorStorage.getCollaborators();
    setCollaborators(loaded);
    setLoading(false);
  };

  const addCollaborator = (name: string, email: string, role: CollaboratorRole = 'editor') => {
    try {
      const newCollaborator = collaboratorStorage.addCollaborator(name, email, role);
      loadCollaborators();
      return newCollaborator;
    } catch (error) {
      throw error;
    }
  };

  const updateCollaborator = (id: string, updates: Partial<Collaborator>) => {
    collaboratorStorage.updateCollaborator(id, updates);
    loadCollaborators();
  };

  const removeCollaborator = (id: string) => {
    try {
      collaboratorStorage.removeCollaborator(id);
      loadCollaborators();
    } catch (error) {
      throw error;
    }
  };

  const currentUser = collaborators.find(c => c.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  return {
    collaborators,
    currentUser,
    currentUserId,
    isAdmin,
    loading,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
    refresh: loadCollaborators,
  };
};

