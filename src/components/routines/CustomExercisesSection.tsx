import { Activity, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AddCustomExerciseModal from "./AddCustomExerciseModal";
import { useDebounce } from "@/hooks/useDebounce";
import CornerElements from "../CornerElements";
import { Input } from "@/components/ui/input";

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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<ExerciseDBItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cache check for bodyparts
    const cachedBodyParts = localStorage.getItem("fitmax_bodyparts");
    if (cachedBodyParts) {
      setBodyParts(JSON.parse(cachedBodyParts));
    } else {
      axios.get("https://www.exercisedb.dev/api/v1/bodyparts")
        .then((res) => {
          if (res.data.success && res.data.data) {
            const data = res.data.data.map((d: { name: string }) => d.name);
            setBodyParts(data);
            localStorage.setItem("fitmax_bodyparts", JSON.stringify(data));
          }
        })
        .catch(console.error);
    }

    // Cache check for muscles
    const cachedMuscles = localStorage.getItem("fitmax_muscles");
    if (cachedMuscles) {
      setMuscles(JSON.parse(cachedMuscles));
    } else {
      axios.get("https://www.exercisedb.dev/api/v1/muscles")
        .then((res) => {
          if (res.data.success && res.data.data) {
            const data = res.data.data.map((d: { name: string }) => d.name);
            setMuscles(data);
            localStorage.setItem("fitmax_muscles", JSON.stringify(data));
          }
        })
        .catch(console.error);
    }
  }, []);

  // Fuzzy Search Effect
  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 1) {
      setIsSearching(true);
      setShowDropdown(true);
      axios.get(`https://www.exercisedb.dev/api/v1/exercises?search=${debouncedSearchQuery}&limit=10`)
        .then((res) => {
          if (res.data.success && res.data.data) {
            setSearchResults(res.data.data);
          } else {
            setSearchResults([]);
          }
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [debouncedSearchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBodyPartClick = async (part: string) => {
    setActiveMuscle(null);
    setSearchQuery("");
    setShowDropdown(false);
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
    setSearchQuery("");
    setShowDropdown(false);
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

  const handleRecommendationClick = (ex: ExerciseDBItem) => {
    setActiveBodyPart(null);
    setActiveMuscle(null);
    setExercisesList([ex]);
    setSearchQuery(ex.name);
    setShowDropdown(false);
    if (onSelectExerciseDetails) {
      onSelectExerciseDetails(ex);
    }
  };

  return (
    <>
      {/* Search Input Container */}
      <div className="relative mb-6 group">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search all exercises (e.g. 'Bench Press', 'Squat')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-primary/20 focus-visible:ring-primary rounded-md"
          />
          {isSearching && <Loader2 className="absolute rounded-full right-3 w-4 h-4 animate-spin text-primary" />}
        </div>

        {/* Dropdown Recommendations */}
        {showDropdown && (searchResults.length > 0 || isSearching) && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-card border border-primary/30 z-[100] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1"
          >
            <div className="max-h-[300px] overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 rounded-full animate-spin" />
                  Searching exercises...
                </div>
              ) : (
                searchResults.map((ex) => (
                  <div
                    key={ex.exerciseId}
                    onClick={() => handleRecommendationClick(ex)}
                    className="p-3 hover:bg-primary/10 cursor-pointer border-b border-border/50 last:border-0 transition-colors flex flex-col"
                  >
                    <span className="font-bold text-sm capitalize text-foreground">{ex.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex gap-2">
                      <span>{ex.bodyParts[0]}</span>
                      <span className="text-primary/50">/</span>
                      <span>{ex.targetMuscles[0]}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
            {/* Corner highlights for dropdown if needed or just sharp edges */}
            <div className="h-0.5 bg-primary/20 w-full" />
          </div>
        )}
      </div>

      <div className="mb-8 p-5 bg-card border rounded-none shadow-sm relative overflow-hidden">
        <CornerElements />
        <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2 relative z-10">
          <Activity className="w-4 h-4 text-primary" />
          Body Part Categories
        </h3>
        <div className="relative z-10">
          {bodyParts.length === 0 ? (
            <div className="flex gap-2 animate-pulse overflow-hidden">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-20 bg-secondary" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {bodyParts.map((part) => {
                const isActive = activeBodyPart === part;
                return (
                  <Tooltip key={part} delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "outline"}
                        onClick={() => handleBodyPartClick(part)}
                        className={`capitalize text-xs font-medium rounded-md h-8 px-4 transition-all border ${isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-black/40 text-white border-primary/30 hover:bg-primary/20 hover:text-white"
                          }`}
                      >
                        {part}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-0 border shadow-xl rounded-md overflow-hidden bg-card z-50 animate-in fade-in-0 zoom-in-95">
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
        </div>

        <h3 className="text-sm font-bold text-muted-foreground mb-4 mt-8 uppercase tracking-wider flex items-center gap-2 relative z-10">
          <Activity className="w-4 h-4 text-primary" />
          Target Muscle Categories
        </h3>
        <div className="relative z-10">
          {muscles.length === 0 ? (
            <div className="flex gap-2 animate-pulse overflow-hidden">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-20 bg-secondary" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {muscles.map((muscle) => {
                const isActive = activeMuscle === muscle;
                return (
                  <Tooltip key={muscle} delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "outline"}
                        onClick={() => handleMuscleClick(muscle)}
                        className={`capitalize text-xs font-medium rounded-md h-8 px-4 transition-all border ${isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-black/40 text-white border-primary/30 hover:bg-primary/20 hover:text-white"
                          }`}
                      >
                        {muscle}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-0 border shadow-xl rounded-md overflow-hidden bg-card z-50 animate-in fade-in-0 zoom-in-95">
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
      </div>

      {(activeBodyPart || activeMuscle || (exercisesList.length > 0 && searchQuery)) && (
        <div className="mb-8 p-5 bg-card border rounded-none shadow-sm relative overflow-hidden">
          <CornerElements />
          <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2 relative z-10">
            <Activity className="w-4 h-4 text-primary" />
            Exercises: {searchQuery || activeBodyPart || activeMuscle}
          </h3>
          <div className="relative z-10">
            {isFetchingExercises ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : exercisesList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {exercisesList.map((ex) => (
                  <div
                    key={ex.exerciseId}
                    className="p-3 border border-primary/10 rounded-none bg-background/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col justify-between h-full"
                    onClick={() => onSelectExerciseDetails && onSelectExerciseDetails(ex)}
                  >
                    <p className="font-bold text-sm capitalize mb-3 line-clamp-2">{ex.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-primary hover:text-primary hover:bg-primary/20 h-7 mt-auto rounded-md border border-primary/20"
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
        </div>
      )}

      {/* Reused Modal customized dynamically for selected DB exercises */}
      <AddCustomExerciseModal
        open={!!selectedExerciseToAdd}
        onClose={() => setSelectedExerciseToAdd(null)}
        onSubmit={(data: { name: string; type: "weighted" | "bodyweight" | "duration" }) => {
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
