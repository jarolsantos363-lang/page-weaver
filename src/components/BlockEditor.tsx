import { useState, useRef, useEffect } from 'react';
import { Block } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Type, Heading1, Heading2, Heading3, List, CheckSquare, Code, GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BlockEditorProps {
  block: Block;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onTypeChange: (type: Block['type']) => void;
  onCheck?: (checked: boolean) => void;
  onEnter: () => void;
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
};

export const BlockEditor = ({
  block,
  onUpdate,
  onDelete,
  onTypeChange,
  onCheck,
  onEnter,
  autoFocus = false,
}: BlockEditorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    } else if (block.content === '/' && e.key !== 'Backspace') {
      setShowCommands(true);
    } else if (showCommands && e.key === 'Escape') {
      setShowCommands(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value === '/') {
      setShowCommands(true);
    } else if (showCommands && value !== '/') {
      setShowCommands(false);
    }
    
    onUpdate(value);
  };

  const handleTypeSelect = (type: Block['type']) => {
    onTypeChange(type);
    setShowCommands(false);
    onUpdate('');
    setTimeout(() => textareaRef.current?.focus(), 0);
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
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}

        {block.type === 'checklist' && (
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

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={block.content === '/' ? 'Escribe un comando...' : 'Escribe algo...'}
            className={cn(
              'w-full bg-transparent border-none outline-none resize-none transition-smooth',
              config.className,
              block.type === 'checklist' && block.checked && 'line-through text-muted-foreground'
            )}
            rows={1}
          />

          {showCommands && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-1 z-50 min-w-[200px]"
            >
              {Object.entries(blockTypeConfig).map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type as Block['type'])}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-smooth text-left"
                >
                  <cfg.icon className="w-4 h-4" />
                  <span className="text-sm">{cfg.label}</span>
                </button>
              ))}
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
