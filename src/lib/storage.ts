import { Page } from '@/types/page';

const STORAGE_KEY = 'notion-clone-pages';

export const storage = {
  getPages: (): Page[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading pages:', error);
      return [];
    }
  },

  savePages: (pages: Page[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch (error) {
      console.error('Error saving pages:', error);
    }
  },

  getPage: (id: string): Page | undefined => {
    const pages = storage.getPages();
    return pages.find(p => p.id === id);
  },

  createPage: (page: Omit<Page, 'createdAt' | 'updatedAt'>): Page => {
    const pages = storage.getPages();
    const now = Date.now();
    const newPage: Page = {
      ...page,
      createdAt: now,
      updatedAt: now,
    };
    pages.push(newPage);
    storage.savePages(pages);
    return newPage;
  },

  updatePage: (id: string, updates: Partial<Page>): void => {
    const pages = storage.getPages();
    const index = pages.findIndex(p => p.id === id);
    if (index !== -1) {
      pages[index] = {
        ...pages[index],
        ...updates,
        updatedAt: Date.now(),
      };
      storage.savePages(pages);
    }
  },

  deletePage: (id: string): void => {
    let pages = storage.getPages();
    
    // Recursively delete children
    const deleteRecursive = (pageId: string) => {
      const page = pages.find(p => p.id === pageId);
      if (page) {
        page.children.forEach(childId => deleteRecursive(childId));
        pages = pages.filter(p => p.id !== pageId);
      }
    };
    
    deleteRecursive(id);
    
    // Remove from parent's children array
    pages = pages.map(p => ({
      ...p,
      children: p.children.filter(childId => childId !== id)
    }));
    
    storage.savePages(pages);
  },

  toggleFavorite: (id: string): void => {
    const pages = storage.getPages();
    const page = pages.find(p => p.id === id);
    if (page) {
      storage.updatePage(id, { isFavorite: !page.isFavorite });
    }
  },
};
