import React from "react";
import ReactECharts from "echarts-for-react";
import { PerformanceStats } from "@/hooks/usePerformanceStats";
import CornerElements from "../../CornerElements";

interface Props {
  stats: PerformanceStats;
}

const PerformanceRadarChart = ({ stats }: Props) => {
  const option = {
    backgroundColor: "transparent",
    color: ["#3b82f6", "#10b981", "#ff5900ff"],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(17, 24, 39, 0.8)",
      borderColor: "#374151",
      textStyle: { color: "#F9FAFB" },
    },
    legend: {
      data: ["Today", "Yesterday", "Personal Best"],
      bottom: 0,
      textStyle: { color: "#9CA3AF" },
      itemWidth: 10,
      itemHeight: 10,
    },
    radar: {
      indicator: stats.indicators,
      shape: "polygon",
      splitNumber: 5,
      axisName: {
        color: "#9CA3AF",
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      splitArea: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    series: [
      {
        name: "Performance Correlation",
        type: "radar",
        data: [
          {
            value: stats.today,
            name: "Today",
            areaStyle: {
              color: "rgba(59, 130, 246, 0.3)",
            },
            lineStyle: {
              width: 2,
            },
            symbolSize: 6,
          },
          {
            value: stats.yesterday,
            name: "Yesterday",
            lineStyle: {
              type: "dashed",
              width: 1,
            },
            symbol: "none",
          },
          {
            value: stats.personalBest,
            name: "Personal Best",
            lineStyle: {
              color: "rgba(99, 102, 241, 0.5)",
              width: 1,
            },
            symbol: "none",
            areaStyle: {
              color: "rgba(99, 102, 241, 0.05)",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="relative backdrop-blur-sm border border-border rounded-none p-6 bg-card/30 flex flex-col h-full overflow-hidden">
      <CornerElements />
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold tracking-tight">Performance Breakdown</h3>
      </div>
      <div className="flex-1 min-h-[300px] w-full">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
};

export default PerformanceRadarChart;
