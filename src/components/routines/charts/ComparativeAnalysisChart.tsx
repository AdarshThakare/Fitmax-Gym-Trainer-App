import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface Routine {
    date: string;
    pushups: number;
    weightlifts: number;
    runningTime?: number;
    cyclingTime?: number;
    crunches?: number;
    squats?: number;
}

interface Props {
    routines: Routine[];
}

const ComparativeAnalysisChart = ({ routines }: Props) => {
    const chartOptions = useMemo(() => {
        const todayStr = new Date().toDateString();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        const getMetrics = (dateStr: string) => {
            const dayData = routines.filter((r) => r.date === dateStr);
            return dayData.reduce(
                (acc, r) => ({
                    pushups: acc.pushups + (r.pushups || 0),
                    weights: acc.weights + (r.weightlifts || 0),
                    crunches: acc.crunches + (r.crunches || 0),
                    squats: acc.squats + (r.squats || 0),
                    runTime: acc.runTime + (r.runningTime || 0),
                    cycleTime: acc.cycleTime + (r.cyclingTime || 0),
                }),
                { pushups: 0, weights: 0, crunches: 0, squats: 0, runTime: 0, cycleTime: 0 }
            );
        };

        const todayMetrics = getMetrics(todayStr);
        const yesterdayMetrics = getMetrics(yesterdayStr);

        // Compute maximums dynamically for radar scaling
        const maxPushups = Math.max(10, todayMetrics.pushups, yesterdayMetrics.pushups) * 1.2;
        const maxWeights = Math.max(10, todayMetrics.weights, yesterdayMetrics.weights) * 1.2;
        const maxCrunches = Math.max(10, todayMetrics.crunches, yesterdayMetrics.crunches) * 1.2;
        const maxSquats = Math.max(10, todayMetrics.squats, yesterdayMetrics.squats) * 1.2;
        const maxRun = Math.max(10, todayMetrics.runTime, yesterdayMetrics.runTime) * 1.2;
        const maxCycle = Math.max(10, todayMetrics.cycleTime, yesterdayMetrics.cycleTime) * 1.2;

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
                indicator: [
                    { name: "Pushups", max: maxPushups },
                    { name: "Lifts", max: maxWeights },
                    { name: "Crunches", max: maxCrunches },
                    { name: "Squats", max: maxSquats },
                    { name: "Run (min)", max: maxRun },
                    { name: "Cycle (min)", max: maxCycle },
                ],
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
                            value: [
                                todayMetrics.pushups,
                                todayMetrics.weights,
                                todayMetrics.crunches,
                                todayMetrics.squats,
                                todayMetrics.runTime,
                                todayMetrics.cycleTime,
                            ],
                            name: "Today",
                            itemStyle: { color: "#3b82f6" }, // Blue
                            areaStyle: { color: "rgba(59, 130, 246, 0.3)" },
                        },
                        {
                            value: [
                                yesterdayMetrics.pushups,
                                yesterdayMetrics.weights,
                                yesterdayMetrics.crunches,
                                yesterdayMetrics.squats,
                                yesterdayMetrics.runTime,
                                yesterdayMetrics.cycleTime,
                            ],
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

export default ComparativeAnalysisChart;
