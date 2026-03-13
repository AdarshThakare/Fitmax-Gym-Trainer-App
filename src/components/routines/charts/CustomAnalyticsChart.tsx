import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak";
import StreakCard from "@/components/routines/StreakCard";
import CornerElements from "../../CornerElements";

interface Routine {
    date: string;
    customSetsDetail?: {
        id: string;
        name: string;
        type: string;
        sets: { reps: number; weight?: string; type: string }[]
    }[];
}

interface Props {
    routines: Routine[];
    customExercises: {
        id: string;
        name: string;
        type: "weighted" | "bodyweight" | "duration";
        sets: { reps: number; weight?: string; type: string }[];
    }[];
}

const CustomAnalyticsChart = ({ routines, customExercises }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { streak, lastActiveDate, monthlyActivity, dailyLogCounts } = useStreak(routines as any[]);

    const exercises = useMemo(() => {
        const targetRoutine = routines.find(r => isSameDay(new Date(r.date), selectedDate));
        const isToday = isSameDay(selectedDate, new Date());

        const mappedCustomEx = isToday
            ? customExercises.map(ex => ({
                id: ex.id,
                name: ex.name,
                sets: ex.sets.filter(s => s.reps > 0)
            })).filter(ex => ex.sets.length > 0)
            : [];

        const mergedCustomData: { id: string; label: string; data: number[] }[] = [];

        const allCustomExIds = Array.from(new Set([
            ...(targetRoutine?.customSetsDetail || []).map(ex => ex.id),
            ...mappedCustomEx.map(ex => ex.id)
        ]));

        for (const id of allCustomExIds) {
            const savedEx = (targetRoutine?.customSetsDetail || []).find(ex => ex.id === id);
            const liveEx = mappedCustomEx.find(ex => ex.id === id);
            const name = savedEx?.name || liveEx?.name || "Custom";
            const savedReps = savedEx?.sets.map(s => s.reps) || [];
            const liveReps = liveEx?.sets.map(s => s.reps) || [];

            mergedCustomData.push({
                id,
                label: `${name} (Reps/Duration)`,
                data: [...savedReps, ...liveReps]
            });
        }

        return mergedCustomData;
    }, [routines, customExercises, selectedDate]);

    useEffect(() => {
        if (currentIndex >= exercises.length && exercises.length > 0) {
            setCurrentIndex(0);
        }
    }, [exercises.length, currentIndex]);

    // Reset carousel index whenever user picks a new date
    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedDate]);

    const activeExercise = exercises[currentIndex];

    const chartOptions = useMemo(() => {
        if (!activeExercise || activeExercise.data.length === 0) return {};

        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                borderColor: "#374151",
                textStyle: { color: "#F9FAFB" },
                formatter: (params: any) => {
                    const setIndex = params[0].name;
                    const value = params[0].value;
                    return `<b>${setIndex}</b><br/>${activeExercise.label}: ${value}`;
                }
            },
            grid: {
                top: 40,
                right: 20,
                bottom: 30,
                left: 40,
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: activeExercise.data.map((_, i) => `Set ${i + 1}`),
                axisLine: { lineStyle: { color: "#9CA3AF" } },
                axisLabel: { color: "#9CA3AF" },
            },
            yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
                axisLabel: { color: "#9CA3AF" },
                minInterval: 1,
            },
            series: [
                {
                    data: activeExercise.data,
                    type: "bar",
                    barMaxWidth: 60,
                    itemStyle: {
                        color: "#06b6d4",
                        borderRadius: 0
                    },
                    animationDuration: 500,
                }
            ],
            color: ["#06b6d4"]
        };
    }, [activeExercise]);

    // Compute custom exercise stats
    const stats = useMemo(() => {
        let bestSet = 0;
        let maxVolume = 0;
        let activeDaysCount = 0;

        if (!activeExercise) return { bestSet, maxVolume, activeDaysCount };

        for (const r of routines) {
            let dayTotal = 0;
            let dayHasActivity = false;

            if (r.customSetsDetail) {
                const targetSavedEx = r.customSetsDetail.find(ex => ex.id === activeExercise.id);
                if (targetSavedEx) {
                    for (const s of targetSavedEx.sets) {
                        if (s.reps > bestSet) bestSet = s.reps;
                        dayTotal += s.reps;
                    }
                    if (targetSavedEx.sets.length > 0) dayHasActivity = true;
                }
            }

            if (dayHasActivity) activeDaysCount++;
            if (dayTotal > maxVolume) maxVolume = dayTotal;
        }

        return { bestSet, maxVolume, activeDaysCount };
    }, [routines, activeExercise]);

    return (
        <div className="bg-card w-full border rounded-none shadow-sm p-6 flex flex-col items-center relative overflow-hidden">
            <CornerElements />
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 w-full border-b border-border/50 pb-4">
                <div className="flex items-center bg-secondary/30 rounded-lg p-1 border border-border">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-background"
                        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : exercises.length - 1))}
                        disabled={exercises.length <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="w-48 text-center text-sm font-semibold truncate px-2 capitalize font-mono">
                        {activeExercise ? activeExercise.label.split(" (")[0] : "No Data Yet"}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-background"
                        onClick={() => setCurrentIndex((prev) => (prev < exercises.length - 1 ? prev + 1 : 0))}
                        disabled={exercises.length <= 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[220px] justify-start text-left font-normal bg-background/50 border-border rounded-none outline-none",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {selectedDate ? format(selectedDate, "PPP") : <span className="font-mono">Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none border-border" align="end">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) setSelectedDate(date);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="h-[300px] w-full">
                {!activeExercise || activeExercise.data.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground font-mono space-y-2">
                        <p className="font-medium text-primary">No custom exercises recorded.</p>
                        <p className="text-xs">Add exercises from Explore and log sets to track!</p>
                    </div>
                ) : (
                    <ReactECharts
                        option={chartOptions}
                        style={{ height: "100%", width: "100%" }}
                        notMerge={true}
                    />
                )}
            </div>

            {/* Dynamic Stats Row & Streak */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 items-stretch">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-secondary/20 p-4 rounded-none flex flex-col justify-center border border-border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 font-mono">Lifetime Best Set</span>
                        <div className="text-2xl font-bold font-mono">{stats.bestSet} <span className="text-sm font-normal text-muted-foreground capitalize">{activeExercise?.label.split(" (")[1]?.replace(")", "") || "Reps"}</span></div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-none flex flex-col justify-center border border-border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 font-mono">Max Volume</span>
                        <div className="text-2xl font-bold font-mono">{stats.maxVolume} <span className="text-sm font-normal text-muted-foreground">Total</span></div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-none flex flex-col justify-center border border-border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 font-mono">Active Days</span>
                        <div className="text-2xl font-bold font-mono">{stats.activeDaysCount} <span className="text-sm font-normal text-muted-foreground">Days</span></div>
                    </div>
                </div>

                <div className="md:col-span-2 py-2 px-4 border border-border rounded-none overflow-hidden h-full relative">
                    <StreakCard
                        compact
                        streak={streak}
                        lastActiveDate={lastActiveDate}
                        monthlyActivity={monthlyActivity as Record<string, Record<number, boolean>>}
                        dailyLogCounts={dailyLogCounts as Record<string, number>}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomAnalyticsChart;
