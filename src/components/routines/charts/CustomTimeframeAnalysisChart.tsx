import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import CornerElements from "../CornerElements";

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

type Timeframe = "weekly" | "monthly" | "yearly";

const CustomTimeframeAnalysisChart = ({ routines }: Props) => {
    const [timeframe, setTimeframe] = useState<Timeframe>("weekly");

    const chartOptions = useMemo(() => {
        let categories: string[] = [];
        let bodyweightData: number[] = [];
        let durationData: number[] = [];
        let liftingData: number[] = [];

        const now = new Date();

        const processRoutine = (r: Routine) => {
            let bw = 0, dur = 0, lf = 0;
            if (r.customSetsDetail) {
                r.customSetsDetail.forEach(ex => {
                    if (ex.type === "bodyweight") {
                        bw += ex.sets.reduce((sum, set) => sum + set.reps, 0);
                    } else if (ex.type === "duration") {
                        dur += ex.sets.reduce((sum, set) => sum + set.reps, 0);
                    } else if (ex.type === "weighted") {
                        lf += ex.sets.reduce((sum, set) => sum + set.reps, 0);
                    }
                });
            }
            return { bw, dur, lf };
        };

        if (timeframe === "weekly") {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                categories.push(`${d.toLocaleString('en-US', { weekday: 'short' })}`);

                const dateStr = d.toDateString();
                const dailyRoutines = routines.filter(r => new Date(r.date).toDateString() === dateStr);

                let bw = 0, dur = 0, lf = 0;
                dailyRoutines.forEach(r => {
                    const metrics = processRoutine(r);
                    bw += metrics.bw;
                    dur += metrics.dur;
                    lf += metrics.lf;
                });
                bodyweightData.push(bw);
                durationData.push(dur);
                liftingData.push(lf);
            }
        } else if (timeframe === "monthly") {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                categories.push(`Week ${4 - i}`);
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
                const weekEnd = new Date(now);
                weekEnd.setDate(weekEnd.getDate() - (i * 7));

                let bw = 0, dur = 0, lf = 0;
                routines.forEach(r => {
                    const rDate = new Date(r.date);
                    if (rDate >= weekStart && rDate <= weekEnd) {
                        const metrics = processRoutine(r);
                        bw += metrics.bw;
                        dur += metrics.dur;
                        lf += metrics.lf;
                    }
                });
                bodyweightData.push(bw);
                durationData.push(dur);
                liftingData.push(lf);
            }
        } else if (timeframe === "yearly") {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                categories.push(`${d.toLocaleString('en-US', { month: 'short' })}`);

                let bw = 0, dur = 0, lf = 0;
                routines.forEach(r => {
                    const rDate = new Date(r.date);
                    if (rDate.getMonth() === d.getMonth() && rDate.getFullYear() === d.getFullYear()) {
                        const metrics = processRoutine(r);
                        bw += metrics.bw;
                        dur += metrics.dur;
                        lf += metrics.lf;
                    }
                });
                bodyweightData.push(bw);
                durationData.push(dur);
                liftingData.push(lf);
            }
        }

        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "cross", label: { backgroundColor: "#6a7985" } },
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                borderColor: "#374151",
                textStyle: { color: "#F9FAFB" },
            },
            legend: {
                data: ["Bodyweight (Reps)", "Duration (Mins)", "Weights (Reps)"],
                textStyle: { color: "#9CA3AF" },
                bottom: 0,
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "15%",
                top: "5%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: categories,
                    axisLine: { lineStyle: { color: "#4B5563" } },
                    axisLabel: { color: "#9CA3AF" },
                },
            ],
            yAxis: [
                {
                    type: "value",
                    splitLine: { lineStyle: { color: "#374151", type: "dashed" } },
                    axisLabel: { color: "#9CA3AF" },
                },
            ],
            series: [
                {
                    name: "Bodyweight (Reps)",
                    type: "line",
                    stack: "Total",
                    areaStyle: {},
                    emphasis: { focus: "series" },
                    data: bodyweightData,
                    itemStyle: { color: "#34d399" }, // Emerald
                },
                {
                    name: "Duration (Mins)",
                    type: "line",
                    stack: "Total",
                    areaStyle: {},
                    emphasis: { focus: "series" },
                    data: durationData,
                    itemStyle: { color: "#f87171" }, // Red
                },
                {
                    name: "Weights (Reps)",
                    type: "line",
                    stack: "Total",
                    areaStyle: {},
                    emphasis: { focus: "series" },
                    data: liftingData,
                    itemStyle: { color: "#60a5fa" }, // Blue
                },
            ],
        };
    }, [routines, timeframe]);

    return (
        <div className="bg-card w-full rounded-none border shadow-sm p-4 relative flex flex-col items-center overflow-hidden">
            <CornerElements />
            <div className="flex w-full items-center justify-between mb-2">
                <h3 className="text-lg font-bold tracking-tight">Timeline Analytics</h3>
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                    {(["weekly", "monthly", "yearly"] as Timeframe[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${timeframe === t
                                    ? "bg-background text-foreground shadow-sm font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
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

export default CustomTimeframeAnalysisChart;
