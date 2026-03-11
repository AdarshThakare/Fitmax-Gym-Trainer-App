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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { streak, lastActiveDate, monthlyActivity, dailyLogCounts } = useStreak(routines);

    const exercises = useMemo(() => {
        // Find the routine that corresponds to the same day as selectedDate using the reliable string parser
        const targetRoutine = routines.find(r => isSameDay(new Date(r.date), selectedDate));
        const isToday = isSameDay(selectedDate, new Date());

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
            { id: "pushups", label: "Pushups (Reps)", data: pushupsData },
            { id: "crunches", label: "Crunches (Reps)", data: crunchesData },
            { id: "squats", label: "Squats (Reps)", data: squatsData },
            { id: "weightlifts", label: "Weight Lifting (Reps)", data: weightliftsData },
            { id: "runningTime", label: "Running Duration (Mins)", data: runningData },
            { id: "runningDistance", label: "Running Distance (Km)", data: runningDistance },
            { id: "cyclingTime", label: "Cycling Duration (Mins)", data: cyclingData },
            { id: "cyclingDistance", label: "Cycling Distance (Km)", data: cyclingDistance },
        ];

        return defaultEx;
    }, [routines, pushupSets, weightliftSets, cardioSets, crunchesSets, squatsSets, selectedDate]);

    // Handle bounds if custom exercises are deleted
    useEffect(() => {
        if (currentIndex >= exercises.length) {
            setCurrentIndex(0);
        }
    }, [exercises.length, currentIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? exercises.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === exercises.length - 1 ? 0 : prev + 1));
    };

    const currentExercise = exercises[currentIndex] || exercises[0];

    const chartOptions = useMemo(() => {
        const data = currentExercise.data;
        const categories = data.map((_, i) => `Set ${i + 1}`);

        return {
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
                                { offset: 0, color: "#3b82f6" }, // top
                                { offset: 1, color: "#1d4ed8" }, // bottom
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
        let bestDay = 0;
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
            if (dayTotal > bestDay) bestDay = dayTotal;
        }

        return { bestSet, bestDay, activeDaysCount };
    }, [routines, currentExercise.id]);

    return (
        <div className="bg-card w-full rounded-xl border shadow-sm p-4 relative flex flex-col items-center">

            {/* Header with Date Picker */}
            <div className="flex w-full items-center justify-between mb-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Carousel Controls */}
            <div className="flex w-full items-center justify-between mb-4 mt-2">
                <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold tracking-tight text-center">
                        {currentExercise.label}
                    </h3>
                    <span className="text-muted-foreground text-sm font-normal">
                        {isSameDay(selectedDate, new Date()) ? "Today's" : format(selectedDate, "MMM do")} Sets Tracker
                    </span>
                </div>
                <button
                    onClick={handleNext}
                    className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
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
                    <div className="bg-secondary/20 p-4 rounded-lg flex flex-col justify-center border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Lifetime Best Set</span>
                        <div className="text-2xl font-bold">{stats.bestSet.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{currentExercise.label.split("(")[1]?.replace(")", "") || "Reps"}</span></div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg flex flex-col justify-center border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Lifetime Best Day</span>
                        <div className="text-2xl font-bold">{stats.bestDay.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{currentExercise.label.split("(")[1]?.replace(")", "") || "Reps"}</span></div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg flex flex-col justify-center border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Days</span>
                        <div className="text-2xl font-bold">{stats.activeDaysCount} <span className="text-sm font-normal text-muted-foreground">Days</span></div>
                    </div>
                </div>
                <div className="md:col-span-2 border py-2 px-4 rounded-lg overflow-hidden h-full">
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
