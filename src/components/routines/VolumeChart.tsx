import ReactECharts from "echarts-for-react";

interface Props {
  data: any[];
}

const VolumeChart = ({ data }: Props) => {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="font-mono">No data yet. Log your first routine!</p>
      </div>
    );
  }

  const xAxisData = data.map((item) => item.date);
  const volumeValues = data.map((item) => item.volume);

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#fff' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
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
        fillerColor: 'rgba(59, 130, 246, 0.2)',
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
        name: 'Volume',
        type: 'bar',
        barWidth: '60%',
        data: volumeValues,
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0]
        }
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

export default VolumeChart;
