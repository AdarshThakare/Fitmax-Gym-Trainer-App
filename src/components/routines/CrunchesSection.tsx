import SectionWrapper from "./SectionWrapper";
import SetRow from "./SetRow";
import AddSetButton from "./AddSetButton";
import { MoveDown } from "lucide-react"; // Using an appropriate icon

interface Props {
    sets: { reps: number }[];
    onAdd(): void;
    onRemove(index: number): void;
    onUpdate(index: number, value: string): void;
}

const CrunchesSection = ({ sets, onAdd, onRemove, onUpdate }: Props) => {
    return (
        <SectionWrapper title="CRUNCHES" icon={MoveDown}>
            <div className="space-y-3">
                {sets.map((set, index) => (
                    <SetRow
                        key={index}
                        label={`SET ${index + 1}`}
                        value={set.reps}
                        placeholder="Reps"
                        onChange={(v) => onUpdate(index, v)}
                        onRemove={sets.length > 1 ? () => onRemove(index) : undefined}
                    />
                ))}
            </div>

            <AddSetButton onClick={onAdd} />
        </SectionWrapper>
    );
};

export default CrunchesSection;
