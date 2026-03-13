"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Dumbbell,
  Apple,
  Calendar,
  Clock,
  TrendingUp,
  User,
  Heart,
  Activity,
  Shield,
  Sparkles,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Types
interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
}

interface MealExample {
  meal: string;
  example: string;
}

interface WorkoutPlan {
  title: string;
  weekly_schedule: WorkoutDay[];
  description: string;
}

interface DietPlan {
  title: string;
  daily_calories: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  meal_examples: MealExample[];
  description: string;
}

interface Program {
  id: number;
  first_name: string;
  profilePic: string;
  fitness_goal: string;
  height: string;
  weight: string;
  age: number;
  workout_days: number;
  injuries: string;
  fitness_level: string;
  equipment_access: string;
  dietary_restrictions: string;
  workout_plan: WorkoutPlan;
  diet_plan: DietPlan;
}

// Corner Elements Component
const CornerElements = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary/40"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary/40"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-primary/40"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary/40"></div>
    </>
  );
};

// Main Component
const ProgramDetailPage = () => {
  const [programId, setProgramId] = useState<number>(1);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    const foundProgram = USER_PROGRAMS.find((p) => p.id === programId);
    if (foundProgram) {
      setProgram(foundProgram as unknown as Program);
    }
    setIsLoading(false);
  }, [programId]);

  const handleBack = (): void => {
    router.push("/");
  };

  const handleGenerateProgram = (): void => {
    router.push("/generate-program");
  };

  const handleProgramChange = (id: number): void => {
    setIsLoading(true);
    setProgramId(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-16 text-center font-mono">
        <h1 className="text-3xl font-bold mb-4 text-primary">ERROR: PROGRAM_NOT_FOUND</h1>
        <p className="text-muted-foreground mb-8">Verification failed for requested data block.</p>
        <Button onClick={handleBack} className="bg-primary text-primary-foreground rounded-md">
          <ArrowLeft className="mr-2 h-4 w-4" />
          RETURN_TO_BASE
        </Button>
      </div>
    );
  }

  return (
    <section className="relative z-10 pt-12 pb-32 grow container mx-auto px-4">
      {/* Demo: Program Selector */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-mono tracking-widest">SELECT_BLOCK:</span>
        {[1, 2, 3].map((id) => (
          <Button
            key={id}
            onClick={() => handleProgramChange(id)}
            variant={programId === id ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-md font-mono text-[10px]",
              programId === id ? "bg-primary text-primary-foreground" : "border-primary/20 text-muted-foreground"
            )}
          >
            PROC_{id}
          </Button>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={handleBack}
        variant="outline"
        className="mb-8 border-primary/20 hover:border-primary rounded-md font-mono text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="mr-2 h-4 w-4 text-primary" />
        ESC_CHANNEL
      </Button>

      {/* Header Section */}
      <div className="relative backdrop-blur-sm border border-border rounded-none p-8 mb-8">
        <CornerElements />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="h-40 w-40 rounded-none overflow-hidden border-2 border-primary/40 relative">
            <img
              src={program.profilePic}
              alt={program.first_name}
              className="h-full w-full object-cover grayscale opacity-80"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-bold mb-4 tracking-tighter">
              <span className="text-foreground">{program.first_name.toUpperCase()}</span>
              <span className="text-primary">.exe</span>
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-muted-foreground mb-6 font-mono text-[10px] tracking-[0.2em]">
              <div className="flex items-center gap-2 group">
                <User className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>AGE_{program.age}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Activity className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>LEVEL_{program.fitness_level.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Calendar className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>FREQ_{program.workout_days}D/WK</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-5 py-2.5 bg-primary/20 rounded-none border border-primary/40 text-primary font-mono text-xs font-bold tracking-widest">
                <Sparkles className="inline h-4 w-4 mr-2" />
                {program.fitness_goal.toUpperCase()}
              </div>
              <div className="px-5 py-2.5 bg-background/50 rounded-none border border-border text-muted-foreground font-mono text-xs tracking-widest">
                <Shield className="inline h-4 w-4 mr-2" />
                {program.equipment_access.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/50">
          {[
            { label: "HEIGHT", value: program.height },
            { label: "WEIGHT", value: program.weight },
            { label: "INJURIES", value: program.injuries.toUpperCase() },
            { label: "DIETARY", value: program.dietary_restrictions.toUpperCase() },
          ].map((stat) => (
            <div key={stat.label} className="text-center group p-4 border border-transparent hover:border-primary/10 transition-colors">
              <p className="text-[10px] text-muted-foreground font-mono mb-2 tracking-[.25em] group-hover:text-primary transition-colors">
                {stat.label}
              </p>
              <p className="text-sm font-bold text-foreground font-mono">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Tabs */}
      <div className="relative backdrop-blur-sm border border-border rounded-none p-6">
        <CornerElements />

        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="mb-8 w-full grid grid-cols-2 bg-background/50 rounded-lg p-1">
            <TabsTrigger
              value="workout"
              className="rounded-md py-4 font-mono text-[10px] tracking-[0.3em] data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-transparent data-[state=active]:border-primary/40 uppercase"
            >
              <Dumbbell className="mr-3 h-4 w-4" />
              WORKOUT_PLAN
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="rounded-md py-4 font-mono text-[10px] tracking-[0.3em] data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-transparent data-[state=active]:border-primary/40 uppercase"
            >
              <Apple className="mr-3 h-4 w-4" />
              DIET_PLAN
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border border-border rounded-none p-8 bg-background/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="h-16 w-16" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-none bg-primary animate-pulse"></div>
                <h3 className="text-2xl font-bold text-primary font-mono tracking-tighter">
                  {program.workout_plan.title.toUpperCase()}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl border-l-2 border-primary/20 pl-6 py-1">
                {program.workout_plan.description}
              </p>
            </div>

            <div>
              <h4 className="font-mono font-bold text-foreground mb-6 flex items-center gap-3 text-xs tracking-[0.4em] uppercase opacity-80">
                <Calendar className="h-5 w-5 text-primary" />
                WEEKLY_PROTOCOL_FLOW
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.workout_plan.weekly_schedule.map((day, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-none p-6 bg-background/50 hover:border-primary/40 hover:bg-primary/[0.02] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-3 h-3 bg-primary/10 group-hover:bg-primary/30 transition-all transform rotate-45 translate-x-1.5 -translate-y-1.5" />
                    <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
                      <h5 className="font-bold text-primary font-mono tracking-widest text-sm">
                        {day.day.toUpperCase()}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-border/20 px-2 py-1">
                        <Clock className="h-3 w-3 text-primary/60" />
                        {day.duration.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 border border-primary/10 group-hover:border-primary/30 transition-colors">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-foreground font-medium text-sm tracking-tight">
                        {day.focus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="border border-border rounded-none p-6 bg-primary/5 relative group overflow-hidden">
                <CornerElements />
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="h-24 w-24" />
                </div>
                <p className="text-[10px] font-mono text-primary mb-6 tracking-[0.3em] border-b border-primary/20 pb-2 inline-block">INTENSITY_METRICS</p>
                <div className="flex justify-between items-end relative z-10">
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold tracking-tighter text-foreground">{program.workout_days}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-2 font-mono">SESSIONS_PER_WEEK</span>
                  </div>
                  <div className="flex gap-1.5 items-end h-16">
                    {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                      <div key={i} className="w-2.5 bg-primary/30 hover:bg-primary/60 transition-colors" style={{ height: `${h * 100}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-none p-6 bg-background/50 relative group">
                <CornerElements />
                <p className="text-[10px] font-mono text-primary mb-6 tracking-[0.3em] border-b border-primary/20 pb-2 inline-block">EQUIPMENT_LOCK</p>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-none group-hover:border-primary/40 transition-colors">
                    <Shield className="h-8 w-8 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-widest font-mono text-foreground mb-1">{program.equipment_access.toUpperCase()}</p>
                    <p className="text-[10px] text-muted-foreground font-mono tracking-widest">STATUS: <span className="text-emerald-500">FULLY_OPTIMIZED</span></p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diet" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border border-border rounded-none p-8 bg-background/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Apple className="h-16 w-16" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-none bg-primary animate-pulse"></div>
                <h3 className="text-2xl font-bold text-primary font-mono tracking-tighter">
                  {program.diet_plan.title.toUpperCase()}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl border-l-2 border-primary/20 pl-6 py-1">
                {program.diet_plan.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 border border-border rounded-none p-8 bg-background/50 flex flex-col justify-center text-center relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/10 group-hover:bg-primary transition-all duration-500" />
                <p className="font-mono text-[10px] text-muted-foreground mb-4 tracking-[0.3em] uppercase">
                  DAILY_CALORIC_CEILING
                </p>
                <p className="text-6xl font-bold text-primary tracking-tighter mb-2">
                  {program.diet_plan.daily_calories.split(" ")[0]}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground tracking-[0.5em] opacity-60">KCAL_LOGGED / 24H</p>
              </div>

              <div className="md:col-span-7 border border-border rounded-none p-8 bg-background/50 relative">
                <p className="font-mono text-[10px] text-muted-foreground mb-6 tracking-[0.3em] border-b border-primary/10 pb-2 inline-block">
                  MACRONUTRIENT_OPTIMIZATION
                </p>
                <div className="space-y-6">
                  {[
                    { label: "PROTEIN", value: program.diet_plan.macros.protein, color: "bg-primary" },
                    { label: "CARBS", value: program.diet_plan.macros.carbs, color: "bg-primary/60" },
                    { label: "FATS", value: program.diet_plan.macros.fats, color: "bg-primary/30" }
                  ].map((macro) => (
                    <div key={macro.label} className="group/macro">
                      <div className="flex justify-between items-center text-[10px] mb-2 font-mono tracking-widest">
                        <span className="text-muted-foreground group-hover/macro:text-primary transition-colors">{macro.label}</span>
                        <span className="font-bold text-foreground">{macro.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-border/40 rounded-none overflow-hidden">
                        <div className={cn("h-full rounded-none transition-all duration-1000", macro.color)} style={{ width: macro.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-mono font-bold text-foreground mb-6 flex items-center gap-3 text-xs tracking-[0.4em] uppercase opacity-80">
                <Sparkles className="h-5 w-5 text-primary" />
                SAMPLE_NUTRITION_LOG
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.diet_plan.meal_examples.map((meal, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-none p-6 bg-background/50 relative group hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-none bg-primary opacity-40 group-hover:opacity-100 transition-opacity"></div>
                      <h5 className="font-mono font-bold text-primary text-[10px] tracking-[0.3em]">
                        {meal.meal.toUpperCase()}
                      </h5>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed border-l border-border/40 pl-6 group-hover:border-primary/40 transition-colors">
                      {meal.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-none p-6 bg-primary/5 relative group">
              <CornerElements />
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 border border-primary/20">
                  <Heart className="h-5 w-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] mb-1">
                    BIOLOGICAL_SYSTEM_CONSTRAINTS
                  </p>
                  <p className="font-bold text-foreground text-xs uppercase tracking-widest font-mono">
                    {program.dietary_restrictions || "NONE_DETECTED"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <div className="relative backdrop-blur-sm border border-border rounded-none p-12 overflow-hidden group">
          <CornerElements />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 -rotate-45 translate-x-24 -translate-y-24 group-hover:bg-primary/10 transition-all duration-700" />
          <h3 className="text-4xl font-bold mb-6 font-mono tracking-tighter">
            <span className="text-foreground">INITIALIZE </span>
            <span className="text-primary">PERSONAL_PROTOCOL</span>
          </h3>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-xs leading-relaxed uppercase tracking-[0.25em] font-mono opacity-70">
            Get a personalized program tailored to your unique biological profile, just like
            <span className="text-primary ml-2 font-bold">{program.first_name}</span>
          </p>
          <Button
            onClick={handleGenerateProgram}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 text-xl font-bold rounded-md relative overflow-hidden group/btn shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.5)] transition-all"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
            <Sparkles className="mr-3 h-6 w-6" />
            <span className="font-mono tracking-widest">GENERATE_MY_PROGRAM.exe</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramDetailPage;
