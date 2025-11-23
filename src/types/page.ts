export interface Page {
  id: string;
  title: string;
  icon: string;
  coverColor?: string;
  content: Block[];
  parentId: string | null;
  children: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Block {
  id: string;
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'list' | 'checklist' | 'code' | 'task' | 'note' | 'activity';
  content: string;
  checked?: boolean;
  linkedPageId?: string; // ID de la página vinculada si es un enlace
}

export interface PageTreeItem extends Page {
  level: number;
}
