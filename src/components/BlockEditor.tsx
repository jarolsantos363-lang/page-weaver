import { useState, useRef, useEffect } from 'react';
import { Block, Page } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Type, Heading1, Heading2, Heading3, List, CheckSquare, Code, GripVertical, Trash2, FileText, StickyNote, Calendar, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PageLink } from './PageLink';
import { ContentRenderer } from './ContentRenderer';

interface BlockEditorProps {
  block: Block;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onTypeChange: (type: Block['type']) => void;
  onCheck?: (checked: boolean) => void;
  onEnter: () => void;
  onLinkClick?: (pageId: string) => void;
  onCreatePage?: (title: string) => void;
  pages?: Page[];
  autoFocus?: boolean;
}

const blockTypeConfig = {
  text: { icon: Type, label: 'Texto', className: 'text-base' },
  heading1: { icon: Heading1, label: 'Título 1', className: 'text-3xl font-bold' },
  heading2: { icon: Heading2, label: 'Título 2', className: 'text-2xl font-semibold' },
  heading3: { icon: Heading3, label: 'Título 3', className: 'text-xl font-semibold' },
  list: { icon: List, label: 'Lista', className: 'text-base' },
  checklist: { icon: CheckSquare, label: 'Checklist', className: 'text-base' },
  code: { icon: Code, label: 'Código', className: 'text-sm font-mono bg-muted px-3 py-2 rounded-lg' },
  task: { icon: CheckSquare, label: 'Tarea', className: 'text-base' },
  note: { icon: StickyNote, label: 'Nota', className: 'text-base' },
  activity: { icon: Calendar, label: 'Actividad', className: 'text-base' },
};

const commandConfig = {
  ...blockTypeConfig,
  page: { icon: FilePlus, label: 'Nueva página', className: 'text-base' },
};

export const BlockEditor = ({
  block,
  onUpdate,
  onDelete,
  onTypeChange,
  onCheck,
  onEnter,
  onLinkClick,
  onCreatePage,
  pages = [],
  autoFocus = false,
}: BlockEditorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showPageSuggestions, setShowPageSuggestions] = useState(false);
  const [linkQuery, setLinkQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const config = blockTypeConfig[block.type];

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = block.content.slice(0, cursorPos);
    const isInLink = textBeforeCursor.includes('[[') && !textBeforeCursor.slice(textBeforeCursor.lastIndexOf('[[')).includes(']]');
    
    if (e.key === 'Enter' && !e.shiftKey) {
      if (showPageSuggestions && linkQuery) {
        e.preventDefault();
        const firstMatch = filteredPages[0];
        if (firstMatch) {
          insertPageLink(firstMatch);
        }
      } else {
        e.preventDefault();
        onEnter();
      }
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    } else if (block.content === '/' && e.key !== 'Backspace') {
      setShowCommands(true);
    } else if (showCommands && e.key === 'Escape') {
      setShowCommands(false);
    } else if (showPageSuggestions && e.key === 'Escape') {
      setShowPageSuggestions(false);
      setLinkQuery('');
    } else if (isInLink && e.key === 'ArrowDown') {
      e.preventDefault();
      // Navegar sugerencias (implementar si es necesario)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPos);
    
    // Detectar si estamos escribiendo un enlace [[
    const linkMatch = textBeforeCursor.match(/\[\[([^\]]*)$/);
    
    if (linkMatch) {
      setShowPageSuggestions(true);
      setLinkQuery(linkMatch[1]);
      setShowCommands(false);
    } else {
      setShowPageSuggestions(false);
      setLinkQuery('');
    }
    
    // Detectar comandos
    if (value === '/' || value.startsWith('/')) {
      setShowCommands(true);
    } else if (showCommands && !value.startsWith('/')) {
      setShowCommands(false);
    }
    
    onUpdate(value);
  };

  const insertPageLink = (page: Page) => {
    if (!textareaRef.current) return;
    
    const currentValue = textareaRef.current.value;
    const cursorPos = textareaRef.current.selectionStart || 0;
    const textBeforeCursor = currentValue.slice(0, cursorPos);
    const textAfterCursor = currentValue.slice(cursorPos);
    const linkStart = textBeforeCursor.lastIndexOf('[[');
    
    if (linkStart !== -1) {
      const newContent = 
        currentValue.slice(0, linkStart) + 
        `[[${page.title}]]` + 
        textAfterCursor;
      onUpdate(newContent);
      setShowPageSuggestions(false);
      setLinkQuery('');
      setTimeout(() => {
        const newPos = linkStart + `[[${page.title}]]`.length;
        textareaRef.current?.setSelectionRange(newPos, newPos);
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handlePageLinkClick = (pageId: string) => {
    if (onLinkClick) {
      onLinkClick(pageId);
    }
  };

  const filteredPages = linkQuery
    ? pages.filter(p => 
        p.title.toLowerCase().includes(linkQuery.toLowerCase())
      ).slice(0, 5)
    : pages.slice(0, 5);

  const handleTypeSelect = (type: Block['type'] | 'page') => {
    if (type === 'page') {
      // Crear nueva página desde comando
      const pageTitle = block.content.replace(/^\/page\s*/, '').trim() || 'Sin título';
      if (onCreatePage) {
        onCreatePage(pageTitle);
      }
      onUpdate('');
      setShowCommands(false);
      setTimeout(() => textareaRef.current?.focus(), 0);
    } else {
      onTypeChange(type as Block['type']);
      setShowCommands(false);
      // Si el contenido es solo "/", limpiarlo, sino mantenerlo
      if (block.content === '/') {
        onUpdate('');
      }
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 absolute -left-14 top-1"
          >
            <button className="p-1 hover:bg-hover-background rounded transition-smooth cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-icon-color" />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <config.icon className="w-4 h-4 text-icon-color" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {Object.entries(blockTypeConfig).map(([type, cfg]) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleTypeSelect(type as Block['type'])}
                  >
                    <cfg.icon className="w-4 h-4 mr-2" />
                    {cfg.label}
                  </DropdownMenuItem>
                ))}
                {onCreatePage && (
                  <DropdownMenuItem
                    onClick={() => {
                      const title = prompt('Nombre de la nueva página:') || 'Sin título';
                      onCreatePage(title);
                    }}
                  >
                    <FilePlus className="w-4 h-4 mr-2" />
                    Nueva página
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}

        {(block.type === 'checklist' || block.type === 'task') && (
          <div className="mt-2">
            <Checkbox
              checked={block.checked || false}
              onCheckedChange={(checked) => onCheck?.(checked as boolean)}
            />
          </div>
        )}

        {block.type === 'list' && (
          <span className="text-muted-foreground mt-2">•</span>
        )}

        {(block.type === 'note' || block.type === 'activity') && (
          <div className={cn(
            'mt-2 p-2 rounded-md',
            block.type === 'note' && 'bg-yellow-500/10 border border-yellow-500/20',
            block.type === 'activity' && 'bg-blue-500/10 border border-blue-500/20'
          )}>
            {block.type === 'note' && <StickyNote className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
            {block.type === 'activity' && <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </div>
        )}

        <div className="flex-1 relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={block.content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={block.content === '/' ? 'Escribe un comando...' : block.content.startsWith('[[') ? 'Escribe el nombre de la página...' : 'Escribe algo...'}
              className={cn(
                'w-full bg-transparent border-none outline-none resize-none transition-smooth',
                config.className,
                (block.type === 'checklist' || block.type === 'task') && block.checked && 'line-through text-muted-foreground',
                block.type === 'note' && 'text-yellow-700 dark:text-yellow-300',
                block.type === 'activity' && 'text-blue-700 dark:text-blue-300',
                !isFocused && block.content.includes('[[') && 'opacity-0 absolute'
              )}
              rows={1}
            />
            {!isFocused && block.content.includes('[[') && block.content.trim() && (
              <div
                onClick={() => {
                  textareaRef.current?.focus();
                  setIsFocused(true);
                }}
                className={cn(
                  'w-full min-h-[1.5rem] cursor-text',
                  config.className,
                  (block.type === 'checklist' || block.type === 'task') && block.checked && 'line-through text-muted-foreground',
                  block.type === 'note' && 'text-yellow-700 dark:text-yellow-300',
                  block.type === 'activity' && 'text-blue-700 dark:text-blue-300'
                )}
              >
                <ContentRenderer
                  content={block.content}
                  pages={pages}
                  onLinkClick={handlePageLinkClick}
                  onCreatePage={onCreatePage}
                />
              </div>
            )}
          </div>

          {showCommands && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-1 z-50 min-w-[200px] max-h-[300px] overflow-y-auto"
            >
              {Object.entries(commandConfig).map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type as Block['type'] | 'page')}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-smooth text-left"
                >
                  <cfg.icon className="w-4 h-4" />
                  <span className="text-sm">{cfg.label}</span>
                </button>
              ))}
            </motion.div>
          )}

          {showPageSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-1 z-50 min-w-[250px] max-h-[200px] overflow-y-auto"
            >
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => insertPageLink(page)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-smooth text-left"
                  >
                    <span className="text-base">{page.icon}</span>
                    <span className="text-sm font-medium">{page.title}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {linkQuery ? (
                    <div className="space-y-1">
                      <div>No se encontró "{linkQuery}"</div>
                      {onCreatePage && (
                        <button
                          onClick={() => {
                            if (onCreatePage && textareaRef.current) {
                              onCreatePage(linkQuery);
                              const currentValue = textareaRef.current.value;
                              const cursorPos = textareaRef.current.selectionStart || 0;
                              const textBeforeCursor = currentValue.slice(0, cursorPos);
                              const linkStart = textBeforeCursor.lastIndexOf('[[');
                              if (linkStart !== -1) {
                                const newContent = 
                                  currentValue.slice(0, linkStart) + 
                                  `[[${linkQuery}]]` + 
                                  currentValue.slice(cursorPos);
                                onUpdate(newContent);
                              }
                              setShowPageSuggestions(false);
                              setLinkQuery('');
                            }
                          }}
                          className="text-primary hover:underline font-medium"
                        >
                          Crear página "{linkQuery}"
                        </button>
                      )}
                    </div>
                  ) : (
                    'Escribe para buscar páginas...'
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
