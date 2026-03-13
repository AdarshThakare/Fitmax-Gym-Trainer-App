import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import CornerElements from "../CornerElements";

interface Routine {
    pushups: number;
    weightlifts: number;
    cardio: number;
    crunches?: number;
    squats?: number;
    [key: string]: any; // Allow other properties
}

interface Props {
    routines: Routine[];
}

const ActivityPieChart = ({ routines }: Props) => {
    const pieData = useMemo(() => {
        let pushups = 0;
        let weightlifts = 0;
        let cardio = 0;
        let crunches = 0;
        let squats = 0;

        for (const r of routines) {
            pushups += r.pushups || 0;
            weightlifts += r.weightlifts || 0;
            cardio += r.cardio || 0;
            crunches += r.crunches || 0;
            squats += r.squats || 0;
        }

        const data = [
            { value: pushups, name: "Pushups" },
            { value: weightlifts, name: "Weight Lifting" },
            { value: cardio, name: "Cardio" },
            { value: crunches, name: "Crunches" },
            { value: squats, name: "Squats" },
        ].filter(d => d.value > 0);

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
                name: "Activity Distribution",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 0,
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
        <div className="bg-card w-full rounded-none border shadow-sm p-4 relative flex flex-col items-center overflow-hidden">
            <CornerElements />
            <h3 className="text-lg font-bold tracking-tight text-center mb-4">
                Activity Distribution
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

export default ActivityPieChart;
