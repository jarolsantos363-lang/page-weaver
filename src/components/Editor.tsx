import { useState, useRef, useEffect } from 'react';
import { Page, Block } from '@/types/page';
import { BlockEditor } from './BlockEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Palette, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import EmojiPicker from './EmojiPicker';
import ColorPicker from './ColorPicker';

interface EditorProps {
  page: Page;
  onUpdate: (updates: Partial<Page>) => void;
}

export const Editor = ({ page, onUpdate }: EditorProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(page.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(page.title);
  }, [page.title]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== page.title) {
      onUpdate({ title: title.trim() });
    } else if (!title.trim()) {
      setTitle(page.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitle(page.title);
      setIsEditingTitle(false);
    }
  };

  const handleBlockUpdate = (blockId: string, content: string) => {
    const updatedContent = page.content.map(block =>
      block.id === blockId ? { ...block, content } : block
    );
    onUpdate({ content: updatedContent });
  };

  const handleBlockTypeChange = (blockId: string, type: Block['type']) => {
    const updatedContent = page.content.map(block =>
      block.id === blockId ? { ...block, type } : block
    );
    onUpdate({ content: updatedContent });
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedContent = page.content.filter(block => block.id !== blockId);
    onUpdate({ content: updatedContent });
  };

  const handleBlockCheck = (blockId: string, checked: boolean) => {
    const updatedContent = page.content.map(block =>
      block.id === blockId ? { ...block, checked } : block
    );
    onUpdate({ content: updatedContent });
  };

  const handleAddBlock = (afterBlockId?: string) => {
    const newBlock: Block = {
      id: nanoid(),
      type: 'text',
      content: '',
    };

    let updatedContent: Block[];
    if (afterBlockId) {
      const index = page.content.findIndex(b => b.id === afterBlockId);
      updatedContent = [
        ...page.content.slice(0, index + 1),
        newBlock,
        ...page.content.slice(index + 1),
      ];
    } else {
      updatedContent = [...page.content, newBlock];
    }

    onUpdate({ content: updatedContent });
  };

  const handleIconChange = (emoji: string) => {
    onUpdate({ icon: emoji });
    setShowEmojiPicker(false);
  };

  const handleColorChange = (color: string) => {
    onUpdate({ coverColor: color });
    setShowColorPicker(false);
  };

  return (
    <div className="flex-1 h-screen overflow-auto">
      <div className="max-w-3xl mx-auto px-24 py-12">
        {/* Cover */}
        {page.coverColor && (
          <div
            className="w-full h-32 rounded-lg mb-8 relative group"
            style={{ backgroundColor: page.coverColor }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdate({ coverColor: undefined })}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth"
            >
              Quitar portada
            </Button>
          </div>
        )}

        {/* Icon and Title */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-6xl hover:bg-hover-background p-2 rounded-lg transition-smooth relative"
            >
              {page.icon}
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <EmojiPicker onSelect={handleIconChange} />
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {!page.coverColor && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Añadir portada
                </Button>
                {showColorPicker && (
                  <div className="absolute mt-2 z-50">
                    <ColorPicker onSelect={handleColorChange} />
                  </div>
                )}
              </>
            )}
          </div>

          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0 h-auto bg-transparent"
              placeholder="Sin título"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="text-4xl font-bold cursor-text hover:bg-hover-background px-2 py-1 -mx-2 rounded transition-smooth"
            >
              {page.title}
            </h1>
          )}
        </div>

        {/* Blocks */}
        <div className="space-y-1">
          {page.content.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              onUpdate={(content) => handleBlockUpdate(block.id, content)}
              onDelete={() => handleBlockDelete(block.id)}
              onTypeChange={(type) => handleBlockTypeChange(block.id, type)}
              onCheck={(checked) => handleBlockCheck(block.id, checked)}
              onEnter={() => handleAddBlock(block.id)}
              autoFocus={index === page.content.length - 1 && !block.content}
            />
          ))}
          
          {page.content.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground py-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddBlock()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Presiona "/" para ver comandos o empieza a escribir
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
