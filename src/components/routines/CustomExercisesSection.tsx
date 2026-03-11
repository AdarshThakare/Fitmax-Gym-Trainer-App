import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AddCustomExerciseModal from "./AddCustomExerciseModal";

export interface ExerciseDBItem {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

interface Props {
  onAddExercise(data: any): void;
  onSelectExerciseDetails?: (exercise: ExerciseDBItem) => void;
}

const CustomExercisesSection = ({
  onAddExercise,
  onSelectExerciseDetails,
}: Props) => {
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [activeBodyPart, setActiveBodyPart] = useState<string | null>(null);
  const [activeMuscle, setActiveMuscle] = useState<string | null>(null);
  const [exercisesList, setExercisesList] = useState<ExerciseDBItem[]>([]);
  const [isFetchingExercises, setIsFetchingExercises] = useState(false);
  const [selectedExerciseToAdd, setSelectedExerciseToAdd] = useState<{
    name: string;
    exerciseId: string;
  } | null>(null);

  useEffect(() => {
    axios.get("https://www.exercisedb.dev/api/v1/bodyparts")
      .then((res) => {
        if (res.data.success && res.data.data) {
          setBodyParts(res.data.data.map((d: { name: string }) => d.name));
        }
      })
      .catch(console.error);

    axios.get("https://www.exercisedb.dev/api/v1/muscles")
      .then((res) => {
        if (res.data.success && res.data.data) {
          setMuscles(res.data.data.map((d: { name: string }) => d.name));
        }
      })
      .catch(console.error);
  }, []);

  const handleBodyPartClick = async (part: string) => {
    setActiveMuscle(null);
    if (activeBodyPart === part) {
      setActiveBodyPart(null);
      setExercisesList([]);
      return;
    }
    setActiveBodyPart(part);
    setIsFetchingExercises(true);
    try {
      const res = await axios.get(`https://www.exercisedb.dev/api/v1/bodyparts/${part}/exercises?limit=15`);
      if (res.data.success && res.data.data) {
        setExercisesList(res.data.data);
      } else {
        setExercisesList([]);
      }
    } catch (err) {
      console.error(err);
      setExercisesList([]);
    } finally {
      setIsFetchingExercises(false);
    }
  };

  const handleMuscleClick = async (muscle: string) => {
    setActiveBodyPart(null);
    if (activeMuscle === muscle) {
      setActiveMuscle(null);
      setExercisesList([]);
      return;
    }
    setActiveMuscle(muscle);
    setIsFetchingExercises(true);
    try {
      const res = await axios.get(`https://www.exercisedb.dev/api/v1/muscles/${muscle}/exercises?limit=15`);
      if (res.data.success && res.data.data) {
        setExercisesList(res.data.data);
      } else {
        setExercisesList([]);
      }
    } catch (err) {
      console.error(err);
      setExercisesList([]);
    } finally {
      setIsFetchingExercises(false);
    }
  };

  return (
    <>
      <div className="mb-8 p-5 bg-card border rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Body Part Categories
        </h3>
        {bodyParts.length === 0 ? (
          <div className="flex gap-2 animate-pulse overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-20 bg-secondary rounded-full" />)}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {bodyParts.map((part) => {
              const isActive = activeBodyPart === part;
              return (
                <Tooltip key={part} delayDuration={1300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "outline"}
                      onClick={() => handleBodyPartClick(part)}
                      className={`capitalize text-xs font-medium rounded-full h-8 px-4 transition-all border ${isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-black text-white border-primary hover:bg-primary/20 hover:text-white"
                        }`}
                    >
                      {part}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-0 border shadow-xl rounded-xl overflow-hidden bg-card z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2">
                    <div className="w-[200px] flex flex-col">
                      <img
                        src={`https://placehold.co/400x300/2563eb/ffffff?text=${encodeURIComponent(part.toUpperCase())}`}
                        alt={part}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="p-3 bg-card border-t text-center">
                        <p className="font-bold text-sm capitalize">{part}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Focus Area</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        <h3 className="text-sm font-bold text-muted-foreground mb-4 mt-8 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Target Muscle Categories
        </h3>
        {muscles.length === 0 ? (
          <div className="flex gap-2 animate-pulse overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-20 bg-secondary rounded-full" />)}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {muscles.map((muscle) => {
              const isActive = activeMuscle === muscle;
              return (
                <Tooltip key={muscle} delayDuration={1300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "outline"}
                      onClick={() => handleMuscleClick(muscle)}
                      className={`capitalize text-xs font-medium rounded-full h-8 px-4 transition-all border ${isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-black text-white border-primary hover:bg-primary/20 hover:text-white"
                        }`}
                    >
                      {muscle}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-0 border shadow-xl rounded-xl overflow-hidden bg-card z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2">
                    <div className="w-[200px] flex flex-col">
                      <img
                        src={`https://placehold.co/400x300/eab308/ffffff?text=${encodeURIComponent(muscle.toUpperCase())}`}
                        alt={muscle}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="p-3 bg-card border-t text-center">
                        <p className="font-bold text-sm capitalize">{muscle}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Target Muscle</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>

      {(activeBodyPart || activeMuscle) && (
        <div className="mb-8 p-5 bg-card border rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Exercises: {activeBodyPart || activeMuscle}
          </h3>
          {isFetchingExercises ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : exercisesList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {exercisesList.map((ex) => (
                <div
                  key={ex.exerciseId}
                  className="p-3 border rounded-lg bg-background hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors flex flex-col justify-between h-full"
                  onClick={() => onSelectExerciseDetails && onSelectExerciseDetails(ex)}
                >
                  <p className="font-medium text-sm capitalize mb-3 line-clamp-2">{ex.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-primary hover:text-primary hover:bg-primary/20 h-7 mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExerciseToAdd({
                        name: ex.name,
                        exerciseId: ex.exerciseId || ex.name.toLowerCase().replace(/\s+/g, '-'),
                      });
                    }}
                  >
                    + Add to Log
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No exercises found.</p>
          )}
        </div>
      )}

      {/* Reused Modal customized dynamically for selected DB exercises */}
      <AddCustomExerciseModal
        open={!!selectedExerciseToAdd}
        onClose={() => setSelectedExerciseToAdd(null)}
        onSubmit={(data) => {
          onAddExercise({
            name: selectedExerciseToAdd?.name || data.name,
            type: data.type
          });
          setSelectedExerciseToAdd(null);
        }}
        prefilledName={selectedExerciseToAdd?.name}
      />
    </>
  );
};

export default CustomExercisesSection;
