import ReactECharts from "echarts-for-react";

interface Props {
  data: any[];
}

const TrendsChart = ({ data }: Props) => {
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
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#6a7985' }
      },
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
      bottom: '15%',
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
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
        bottom: 0,
        textStyle: { color: '#888' },
        borderColor: '#333',
        fillerColor: 'rgba(16, 185, 129, 0.2)',
      },
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
        stack: 'Total',
        areaStyle: {},
        smooth: true,
        emphasis: { focus: 'series' },
        data: pushupsData,
        itemStyle: { color: '#8b5cf6' },
      },
      {
        name: 'Weight Lifts',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        smooth: true,
        emphasis: { focus: 'series' },
        data: weightliftsData,
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Cardio',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        smooth: true,
        emphasis: { focus: 'series' },
        data: cardioData,
        itemStyle: { color: '#ef4444' },
      },
      {
        name: 'Custom',
        type: 'line',
        stack: 'Total',
        label: {
          show: false,
          position: 'top'
        },
        areaStyle: {},
        smooth: true,
        emphasis: { focus: 'series' },
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

export default TrendsChart;
