import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DailyChart({ data }) {
  const formattedData = data
    .filter((item) => item && item._id)
    .map((item) => {
      const [day, month, year] =
        item._id.split("-");

      return {
        originalDate: new Date(
          year,
          month - 1,
          day
        ),
        date: item._id, // ✅ IMPORTANT
        total: item.total,
      };
    })
    .sort(
      (a, b) =>
        a.originalDate - b.originalDate
    );

  return (
    <ResponsiveContainer
      width="100%"
      height={250}
    >
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip
          formatter={(value) => `₹${value}`}
          labelFormatter={(label) =>
            `Date: ${label}`
          }
        />

        <Line
          type="monotone"
          dataKey="total"
          stroke="#10b981"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}