import { ExerciseDBItem } from "./CustomExercisesSection";
import CornerElements from "../CornerElements";

interface Props {
    exercise: ExerciseDBItem | null;
}

const CustomExerciseDetailsPanel = ({ exercise }: Props) => {
    if (!exercise) {
        return (
            <div className="flex flex-col gap-6 w-full md:sticky md:top-24 md:mt-0 lg:-mt-2 h-[400px] border rounded-none items-center justify-center p-6 text-center shadow-sm bg-card relative overflow-hidden">
                <CornerElements />
                <h3 className="text-xl font-bold tracking-tight text-foreground/80">No Exercise Selected</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">Select any exercise from the Body Parts categories on the left to view its details here.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full md:sticky md:top-24 md:mt-0 lg:-mt-2 bg-card border rounded-none shadow-sm p-6 overflow-hidden max-h-[calc(100vh-8rem)] overflow-y-auto relative">
            <CornerElements />
            <h2 className="text-2xl font-bold tracking-tight capitalize border-b pb-4">{exercise.name}</h2>

            <div className="flex justify-center bg-white rounded-none p-2 overflow-hidden border">
                <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full max-w-[300px] rounded-none object-cover"
                />
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <div>
                    <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Target Muscles</h4>
                    <div className="flex flex-wrap gap-2">
                        {exercise.targetMuscles.map(m => (
                            <span key={`target-${m}`} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium capitalize border border-primary/20">
                                {m}
                            </span>
                        ))}
                        {exercise.secondaryMuscles.map(m => (
                            <span key={`sec-${m}`} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium capitalize border border-secondary">
                                {m}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Equipment Needed</h4>
                    <div className="flex flex-wrap gap-2">
                        {exercise.equipments.map(e => (
                            <span key={`eq-${e}`} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs font-medium capitalize">
                                {e}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Instructions</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
                        {exercise.instructions.map((step, i) => {
                            const cleanStep = step.replace(/^\d+\.\s*/, "").replace(/^[Ss]tep:?\s*\d+\s*/i, "");
                            return (
                                <li key={`inst-${i}`} className="leading-relaxed">{cleanStep}</li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default CustomExerciseDetailsPanel;
