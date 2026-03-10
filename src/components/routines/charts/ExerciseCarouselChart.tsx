import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Routine {
    date: string;
    pushups: number;
    weightlifts: number;
    cardio: number;
    runningTime?: number;
    runningDistance?: number;
    cyclingTime?: number;
    cyclingDistance?: number;
    custom: number;
    crunches?: number;
    squats?: number;
    pushupSetsDetail?: { reps: number; type: string }[];
    weightliftSetsDetail?: { reps: number; weight?: string; type: string }[];
    cardioSetsDetail?: { cardioType: string; reps: number; distance?: string }[];
    crunchesSetsDetail?: { reps: number; type: string }[];
    squatsSetsDetail?: { reps: number; type: string }[];
    customSetsDetail?: {
        id: string;
        name: string;
        type: string;
        sets: { reps: number; weight?: string; type: string }[]
    }[];
}

interface Props {
    routines: Routine[];
    pushupSets: { reps: number; type: string }[];
    weightliftSets: { reps: number; weight?: string; type: string }[];
    cardioSets: { cardioType: "running" | "cycling"; reps: number; distance?: string }[];
    crunchesSets: { reps: number; type: string }[];
    squatsSets: { reps: number; type: string }[];
    customExercises: {
        id: string;
        name: string;
        type: "weighted" | "bodyweight" | "duration";
        sets: { reps: number; weight?: string; type: string }[];
    }[];
}

const ExerciseCarouselChart = ({
    routines,
    pushupSets,
    weightliftSets,
    cardioSets,
    crunchesSets,
    squatsSets,
    customExercises,
}: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const exercises = useMemo(() => {
        const todayStr = new Date().toDateString();
        const todayRoutine = routines.find(r => r.date === todayStr);

        const pushupsData = [
            ...(todayRoutine?.pushupSetsDetail?.map(s => s.reps) || []),
            ...pushupSets.filter(s => s.reps > 0).map(s => s.reps)
        ];
        const crunchesData = [
            ...(todayRoutine?.crunchesSetsDetail?.map(s => s.reps) || []),
            ...crunchesSets.filter(s => s.reps > 0).map(s => s.reps)
        ];
        const squatsData = [
            ...(todayRoutine?.squatsSetsDetail?.map(s => s.reps) || []),
            ...squatsSets.filter(s => s.reps > 0).map(s => s.reps)
        ];
        const weightliftsData = [
            ...(todayRoutine?.weightliftSetsDetail?.map(s => s.reps) || []),
            ...weightliftSets.filter(s => s.reps > 0).map(s => s.reps)
        ];

        const runningData = [
            ...(todayRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "running").map(s => s.reps) || []),
            ...cardioSets.filter(c => c.cardioType === "running" && c.reps > 0).map(c => c.reps)
        ];
        const runningDistance = [
            ...(todayRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "running").map(s => parseFloat(s.distance || "0")) || []),
            ...cardioSets.filter(c => c.cardioType === "running" && parseFloat(c.distance || "0") > 0).map(c => parseFloat(c.distance || "0"))
        ];
        const cyclingData = [
            ...(todayRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "cycling").map(s => s.reps) || []),
            ...cardioSets.filter(c => c.cardioType === "cycling" && c.reps > 0).map(c => c.reps)
        ];
        const cyclingDistance = [
            ...(todayRoutine?.cardioSetsDetail?.filter(c => c.cardioType === "cycling").map(s => parseFloat(s.distance || "0")) || []),
            ...cardioSets.filter(c => c.cardioType === "cycling" && parseFloat(c.distance || "0") > 0).map(c => parseFloat(c.distance || "0"))
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

        const mappedCustomEx = customExercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets.filter(s => s.reps > 0)
        })).filter(ex => ex.sets.length > 0);

        const mergedCustomData: typeof defaultEx = [];

        // Combine saved custom exercises and live custom exercises
        const allCustomExIds = Array.from(new Set([
            ...(todayRoutine?.customSetsDetail || []).map(ex => ex.id),
            ...mappedCustomEx.map(ex => ex.id)
        ]));

        for (const id of allCustomExIds) {
            const savedEx = (todayRoutine?.customSetsDetail || []).find(ex => ex.id === id);
            const liveEx = mappedCustomEx.find(ex => ex.id === id);
            const name = savedEx?.name || liveEx?.name || "Custom";
            const savedReps = savedEx?.sets.map(s => s.reps) || [];
            const liveReps = liveEx?.sets.map(s => s.reps) || [];

            mergedCustomData.push({
                id,
                label: `${name} (Reps)`,
                data: [...savedReps, ...liveReps]
            });
        }

        return [...defaultEx, ...mergedCustomData];
    }, [routines, pushupSets, weightliftSets, cardioSets, crunchesSets, squatsSets, customExercises]);

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

    return (
        <div className="bg-card w-full rounded-xl border shadow-sm p-4 relative flex flex-col items-center">
            <div className="flex w-full items-center justify-between mb-4">
                <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold tracking-tight text-center">
                    {currentExercise.label} <span className="text-muted-foreground text-sm font-normal block">Today's Sets Tracker</span>
                </h3>
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
        </div>
    );
};

export default ExerciseCarouselChart;
