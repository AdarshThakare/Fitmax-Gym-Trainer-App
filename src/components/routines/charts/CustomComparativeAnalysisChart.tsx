import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

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
}

const CustomComparativeAnalysisChart = ({ routines }: Props) => {
    const chartOptions = useMemo(() => {
        const todayStr = new Date().toDateString();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        const getMetrics = (dateStr: string) => {
            const dayData = routines.filter((r) => new Date(r.date).toDateString() === dateStr);
            const metrics: Record<string, number> = {};
            
            dayData.forEach(r => {
                if (r.customSetsDetail) {
                    r.customSetsDetail.forEach(ex => {
                        if (!metrics[ex.name]) metrics[ex.name] = 0;
                        metrics[ex.name] += ex.sets.reduce((sum, set) => sum + set.reps, 0);
                    });
                }
            });
            return metrics;
        };

        const todayMetrics = getMetrics(todayStr);
        const yesterdayMetrics = getMetrics(yesterdayStr);

        // Get up to 6 distinct exercise names across today and yesterday
        const allExerciseNames = Array.from(new Set([...Object.keys(todayMetrics), ...Object.keys(yesterdayMetrics)]));
        const topExercises = allExerciseNames.slice(0, 6); // Take up to 6

        if (topExercises.length === 0) {
             return null; // Return null spec to handle empty state gracefully if needed, or fallback
        }

        const indicators = topExercises.map(name => {
            const maxVal = Math.max(10, todayMetrics[name] || 0, yesterdayMetrics[name] || 0) * 1.2;
            return { name: name.length > 12 ? name.substring(0, 10) + '...' : name, max: maxVal };
        });

        // Ensure we have at least 3 indicators for a valid radar, pad if necessary
        while (indicators.length > 0 && indicators.length < 3) {
            indicators.push({ name: `Metric ${indicators.length + 1}`, max: 10 });
        }

        if (indicators.length === 0) {
            return {};
        }

        const todayValues = topExercises.map(name => todayMetrics[name] || 0);
        const yesterdayValues = topExercises.map(name => yesterdayMetrics[name] || 0);
        
        // Pad values to match indicators if padded
        while (todayValues.length < indicators.length) { todayValues.push(0); }
        while (yesterdayValues.length < indicators.length) { yesterdayValues.push(0); }

        return {
            tooltip: {
                trigger: "item",
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                borderColor: "#374151",
                textStyle: { color: "#F9FAFB" },
            },
            legend: {
                data: ["Today", "Yesterday"],
                bottom: 0,
                textStyle: { color: "#9CA3AF" },
            },
            radar: {
                indicator: indicators,
                splitNumber: 4,
                axisName: { color: "#D1D5DB" },
                splitLine: {
                    lineStyle: { color: ["rgba(75, 85, 99, 0.3)", "rgba(75, 85, 99, 0.5)"] },
                },
                splitArea: { show: false },
                axisLine: { lineStyle: { color: "rgba(75, 85, 99, 0.5)" } },
            },
            series: [
                {
                    name: "Daily Comparison",
                    type: "radar",
                    data: [
                        {
                            value: todayValues,
                            name: "Today",
                            itemStyle: { color: "#3b82f6" }, // Blue
                            areaStyle: { color: "rgba(59, 130, 246, 0.3)" },
                        },
                        {
                            value: yesterdayValues,
                            name: "Yesterday",
                            itemStyle: { color: "#9CA3AF" }, // Gray
                            areaStyle: { color: "rgba(156, 163, 175, 0.2)" },
                            lineStyle: { type: "dashed" },
                        },
                    ],
                },
            ],
        };
    }, [routines]);

    if (!chartOptions || Object.keys(chartOptions).length === 0) {
        return (
             <div className="bg-card w-full rounded-xl border shadow-sm p-4 relative flex flex-col items-center">
                <div className="flex w-full items-center justify-between mb-2">
                    <h3 className="text-lg font-bold tracking-tight">Today vs Yesterday</h3>
                </div>
                <div className="w-full h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <p className="font-medium">Not enough data.</p>
                    <p className="text-sm">Log custom exercises to see comparative analytics.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card w-full rounded-xl border shadow-sm p-4 relative flex flex-col items-center">
            <div className="flex w-full items-center justify-between mb-2">
                <h3 className="text-lg font-bold tracking-tight">Today vs Yesterday</h3>
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

export default CustomComparativeAnalysisChart;
