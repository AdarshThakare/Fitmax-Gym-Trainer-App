import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import CornerElements from "../CornerElements";
import { format, isSameDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak";
import StreakCard from "@/components/routines/StreakCard";

interface Routine {
    date: string;
    pushups: number;
    weightlifts: number;
    cardio: number;
    runningTime?: number;
    cyclingTime?: number;
    cyclingDistance?: number;
    custom: number;
    createdAt: number;
    crunches?: number;
    squats?: number;
    pushupSetsDetail?: { reps: number; type: string }[];
    weightliftSetsDetail?: { reps: number; weight?: string; type: string }[];
    cardioSetsDetail?: { cardioType: string; reps: number; distance?: string }[];
    crunchesSetsDetail?: { reps: number; type: string }[];
    squatsSetsDetail?: { reps: number; type: string }[];
}

interface Props {
    routines: Routine[];
    pushupSets: { reps: number; type: string }[];
    weightliftSets: { reps: number; weight?: string; type: string }[];
    cardioSets: { cardioType: "running" | "cycling"; reps: number; distance?: string }[];
    crunchesSets: { reps: number; type: string }[];
    squatsSets: { reps: number; type: string }[];
}

const ExerciseCarouselChart = ({
    routines,
    pushupSets,
    weightliftSets,
    cardioSets,
    crunchesSets,
    squatsSets,
}: Props) => {
    const { streak, lastActiveDate, monthlyActivity, dailyLogCounts } = useStreak(routines);
    const [activeIndex, setActiveIndex] = useState(0);

    const exercises = useMemo(() => {
        // Find the routine that corresponds to the same day as selectedDate using the reliable string parser
        const targetRoutine = routines.find(r => isSameDay(new Date(r.date), new Date())); // Changed to new Date() for current day
        const isToday = isSameDay(new Date(), new Date()); // Always true for "today's" sets

        const pushupsData = [
            ...(targetRoutine?.pushupSetsDetail?.map(s => s.reps) || []),
            ...(isToday ? pushupSets.filter(s => s.reps > 0).map(s => s.reps) : [])
        ];
        const crunchesData = [
            ...(targetRoutine?.crunchesSetsDetail?.map(s => s.reps) || []),
            ...(isToday ? crunchesSets.filter(s => s.reps > 0).map(s => s.reps) : [])
        ];
        const squatsData = [
            ...(targetRoutine?.squatsSetsDetail?.map(s => s.reps) || []),
            ...(isToday ? squatsSets.filter(s => s.reps > 0).map(s => s.reps) : [])
        ];
        const weightliftsData = [
            ...(targetRoutine?.weightliftSetsDetail?.map(s => s.reps) || []),
            ...(isToday ? weightliftSets.filter(s => s.reps > 0).map(s => s.reps) : [])
        ];

        const runningData = [
            ...(targetRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "running").map(s => s.reps) || []),
            ...(isToday ? cardioSets.filter(c => c.cardioType === "running" && c.reps > 0).map(c => c.reps) : [])
        ];
        const runningDistance = [
            ...(targetRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "running").map(s => parseFloat(s.distance || "0")) || []),
            ...(isToday ? cardioSets.filter(c => c.cardioType === "running" && parseFloat(c.distance || "0") > 0).map(c => parseFloat(c.distance || "0")) : [])
        ];
        const cyclingData = [
            ...(targetRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "cycling").map(s => s.reps) || []),
            ...(isToday ? cardioSets.filter(c => c.cardioType === "cycling" && c.reps > 0).map(c => c.reps) : [])
        ];
        const cyclingDistance = [
            ...(targetRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "cycling").map(s => parseFloat(s.distance || "0")) || []),
            ...(isToday ? cardioSets.filter(c => c.cardioType === "cycling" && parseFloat(c.distance || "0") > 0).map(c => parseFloat(c.distance || "0")) : [])
        ];

        const defaultEx = [
            { id: "pushups", label: "Pushups (Reps)", data: pushupsData, color: "#3b82f6" },
            { id: "crunches", label: "Crunches (Reps)", data: crunchesData, color: "#ef4444" },
            { id: "squats", label: "Squats (Reps)", data: squatsData, color: "#8b5cf6" },
            { id: "weightlifts", label: "Weight Lifting (Reps)", data: weightliftsData, color: "#10b981" },
            { id: "runningTime", label: "Running Duration (Mins)", data: runningData, color: "#f59e0b" },
            { id: "runningDistance", label: "Running Distance (Km)", data: runningDistance, color: "#f59e0b" },
            { id: "cyclingTime", label: "Cycling Duration (Mins)", data: cyclingData, color: "#f59e0b" },
            { id: "cyclingDistance", label: "Cycling Distance (Km)", data: cyclingDistance, color: "#f59e0b" },
        ];

        return defaultEx;
    }, [routines, pushupSets, weightliftSets, cardioSets, crunchesSets, squatsSets]);

    // Handle bounds if custom exercises are deleted
    useEffect(() => {
        if (activeIndex >= exercises.length) {
            setActiveIndex(0);
        }
    }, [exercises.length, activeIndex]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? exercises.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === exercises.length - 1 ? 0 : prev + 1));
    };

    const currentExercise = exercises[activeIndex] || exercises[0];

    const chartOptions = useMemo(() => {
        const data = currentExercise.data;
        const categories = data.map((_, i) => `Set ${i + 1}`);

        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                borderColor: "#374151",
                textStyle: { color: "#F9FAFB" },
            },
            grid: {
                left: "5%",
                right: "5%",
                bottom: "10%",
                top: "15%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: categories,
                axisLine: { lineStyle: { color: "#4B5563" } },
                axisLabel: { color: "#9CA3AF" },
            },
            yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "#374151", type: "dashed" } },
                axisLabel: { color: "#9CA3AF" },
            },
            series: [
                {
                    name: currentExercise.label,
                    data: data,
                    type: "bar",
                    barMaxWidth: 60,
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: currentExercise.color }, // top
                                { offset: 1, color: currentExercise.color + "80" }, // bottom with transparency
                            ],
                        },
                        borderRadius: [4, 4, 0, 0],
                    },
                },
            ],
        };
    }, [currentExercise]);

    // Compute Stats dynamically for the selected exercise
    const stats = useMemo(() => {
        let bestSet = 0;
        let maxVolume = 0; // Renamed bestDay to maxVolume for clarity
        let activeDaysCount = 0;

        for (const r of routines) {
            let dayTotal = 0;
            let dayHasActivity = false;

            if (currentExercise.id === "pushups" && r.pushupSetsDetail) {
                for (const s of r.pushupSetsDetail) {
                    if (s.reps > bestSet) bestSet = s.reps;
                    dayTotal += s.reps;
                }
                if (r.pushupSetsDetail.length > 0) dayHasActivity = true;
            } else if (currentExercise.id === "crunches" && r.crunchesSetsDetail) {
                for (const s of r.crunchesSetsDetail) {
                    if (s.reps > bestSet) bestSet = s.reps;
                    dayTotal += s.reps;
                }
                if (r.crunchesSetsDetail.length > 0) dayHasActivity = true;
            } else if (currentExercise.id === "squats" && r.squatsSetsDetail) {
                for (const s of r.squatsSetsDetail) {
                    if (s.reps > bestSet) bestSet = s.reps;
                    dayTotal += s.reps;
                }
                if (r.squatsSetsDetail.length > 0) dayHasActivity = true;
            } else if (currentExercise.id === "weightlifts" && r.weightliftSetsDetail) {
                for (const s of r.weightliftSetsDetail) {
                    if (s.reps > bestSet) bestSet = s.reps;
                    dayTotal += s.reps;
                }
                if (r.weightliftSetsDetail.length > 0) dayHasActivity = true;
            } else if (currentExercise.id === "runningTime" && r.cardioSetsDetail) {
                for (const s of r.cardioSetsDetail) {
                    if (s.cardioType === "running") {
                        if (s.reps > bestSet) bestSet = s.reps;
                        dayTotal += s.reps;
                        dayHasActivity = true;
                    }
                }
            } else if (currentExercise.id === "runningDistance" && r.cardioSetsDetail) {
                for (const s of r.cardioSetsDetail) {
                    if (s.cardioType === "running") {
                        const dist = parseFloat(s.distance || "0");
                        if (dist > bestSet) bestSet = dist;
                        dayTotal += dist;
                        dayHasActivity = true;
                    }
                }
            } else if (currentExercise.id === "cyclingTime" && r.cardioSetsDetail) {
                for (const s of r.cardioSetsDetail) {
                    if (s.cardioType === "cycling") {
                        if (s.reps > bestSet) bestSet = s.reps;
                        dayTotal += s.reps;
                        dayHasActivity = true;
                    }
                }
            } else if (currentExercise.id === "cyclingDistance" && r.cardioSetsDetail) {
                for (const s of r.cardioSetsDetail) {
                    if (s.cardioType === "cycling") {
                        const dist = parseFloat(s.distance || "0");
                        if (dist > bestSet) bestSet = dist;
                        dayTotal += dist;
                        dayHasActivity = true;
                    }
                }
            }

            if (dayHasActivity) activeDaysCount++;
            if (dayTotal > maxVolume) maxVolume = dayTotal;
        }

        return { bestSet, maxVolume, activeDaysCount };
    }, [routines, currentExercise.id]);

    return (
        <div className="bg-card w-full border shadow-sm p-4 relative flex flex-col items-center overflow-hidden">
            <CornerElements />

            {/* Carousel Controls */}
            <div className="w-full flex items-center justify-between mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-bold tracking-tight">{currentExercise.label}</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="w-full h-[300px]">
                <ReactECharts
                    option={chartOptions}
                    style={{ height: "100%", width: "100%" }}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </div>

            {/* Dynamic Stats Row & Streak */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 items-stretch">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-secondary/20 p-4 rounded-none flex flex-col justify-center border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Lifetime Best Set</span>
                        <div className="text-2xl font-bold">{stats.bestSet} <span className="text-sm font-normal text-muted-foreground">{currentExercise.label.split("(")[1]?.replace(")", "") || "Reps"}</span></div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-none flex flex-col justify-center border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Max Volume</span>
                        <div className="text-2xl font-bold">{stats.maxVolume} <span className="text-sm font-normal text-muted-foreground">{currentExercise.label.split("(")[1]?.replace(")", "") || "Total"}</span></div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-none flex flex-col justify-center border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Days</span>
                        <div className="text-2xl font-bold">{stats.activeDaysCount} <span className="text-sm font-normal text-muted-foreground">Days</span></div>
                    </div>
                </div>
                <div className="md:col-span-2 border py-2 px-4 rounded-none overflow-hidden h-full">
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

export default ExerciseCarouselChart;
