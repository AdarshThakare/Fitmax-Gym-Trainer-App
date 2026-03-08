import ReactECharts from "echarts-for-react";

interface Props {
  data: any[];
}

const OverviewChart = ({ data }: Props) => {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="font-mono">No data yet. Log your first routine!</p>
      </div>
    );
  }

  const xAxisData = data.map((item) => item.date);
  const pushupsData = data.map((item) => item.pushups);
  const weightliftsData = data.map((item) => item.weightlifts);
  const cardioData = data.map((item) => item.cardio);
  const customData = data.map((item) => item.custom);

  const options = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#fff' },
    },
    legend: {
      data: ['Pushups', 'Weight Lifts', 'Cardio', 'Custom'],
      textStyle: { color: '#888' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%', // Make room for dataZoom
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: { lineStyle: { color: '#888' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#333', type: 'dashed' } },
      axisLine: { lineStyle: { color: '#888' } },
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: 'Pushups',
        type: 'line',
        smooth: true,
        data: pushupsData,
        itemStyle: { color: '#8b5cf6' },
        areaStyle: {
          color: 'rgba(139, 92, 246, 0.1)'
        }
      },
      {
        name: 'Weight Lifts',
        type: 'line',
        smooth: true,
        data: weightliftsData,
        itemStyle: { color: '#3b82f6' },
        areaStyle: {
          color: 'rgba(59, 130, 246, 0.1)'
        }
      },
      {
        name: 'Cardio',
        type: 'line',
        smooth: true,
        data: cardioData,
        itemStyle: { color: '#ef4444' },
        areaStyle: {
          color: 'rgba(239, 68, 68, 0.1)'
        }
      },
      {
        name: 'Custom',
        type: 'line',
        smooth: true,
        data: customData,
        itemStyle: { color: '#10b981' },
      }
    ]
  };

  return (
    <div className="w-full h-[350px]">
      <ReactECharts
        option={options}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default OverviewChart;
