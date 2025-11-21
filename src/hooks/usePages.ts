import { useState, useEffect } from 'react';
import { Page } from '@/types/page';
import { storage } from '@/lib/storage';
import { nanoid } from 'nanoid';

export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = () => {
    const loadedPages = storage.getPages();
    
    // Initialize with a welcome page if no pages exist
    if (loadedPages.length === 0) {
      const welcomePage: Page = {
        id: nanoid(),
        title: 'Bienvenido a tu espacio de trabajo',
        icon: '👋',
        content: [
          {
            id: nanoid(),
            type: 'heading1',
            content: 'Empieza a organizar tus ideas',
          },
          {
            id: nanoid(),
            type: 'text',
            content: 'Este es tu primer página. Presiona "/" para ver todos los comandos disponibles.',
          },
          {
            id: nanoid(),
            type: 'heading2',
            content: 'Funcionalidades:',
          },
          {
            id: nanoid(),
            type: 'checklist',
            content: 'Crear páginas y subpáginas',
            checked: true,
          },
          {
            id: nanoid(),
            type: 'checklist',
            content: 'Organizar con drag & drop',
            checked: true,
          },
          {
            id: nanoid(),
            type: 'checklist',
            content: 'Añadir a favoritos',
            checked: true,
          },
          {
            id: nanoid(),
            type: 'checklist',
            content: 'Buscar entre tus páginas',
            checked: true,
          },
        ],
        parentId: null,
        children: [],
        isFavorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      storage.savePages([welcomePage]);
      setPages([welcomePage]);
    } else {
      setPages(loadedPages);
    }
    setLoading(false);
  };

  const createPage = (title: string = 'Sin título', parentId: string | null = null): Page => {
    const newPage = storage.createPage({
      id: nanoid(),
      title,
      icon: '📄',
      content: [],
      parentId,
      children: [],
      isFavorite: false,
    });

    // Update parent's children array
    if (parentId) {
      const parent = pages.find(p => p.id === parentId);
      if (parent) {
        storage.updatePage(parentId, {
          children: [...parent.children, newPage.id]
        });
      }
    }

    loadPages();
    return newPage;
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    storage.updatePage(id, updates);
    loadPages();
  };

  const deletePage = (id: string) => {
    storage.deletePage(id);
    loadPages();
  };

  const toggleFavorite = (id: string) => {
    storage.toggleFavorite(id);
    loadPages();
  };

  const movePage = (pageId: string, newParentId: string | null) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    // Remove from old parent
    if (page.parentId) {
      const oldParent = pages.find(p => p.id === page.parentId);
      if (oldParent) {
        storage.updatePage(page.parentId, {
          children: oldParent.children.filter(id => id !== pageId)
        });
      }
    }

    // Add to new parent
    if (newParentId) {
      const newParent = pages.find(p => p.id === newParentId);
      if (newParent) {
        storage.updatePage(newParentId, {
          children: [...newParent.children, pageId]
        });
      }
    }

    // Update page's parentId
    storage.updatePage(pageId, { parentId: newParentId });
    loadPages();
  };

  return {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    toggleFavorite,
    movePage,
    reload: loadPages,
  };
};
