import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

interface Props {
  label: string;
  value: number;
  placeholder: string;
  onChange(value: string): void;
  onRemove?: () => void;
}

const SetRow = ({ label, value, placeholder, onChange, onRemove }: Props) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-muted-foreground font-mono w-12">
        {label}
      </span>

      <Input
        type="number"
        value={value || ""}
        placeholder={placeholder}
        min="0"
        onChange={(e) => onChange(e.target.value)}
        className="border-primary/20 bg-background/50 rounded-md"
      />

      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 rounded-md"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SetRow;
