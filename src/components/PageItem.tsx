import { useState } from 'react';
import { ChevronRight, ChevronDown, Star, MoreHorizontal, Plus, Trash2, Edit2 } from 'lucide-react';
import { Page } from '@/types/page';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageItemProps {
  page: Page;
  level: number;
  isActive: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggle: () => void;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Page>) => void;
  onCreateSubpage: () => void;
  compact?: boolean;
}

export const PageItem = ({
  page,
  level,
  isActive,
  isExpanded,
  hasChildren,
  onToggle,
  onClick,
  onToggleFavorite,
  onDelete,
  onUpdate,
  onCreateSubpage,
  compact = false,
}: PageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(page.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(page.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      style={{ paddingLeft: compact ? 0 : `${level * 12}px` }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-smooth",
          isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
        )}
      >
        {hasChildren && !compact && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-0.5 hover:bg-sidebar-accent rounded transition-smooth"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-icon-color" />
            ) : (
              <ChevronRight className="w-3 h-3 text-icon-color" />
            )}
          </button>
        )}
        
        {!hasChildren && !compact && <div className="w-4" />}

        <button
          onClick={onClick}
          className="flex items-center gap-2 flex-1 min-w-0 text-left py-0.5"
        >
          <span className="text-sm" style={{ fontSize: 'var(--page-icon-size)' }}>
            {page.icon}
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-sm text-sidebar-foreground"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate text-sm text-sidebar-foreground">
              {page.title}
            </span>
          )}
        </button>

        {isHovered && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1"
          >
            {!compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateSubpage();
                }}
                className="h-6 w-6 p-0 hover:bg-sidebar-accent"
              >
                <Plus className="w-3 h-3 text-icon-color" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 w-6 p-0 hover:bg-sidebar-accent"
                >
                  <MoreHorizontal className="w-3 h-3 text-icon-color" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Renombrar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleFavorite}>
                  <Star className={cn("w-4 h-4 mr-2", page.isFavorite && "fill-yellow-400 text-yellow-400")} />
                  {page.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
