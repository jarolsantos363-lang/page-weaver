import { Button } from '@/components/ui/button';

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#AED581', '#FF8A65', '#BA68C8', '#4DB6AC', '#FFD54F',
];

interface ColorPickerProps {
  onSelect: (color: string) => void;
}

const ColorPicker = ({ onSelect }: ColorPickerProps) => {
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 w-64">
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <Button
            key={color}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(color)}
            className="h-10 w-10 p-0 rounded-md border-2 border-transparent hover:border-primary transition-smooth"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
