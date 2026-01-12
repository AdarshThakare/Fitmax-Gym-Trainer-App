import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />
        <Legend />
        <Area dataKey="pushups" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
        <Area
          dataKey="weightlifts"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
        />
        <Area dataKey="cardio" stackId="1" stroke="#ef4444" fill="#ef4444" />
        <Area dataKey="custom" stackId="1" stroke="#10b981" fill="#10b981" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendsChart;
