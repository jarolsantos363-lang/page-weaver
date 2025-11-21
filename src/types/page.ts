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
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'list' | 'checklist' | 'code';
  content: string;
  checked?: boolean;
}

export interface PageTreeItem extends Page {
  level: number;
}
