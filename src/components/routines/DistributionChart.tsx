import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DistributionChart;
