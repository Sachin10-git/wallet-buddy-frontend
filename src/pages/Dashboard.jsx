import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExpenses,
  deleteExpense,
  updateExpense,
  getSmartAnalytics,
  getDailyAnalytics,
  getMonthlyTotal,
} from "../services/api";

import Chart from "../components/Chart";
import ExpenseForm from "../components/ExpenseForm";
import DailyChart from "../components/DailyChart";
import ReportGenerator from "../components/ReportGenerator";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  // 🔥 NEW STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔄 Fetch data
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const [expRes, smartRes, dailyRes, monthlyRes] = await Promise.all([
        getExpenses(),
        getSmartAnalytics(),
        getDailyAnalytics(),
        getMonthlyTotal(),
      ]);

      setExpenses(expRes.data);
      setAnalytics(smartRes.data.categories);
      setSummary(smartRes.data);

      setDailyData(dailyRes.data);
      setMonthlyTotal(monthlyRes.data.total);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refreshData = () => {
    fetchAll();
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchAll();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = async (expense) => {
    const newAmount = prompt("Enter new amount", expense.amount);
    const newCategory = prompt("Enter new category", expense.category);
    const newDesc = prompt("Enter description", expense.description);

    if (!newAmount || !newCategory) return;

    try {
      await updateExpense(expense._id, {
        amount: newAmount,
        category: newCategory,
        description: newDesc,
      });

      fetchAll();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // 🔍 FILTERED EXPENSES
  const filteredExpenses = expenses.filter((expense) => {

  // 🔍 search
  const matchesSearch =
    expense.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    expense.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

  // 📂 category
  const matchesCategory =
    selectedCategory === "All" ||

    expense.category.toLowerCase() ===
      selectedCategory.toLowerCase();

  // 📅 date filter
const d = new Date(expense.createdAt);

const expenseDate =
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

const matchesDate =
  selectedDate === "" ||
  expenseDate === selectedDate;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesDate
  );
});

  return (
    <div
      className="min-h-screen p-6 pt-4 
      bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500"
    >

      {/* GLASS WRAPPER */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />

            <h2 className="text-3xl font-bold text-blue-600">
              Wallet Buddy
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg 
            hover:bg-red-600 hover:scale-105 transition"
          >
            Logout
          </button>
        </div>

        {/* CARDS */}
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <p className="text-gray-500">Total Spent</p>

              <h2 className="text-xl font-bold text-green-600">
                ₹{summary.total}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <p className="text-gray-500">Top Category</p>

              <h2 className="text-xl font-bold text-blue-600">
                {summary.topCategory?._id || "N/A"}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <p className="text-gray-500">This Week</p>

              <h2 className="text-xl font-bold text-purple-600">
                ₹{summary.thisWeek}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <p className="text-gray-500">This Month</p>

              <h2 className="text-xl font-bold text-orange-600">
                ₹{monthlyTotal}
              </h2>
            </div>

          </div>
        )}

        {/* FORM */}
        <div className="bg-white p-5 rounded-2xl shadow-md mb-6">
          <ExpenseForm onAdd={refreshData} />
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md mb-6">

  <h3 className="text-lg font-semibold mb-3">
    Reports
  </h3>

  <ReportGenerator
    expenses={expenses}
    summary={summary}
    monthlyTotal={monthlyTotal}
  />

</div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">

            {/* EXPENSES */}
            <div className="bg-white p-5 rounded-2xl shadow-md">

              <h3 className="text-lg font-semibold mb-4">
                Expenses
              </h3>

              {/* 🔍 SEARCH + FILTER */}
              <div className="flex gap-3 mb-4">

                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* FILTER */}
                <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border rounded-lg px-3 py-2 
  focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  <option value="All">All</option>

  {[
    ...new Set(
      expenses.map((e) => e.category)
    ),
  ].map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>
{/* 📅 DATE FILTER */}
<input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  className="border rounded-lg px-3 py-2 
  focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
              </div>

              {filteredExpenses.length === 0 ? (
                <p>No matching expenses found</p>
              ) : (
                filteredExpenses.map((e) => (
                  <div
                    key={e._id}
                    className="flex justify-between items-center border-b py-2"
                  >

                    <div>
  <p className="capitalize font-medium text-lg">
    {e.category}
  </p>

  {e.description && (
    <p className="text-sm text-gray-500 italic">
      {e.description}
    </p>
  )}

  {/* 🔥 DATE + TIME */}
  <p className="text-xs text-gray-400 mt-1">
    {new Date(e.createdAt).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })}
  </p>
</div>

                    <div className="flex items-center gap-4">

                      <span className="font-semibold">
                        ₹{e.amount}
                      </span>

                      <button
                        onClick={() => handleEdit(e)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(e._id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-6">

              {/* PIE */}
              <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col items-center">

                <h3 className="text-lg font-semibold mb-4">
                  Category Breakdown
                </h3>

                <div id="pie-chart-container" className="w-full">
  <Chart data={analytics} />
</div>
              </div>

              {/* DAILY */}
              <div className="bg-white p-5 rounded-2xl shadow-md">

                <h3 className="text-lg font-semibold mb-4">
                  Daily Spending Trend
                </h3>

                 <div id="daily-chart-container">

    {dailyData.length > 0 ? (
      <DailyChart data={dailyData} />
    ) : (
      <p>No daily data</p>
    )}

  </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}