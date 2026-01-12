import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  onClick(): void;
}

const AddSetButton = ({ onClick }: Props) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="w-full mt-4 border-primary/20 hover:border-primary"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Set
    </Button>
  );
};

export default AddSetButton;
