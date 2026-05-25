import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
];

export default function Chart({ data }) {

  // 🔥 TOTAL
  const total = data.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <div className="w-full">

      {/* DONUT CHART */}
      <div className="w-full h-[420px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="45%"
              innerRadius={85}
              outerRadius={125}
              paddingAngle={3}
              cornerRadius={10}
            >

              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            {/* TOOLTIP */}
            <Tooltip formatter={(value) => `₹${value}`} />

            {/* CENTER TEXT */}
            <text
              x="50%"
              y="43%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "34px",
                fontWeight: "700",
                fill: "#0f172a",
              }}
            >
              ₹{total.toLocaleString()}
            </text>

            <text
              x="50%"
              y="53%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "18px",
                fill: "#6b7280",
              }}
            >
              Total Spent
            </text>

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* 🔥 CLEAN CUSTOM LEGEND */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">

  {data.map((item, index) => (

    <div
      key={item._id}
      className="
bg-white
border border-gray-100
rounded-2xl
px-5 py-4
shadow-sm
hover:shadow-md
transition
flex items-center justify-between
gap-4
w-full
"
    >

      {/* LEFT SIDE */}
<div className="flex items-center gap-3">

  {/* COLOR */}
  <div
    className="w-4 h-4 rounded-md"
    style={{
      backgroundColor:
        COLORS[index % COLORS.length],
    }}
  />

  {/* CATEGORY */}
  <span className="
capitalize
text-gray-700
font-medium
text-base
break-words
">
    {item._id}
  </span>

</div>

      {/* AMOUNT */}
      <span className="
        font-bold
        text-gray-900
        ml-4
        whitespace-nowrap
      ">
        ₹{item.total.toLocaleString()}
      </span>

    </div>

  ))}

</div>

    </div>
  );
}