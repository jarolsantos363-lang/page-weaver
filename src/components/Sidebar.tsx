import { useState } from 'react';
import { Search, Plus, Star, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Page } from '@/types/page';
import { PageItem } from './PageItem';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  pages: Page[];
  currentPageId: string | null;
  onPageSelect: (id: string) => void;
  onCreatePage: (parentId?: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePage: (id: string) => void;
  onUpdatePage: (id: string, updates: Partial<Page>) => void;
}

export const Sidebar = ({
  pages,
  currentPageId,
  onPageSelect,
  onCreatePage,
  onToggleFavorite,
  onDeletePage,
  onUpdatePage,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [showFavorites, setShowFavorites] = useState(true);

  const toggleExpanded = (id: string) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const rootPages = pages.filter(p => p.parentId === null);
  const favoritePages = pages.filter(p => p.isFavorite);

  const filteredPages = searchQuery
    ? pages.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.some(block => block.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : rootPages;

  const renderPageTree = (page: Page, level: number = 0) => {
    const hasChildren = page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const children = pages.filter(p => page.children.includes(p.id));

    return (
      <div key={page.id}>
        <PageItem
          page={page}
          level={level}
          isActive={currentPageId === page.id}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onToggle={() => toggleExpanded(page.id)}
          onClick={() => onPageSelect(page.id)}
          onToggleFavorite={() => onToggleFavorite(page.id)}
          onDelete={() => onDeletePage(page.id)}
          onUpdate={(updates) => onUpdatePage(page.id, updates)}
          onCreateSubpage={() => onCreatePage(page.id)}
        />
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children.map(child => renderPageTree(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-lg font-semibold text-sidebar-foreground">Workspace</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-color" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-sidebar-accent border-none text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {!searchQuery && favoritePages.length > 0 && (
            <div className="mb-2">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full transition-smooth"
              >
                {showFavorites ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <Star className="w-3 h-3" />
                <span>Favoritos</span>
              </button>
              <AnimatePresence>
                {showFavorites && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-1"
                  >
                    {favoritePages.map(page => (
                      <PageItem
                        key={page.id}
                        page={page}
                        level={0}
                        isActive={currentPageId === page.id}
                        isExpanded={false}
                        hasChildren={false}
                        onToggle={() => {}}
                        onClick={() => onPageSelect(page.id)}
                        onToggleFavorite={() => onToggleFavorite(page.id)}
                        onDelete={() => onDeletePage(page.id)}
                        onUpdate={(updates) => onUpdatePage(page.id, updates)}
                        onCreateSubpage={() => onCreatePage(page.id)}
                        compact
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {searchQuery ? (
            filteredPages.length > 0 ? (
              filteredPages.map(page => (
                <PageItem
                  key={page.id}
                  page={page}
                  level={0}
                  isActive={currentPageId === page.id}
                  isExpanded={false}
                  hasChildren={false}
                  onToggle={() => {}}
                  onClick={() => onPageSelect(page.id)}
                  onToggleFavorite={() => onToggleFavorite(page.id)}
                  onDelete={() => onDeletePage(page.id)}
                  onUpdate={(updates) => onUpdatePage(page.id, updates)}
                  onCreateSubpage={() => onCreatePage(page.id)}
                />
              ))
            ) : (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No se encontraron páginas
              </div>
            )
          ) : (
            filteredPages.map(page => renderPageTree(page))
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-sidebar-border">
        <Button
          onClick={() => onCreatePage()}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva página
        </Button>
      </div>
    </div>
  );
};
