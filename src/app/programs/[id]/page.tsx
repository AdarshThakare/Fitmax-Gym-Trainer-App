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
  // Simulate getting ID from URL - in actual Next.js, you'd use useParams()
  const [programId, setProgramId] = useState<number>(1);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    // In a real Next.js app, you'd get this from useParams()
    // For this demo, you can change the programId state to test different programs
    const foundProgram = USER_PROGRAMS.find((p) => p.id === programId);

    if (foundProgram) {
      setProgram(foundProgram);
    }
    setIsLoading(false);
  }, [programId]);

  const handleBack = (): void => {
    router.push("/");
  };

  const handleGenerateProgram = (): void => {
    router.push("/generate-program");
  };

  // Program selector for demo purposes
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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-foreground">
          Program Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The program you're looking for doesn't exist.
        </p>
        <Button
          onClick={handleBack}
          className="bg-primary text-primary-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Main Screen
        </Button>
      </div>
    );
  }

  return (
    <section className="relative z-10 pt-12 pb-32 grow container mx-auto px-4">
      {/* Demo: Program Selector */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm text-muted-foreground font-mono">
          SELECT PROGRAM:
        </span>
        {[1, 2, 3].map((id) => (
          <Button
            key={id}
            onClick={() => handleProgramChange(id)}
            variant={programId === id ? "default" : "outline"}
            size="sm"
            className={
              programId === id
                ? "bg-primary text-primary-foreground"
                : "border-primary/20"
            }
          >
            Program {id}
          </Button>
        ))}
      </div>

      {/* Back Button */}
      <Button
        onClick={handleBack}
        variant="outline"
        className="mb-6 border-primary/20 hover:border-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Main Screen
      </Button>

      {/* Header Section */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-8 mb-8">
        <CornerElements />

        <div className="flex items-start gap-6 mb-6">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/40">
            <img
              src={program.profilePic}
              alt={program.first_name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-foreground">{program.first_name}</span>
              <span className="text-primary">.exe</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{program.age} years old</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>{program.fitness_level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{program.workout_days} days/week</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-primary/20 rounded border border-primary/40 text-primary font-mono">
                <Sparkles className="inline h-4 w-4 mr-2" />
                {program.fitness_goal}
              </div>
              <div className="px-4 py-2 bg-background/50 rounded border border-border text-muted-foreground font-mono">
                <Shield className="inline h-4 w-4 mr-2" />
                {program.equipment_access}
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono mb-1">
              HEIGHT
            </p>
            <p className="text-lg font-bold text-primary">{program.height}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono mb-1">
              WEIGHT
            </p>
            <p className="text-lg font-bold text-primary">{program.weight}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono mb-1">
              INJURIES
            </p>
            <p className="text-lg font-bold text-foreground">
              {program.injuries}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono mb-1">
              DIETARY
            </p>
            <p className="text-lg font-bold text-foreground">
              {program.dietary_restrictions}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Tabs */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
        <CornerElements />

        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2 bg-background border">
            <TabsTrigger
              value="workout"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Dumbbell className="mr-2 h-4 w-4" />
              Workout Plan
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Apple className="mr-2 h-4 w-4" />
              Diet Plan
            </TabsTrigger>
          </TabsList>

          {/* Workout Plan Tab */}
          <TabsContent value="workout">
            <div className="space-y-6">
              {/* Plan Title & Description */}
              <div className="border border-border rounded-lg p-6 bg-background/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <h3 className="text-xl font-bold text-primary">
                    {program.workout_plan.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {program.workout_plan.description}
                </p>
              </div>

              {/* Weekly Schedule */}
              <div>
                <h4 className="font-mono font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  WEEKLY SCHEDULE
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.workout_plan.weekly_schedule.map((day, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-5 bg-background/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-primary font-mono">
                          {day.day.toUpperCase()}
                        </h5>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {day.duration}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <p className="text-foreground font-medium">
                          {day.focus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Info */}
              <div className="border border-border rounded-lg p-5 bg-primary/5">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">
                      EQUIPMENT REQUIRED
                    </p>
                    <p className="font-bold text-foreground">
                      {program.equipment_access}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Diet Plan Tab */}
          <TabsContent value="diet">
            <div className="space-y-6">
              {/* Plan Title & Description */}
              <div className="border border-border rounded-lg p-6 bg-background/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <h3 className="text-xl font-bold text-primary">
                    {program.diet_plan.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {program.diet_plan.description}
                </p>
              </div>

              {/* Calorie & Macros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-5 bg-background/50">
                  <p className="font-mono text-xs text-muted-foreground mb-2">
                    DAILY TARGET
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {program.diet_plan.daily_calories}
                  </p>
                </div>

                <div className="border border-border rounded-lg p-5 bg-background/50">
                  <p className="font-mono text-xs text-muted-foreground mb-3">
                    MACROS SPLIT
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Protein
                      </span>
                      <span className="font-bold text-foreground">
                        {program.diet_plan.macros.protein}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Carbs
                      </span>
                      <span className="font-bold text-foreground">
                        {program.diet_plan.macros.carbs}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Fats
                      </span>
                      <span className="font-bold text-foreground">
                        {program.diet_plan.macros.fats}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Examples */}
              <div>
                <h4 className="font-mono font-bold text-foreground mb-4 flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  MEAL EXAMPLES
                </h4>

                <div className="space-y-4">
                  {program.diet_plan.meal_examples.map((meal, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-5 bg-background/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <h5 className="font-mono font-bold text-primary">
                          {meal.meal.toUpperCase()}
                        </h5>
                      </div>
                      <p className="text-muted-foreground pl-4">
                        {meal.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="border border-border rounded-lg p-5 bg-primary/5">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">
                      DIETARY RESTRICTIONS
                    </p>
                    <p className="font-bold text-foreground">
                      {program.dietary_restrictions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <div className="relative backdrop-blur-sm border border-border rounded-lg p-8">
          <CornerElements />
          <h3 className="text-2xl font-bold mb-4">
            <span className="text-foreground">Ready to start your own </span>
            <span className="text-primary">fitness journey?</span>
          </h3>
          <p className="text-muted-foreground mb-6">
            Get a personalized program tailored to your goals, just like{" "}
            {program.first_name}
          </p>
          <Button
            onClick={handleGenerateProgram}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Your Program
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramDetailPage;
