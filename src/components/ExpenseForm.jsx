import { useState } from "react";
import { addExpense } from "../services/api";

export default function ExpenseForm({ onAdd }) {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // 📅 DATE
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ⏰ TIME
  const [time, setTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );

  const handleSubmit = async () => {

    try {

      if (!amount || !category) {
        alert("Amount and category are required");
        return;
      }

      // 🔥 COMBINE DATE + TIME
      const fullDateTime = new Date(`${date}T${time}`);

      await addExpense({
        amount: Number(amount),
        category,
        description,
        createdAt: fullDateTime,
      });

      setAmount("");
      setCategory("");
      setDescription("");

      // reset date/time
      setDate(new Date().toISOString().split("T")[0]);

      setTime(
        new Date().toTimeString().slice(0, 5)
      );

      onAdd();

    } catch (err) {

      console.error(
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        "Error adding expense"
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">

      <h3 className="text-lg font-semibold mb-3">
        Add Expense
      </h3>

      <div className="flex gap-2 flex-wrap">

        {/* AMOUNT */}
        <input
          type="number"
          className="border p-2 rounded flex-1 min-w-[120px]"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* CATEGORY */}
        <input
          className="border p-2 rounded flex-1 min-w-[120px]"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* DESCRIPTION */}
        <input
          className="border p-2 rounded flex-1 min-w-[180px]"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 rounded 
          hover:bg-blue-600 transition"
        >
          Add
        </button>

      </div>
    </div>
  );
}