import { Button } from '@/components/ui/button';

const emojis = [
  '📄', '📝', '📋', '📊', '📈', '📉', '🗂️', '📁', '📂', '🗃️',
  '💡', '🎯', '✨', '🚀', '⚡', '🔥', '💪', '🎨', '🎭', '🎪',
  '📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📰',
  '🏠', '🏢', '🏪', '🏬', '🏭', '🏗️', '🏛️', '⛪', '🕌', '🏰',
  '🍎', '🍌', '🍊', '🍋', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
  '🎮', '🎯', '🎲', '♟️', '🎭', '🎨', '🧩', '🎪', '🎬', '🎤',
  '🌍', '🌎', '🌏', '🗺️', '🏔️', '⛰️', '🏕️', '🏖️', '🏜️', '🏝️'
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 w-72">
      <div className="grid grid-cols-8 gap-1">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(emoji)}
            className="h-9 w-9 p-0 hover:bg-accent text-xl"
          >
            {emoji}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
