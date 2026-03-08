import ReactECharts from "echarts-for-react";

interface Props {
  data: { name: string; value: number; color: string }[];
}

const DistributionChart = ({ data }: Props) => {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="font-mono">No data yet. Log your first routine!</p>
      </div>
    );
  }

  // Format data for ECharts Pie
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
    itemStyle: { color: item.color }
  }));

  const options = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#fff' },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#888' },
    },
    series: [
      {
        name: 'Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#111', // Background match to provide gap effect
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData
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

export default DistributionChart;
