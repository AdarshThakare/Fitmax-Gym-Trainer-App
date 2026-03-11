import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface Routine {
    customSetsDetail?: {
        id: string;
        name: string;
        type: string;
        sets: { reps: number; weight?: string; type: string }[]
    }[];
    [key: string]: any;
}

interface Props {
    routines: Routine[];
}

const CustomActivityPieChart = ({ routines }: Props) => {
    const pieData = useMemo(() => {
        const metricMap: Record<string, number> = {};

        for (const r of routines) {
            if (r.customSetsDetail) {
                for (const ex of r.customSetsDetail) {
                    if (!metricMap[ex.name]) {
                        metricMap[ex.name] = 0;
                    }

                    for (const s of ex.sets) {
                        metricMap[ex.name] += s.reps;
                    }
                }
            }
        }

        const data = Object.keys(metricMap).map(k => ({
            value: metricMap[k],
            name: k
        })).filter(d => d.value > 0);

        return data;
    }, [routines]);

    const chartOptions = {
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            borderColor: "#374151",
            textStyle: { color: "#F9FAFB" },
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            bottom: "0%",
            left: "center",
            textStyle: { color: "#9CA3AF" },
            type: "scroll",
            itemWidth: 10,
            itemHeight: 10,
            icon: "circle",
        },
        series: [
            {
                name: "Custom Activity Distribution",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: "transparent",
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#F9FAFB"
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieData.length > 0 ? pieData : [{ value: 0, name: "No Activity" }],
                color: [
                    "#2563eb", // primary blue
                    "#3b82f6", // bright blue
                    "#06b6d4", // cyan
                    "#14b8a6", // teal
                    "#6366f1", // indigo
                    "#8b5cf6", // violet
                    "#a855f7", // purple
                    "#ec4899"  // soft pink accent
                ]
            }
        ]
    };

    return (
        <div className="bg-card w-full rounded-xl border shadow-sm p-4 relative flex flex-col items-center">
            <h3 className="text-lg font-bold tracking-tight text-center mb-4">
                Custom Volume Distribution
            </h3>
            <div className="w-full h-[300px]">
                {pieData.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                        No activity detected yet.
                    </div>
                ) : (
                    <ReactECharts
                        option={chartOptions}
                        style={{ height: "100%", width: "100%" }}
                        notMerge={true}
                        lazyUpdate={true}
                    />
                )}
            </div>
        </div>
    );
};

export default CustomActivityPieChart;
