import {
  LineChart,
  Line,
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

const OverviewChart = ({ data }: Props) => {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="font-mono">No data yet. Log your first routine!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="pushups" stroke="#8b5cf6" />
        <Line type="monotone" dataKey="weightlifts" stroke="#3b82f6" />
        <Line type="monotone" dataKey="cardio" stroke="#ef4444" />
        <Line type="monotone" dataKey="custom" stroke="#10b981" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
