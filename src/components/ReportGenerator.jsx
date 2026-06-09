import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export default function ReportGenerator({
  expenses,
  summary,
  monthlyTotal,
}) {
  const [selectedDate, setSelectedDate] = useState("");

  // ====================================
  // FULL REPORT
  // ====================================

  const generateFullReport = async () => {
    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);

    pdf.text(
      "Wallet Buddy Expense Report",
      14,
      20
    );

    pdf.setDrawColor(200);
    pdf.line(14, 25, 195, 25);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
      `Generated: ${new Date().toLocaleDateString(
        "en-IN"
      )}`,
      14,
      35
    );

    pdf.text(
      `Total Spent: Rs. ${(summary?.total || 0).toLocaleString(
        "en-IN"
      )}`,
      14,
      48
    );

    pdf.text(
      `This Month: Rs. ${monthlyTotal.toLocaleString(
        "en-IN"
      )}`,
      14,
      58
    );

    pdf.text(
      `Top Category: ${
        summary?.topCategory?._id || "N/A"
      }`,
      14,
      68
    );

    pdf.text(
      `Transactions: ${expenses.length}`,
      14,
      78
    );

    // ======================
    // DAILY TREND GRAPH
    // ======================

    const graph = document.getElementById(
      "daily-chart-container"
    );

    if (graph) {
      const canvas = await html2canvas(graph, {
        scale: 2,
      });

      const image =
        canvas.toDataURL("image/png");

      pdf.addImage(
        image,
        "PNG",
        15,
        90,
        180,
        60
      );
    }

    // ======================
    // TRANSACTION TABLE
    // ======================

    autoTable(pdf, {
      startY: 160,

      head: [[
        "Date",
        "Category",
        "Description",
        "Amount",
      ]],

      body: expenses.map((e) => [
  new Date(
    e.expenseDate
  ).toLocaleDateString("en-IN"),

  e.category,
  e.description || "-",
  `Rs. ${Number(e.amount).toLocaleString("en-IN")}`,
]),

      styles: {
        font: "helvetica",
        fontSize: 10,
      },

      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    pdf.save(
      "WalletBuddy_Full_Report.pdf"
    );
  };

  // ====================================
  // DAILY REPORT
  // ====================================

  const generateDailyReport = () => {
    if (!selectedDate) {
      alert("Select a date first");
      return;
    }

    const filteredExpenses = expenses.filter((expense) => {
  const expenseDate = new Date(expense.expenseDate);

  const formattedDate =
    expenseDate.getFullYear() +
    "-" +
    String(expenseDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(expenseDate.getDate()).padStart(2, "0");

  return formattedDate === selectedDate;
});

    const total =
      filteredExpenses.reduce(
        (sum, e) => sum + e.amount,
        0
      );

    const pdf = new jsPDF();

    // TITLE

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);

    pdf.text(
      "Wallet Buddy Daily Statement",
      14,
      20
    );

    pdf.setDrawColor(200);
    pdf.line(14, 25, 195, 25);

    // CONTENT

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    const formattedDate =
      new Date(selectedDate).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

    pdf.text(
      `Date: ${formattedDate}`,
      14,
      40
    );

    pdf.text(
      `Total Spent: Rs. ${total.toLocaleString(
        "en-IN"
      )}`,
      14,
      52
    );

    pdf.text(
      `Transactions: ${filteredExpenses.length}`,
      14,
      64
    );

    // TABLE

    autoTable(pdf, {
      startY: 80,

      head: [[
        "Category",
        "Description",
        "Amount",
      ]],

      body: filteredExpenses.map((e) => [
        e.category,

        e.description || "-",

        `Rs. ${Number(
          e.amount
        ).toLocaleString("en-IN")}`,
      ]),

      styles: {
        font: "helvetica",
        fontSize: 10,
      },

      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    pdf.save(
      `Statement_${selectedDate}.pdf`
    );
  };

  return (
    <div className="flex flex-col gap-4">

      {/* FULL REPORT */}

      <button
        onClick={generateFullReport}
        className="
        bg-green-600
        text-white
        px-4 py-2
        rounded-lg
        hover:bg-green-700
        transition
        "
      >
        Download Full Report
      </button>

      {/* DAILY REPORT */}

      <div className="flex gap-3 items-center">

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
          className="
          border
          rounded-lg
          px-3 py-2
          "
        />

        <button
          onClick={generateDailyReport}
          className="
          bg-blue-600
          text-white
          px-4 py-2
          rounded-lg
          hover:bg-blue-700
          transition
          "
        >
          Download Daily Statement
        </button>

      </div>

    </div>
  );
}