"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: "weighted" | "bodyweight" | "duration";
  }) => void;
}

const AddCustomExerciseModal = ({ open, onClose, onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"weighted" | "bodyweight" | "duration">(
    "bodyweight"
  );

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({ name: name.trim(), type });
    setName("");
    setType("bodyweight");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background rounded-xl w-full max-w-md p-6 border border-border">
        <h2 className="text-lg font-bold mb-4">Add Custom Exercise</h2>

        <div className="space-y-4">
          <Input
            placeholder="Exercise name (e.g. Pull-ups)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Exercise Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border border-border rounded-md p-2 bg-background"
            >
              <option value="bodyweight">Bodyweight</option>
              <option value="weighted">Weighted</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Exercise</Button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomExerciseModal;
