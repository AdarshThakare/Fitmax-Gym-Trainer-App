import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import CornerElements from "../CornerElements";

interface Routine {
    date: string;
    pushups: number;
    weightlifts: number;
    cardio: number;
    runningTime?: number;
    cyclingTime?: number;
    custom: number;
    crunches?: number;
    squats?: number;
}

interface Props {
    routines: Routine[];
}

type Timeframe = "weekly" | "monthly" | "yearly";

const TimeframeAnalysisChart = ({ routines }: Props) => {
    const [timeframe, setTimeframe] = useState<Timeframe>("weekly");

    const chartOptions = useMemo(() => {
        let categories: string[] = [];
        let bodyweightData: number[] = [];
        let cardioData: number[] = [];
        let liftingData: number[] = [];

        const now = new Date();

        if (timeframe === "weekly") {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                categories.push(`${d.toLocaleString('en-US', { weekday: 'short' })}`); // Mon, Tue

                const dateStr = d.toDateString();
                const dailyRoutines = routines.filter(r => r.date === dateStr);

                let bw = 0, cr = 0, lf = 0;
                dailyRoutines.forEach(r => {
                    bw += (r.pushups || 0) + (r.crunches || 0) + (r.squats || 0);
                    cr += (r.cardio || 0) + (r.runningTime || 0) + (r.cyclingTime || 0);
                    lf += (r.weightlifts || 0) + (r.custom || 0);
                });
                bodyweightData.push(bw);
                cardioData.push(cr);
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

                let bw = 0, cr = 0, lf = 0;
                routines.forEach(r => {
                    const rDate = new Date(r.date);
                    if (rDate >= weekStart && rDate <= weekEnd) {
                        bw += (r.pushups || 0) + (r.crunches || 0) + (r.squats || 0);
                        cr += (r.cardio || 0) + (r.runningTime || 0) + (r.cyclingTime || 0);
                        lf += (r.weightlifts || 0) + (r.custom || 0);
                    }
                });
                bodyweightData.push(bw);
                cardioData.push(cr);
                liftingData.push(lf);
            }
        } else if (timeframe === "yearly") {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                categories.push(`${d.toLocaleString('en-US', { month: 'short' })}`);

                let bw = 0, cr = 0, lf = 0;
                routines.forEach(r => {
                    const rDate = new Date(r.date);
                    if (rDate.getMonth() === d.getMonth() && rDate.getFullYear() === d.getFullYear()) {
                        bw += (r.pushups || 0) + (r.crunches || 0) + (r.squats || 0);
                        cr += (r.cardio || 0) + (r.runningTime || 0) + (r.cyclingTime || 0);
                        lf += (r.weightlifts || 0) + (r.custom || 0);
                    }
                });
                bodyweightData.push(bw);
                cardioData.push(cr);
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
                data: ["Bodyweight", "Cardio (mins)", "Weights/Custom"],
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
                    name: "Bodyweight",
                    type: "line",
                    stack: "Total",
                    areaStyle: {},
                    emphasis: { focus: "series" },
                    data: bodyweightData,
                    itemStyle: { color: "#34d399" }, // Emerald
                },
                {
                    name: "Cardio (mins)",
                    type: "line",
                    stack: "Total",
                    areaStyle: {},
                    emphasis: { focus: "series" },
                    data: cardioData,
                    itemStyle: { color: "#f87171" }, // Red
                },
                {
                    name: "Weights/Custom",
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

export default TimeframeAnalysisChart;
