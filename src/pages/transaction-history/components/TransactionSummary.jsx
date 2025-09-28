import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const TransactionSummary = ({ summaryData, onExport }) => {
  // Helper to generate CSV content
  const generateCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Transactions", summaryData?.totalTransactions],
      ["Total Volume (INR)", summaryData?.totalVolume],
      ["Total Fees (INR)", summaryData?.totalFees],
      ["Net Profit/Loss (INR)", summaryData?.netProfitLoss],
      ["Average Transaction (INR)", summaryData?.averageTransaction],
      ["Success Rate (%)", summaryData?.successRate?.toFixed(1)],
      ["Total Properties", summaryData?.totalProperties],
      ["Active Investments", summaryData?.activeInvestments],
      ["Purchases", summaryData?.breakdown?.purchases],
      ["Purchase Amount (INR)", summaryData?.breakdown?.purchaseAmount],
      ["Sales", summaryData?.breakdown?.sales],
      ["Sale Amount (INR)", summaryData?.breakdown?.saleAmount],
      ["Dividends", summaryData?.breakdown?.dividends],
      ["Dividend Amount (INR)", summaryData?.breakdown?.dividendAmount],
      ["Fees", summaryData?.breakdown?.fees],
      ["Fee Amount (INR)", summaryData?.breakdown?.feeAmount],
    ];
    return rows.map((r) => r.join(",")).join("\n");
  };

  // Helper to generate PDF content (simple text)
  const generatePDFText = () => {
    return (
      `Transaction Analysis Report\n\n` +
      `Total Transactions: ${summaryData?.totalTransactions}\n` +
      `Total Volume (INR): ₹${summaryData?.totalVolume?.toLocaleString(
        "en-IN"
      )}\n` +
      `Total Fees (INR): ₹${summaryData?.totalFees?.toLocaleString(
        "en-IN"
      )}\n` +
      `Net Profit/Loss (INR): ₹${summaryData?.netProfitLoss?.toLocaleString(
        "en-IN"
      )}\n` +
      `Average Transaction (INR): ₹${summaryData?.averageTransaction?.toLocaleString(
        "en-IN"
      )}\n` +
      `Success Rate: ${summaryData?.successRate?.toFixed(1)}%\n` +
      `Total Properties: ${summaryData?.totalProperties}\n` +
      `Active Investments: ${summaryData?.activeInvestments}\n` +
      `Purchases: ${
        summaryData?.breakdown?.purchases
      } (₹${summaryData?.breakdown?.purchaseAmount?.toLocaleString(
        "en-IN"
      )})\n` +
      `Sales: ${
        summaryData?.breakdown?.sales
      } (₹${summaryData?.breakdown?.saleAmount?.toLocaleString("en-IN")})\n` +
      `Dividends: ${
        summaryData?.breakdown?.dividends
      } (₹${summaryData?.breakdown?.dividendAmount?.toLocaleString(
        "en-IN"
      )})\n` +
      `Fees: ${
        summaryData?.breakdown?.fees
      } (₹${summaryData?.breakdown?.feeAmount?.toLocaleString("en-IN")})\n`
    );
  };

  // Export handler
  const handleExport = async (format) => {
    if (format === "csv") {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transaction_analysis_report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      const text = generatePDFText();
      const blob = new Blob([text], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transaction_analysis_report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const summaryCards = [
    {
      title: "Total Transactions",
      value: summaryData?.totalTransactions?.toLocaleString(),
      icon: "FileText",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Volume",
      value: `₹${summaryData?.totalVolume?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      icon: "IndianRupee",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Fees",
      value: `₹${summaryData?.totalFees?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      icon: "Minus",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Net Profit/Loss",
      value: `${
        summaryData?.netProfitLoss >= 0 ? "+" : ""
      }₹${summaryData?.netProfitLoss?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      icon: summaryData?.netProfitLoss >= 0 ? "TrendingUp" : "TrendingDown",
      color: summaryData?.netProfitLoss >= 0 ? "text-success" : "text-error",
      bgColor:
        summaryData?.netProfitLoss >= 0 ? "bg-success/10" : "bg-error/10",
    },
  ];

  const transactionBreakdown = [
    {
      type: "Purchases",
      count: summaryData?.breakdown?.purchases,
      amount: summaryData?.breakdown?.purchaseAmount,
      color: "text-success",
    },
    {
      type: "Sales",
      count: summaryData?.breakdown?.sales,
      amount: summaryData?.breakdown?.saleAmount,
      color: "text-error",
    },
    {
      type: "Dividends",
      count: summaryData?.breakdown?.dividends,
      amount: summaryData?.breakdown?.dividendAmount,
      color: "text-accent",
    },
    {
      type: "Fees",
      count: summaryData?.breakdown?.fees,
      amount: summaryData?.breakdown?.feeAmount,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards?.map((card, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {card?.title}
                </p>
                <p className={`text-2xl font-bold ${card?.color}`}>
                  {card?.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card?.bgColor}`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Summary Panel */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Transaction Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              iconName="FileText"
              iconPosition="left"
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              iconName="Download"
              iconPosition="left"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Transaction Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">
              Transaction Breakdown
            </h4>
            <div className="space-y-3">
              {transactionBreakdown?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${item?.color?.replace(
                        "text-",
                        "bg-"
                      )}`}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {item?.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      {item?.count}
                    </div>
                    <div className={`text-xs ${item?.color}`}>
                      ₹
                      {Math.abs(item?.amount)?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">
              Performance Metrics
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Average Transaction
                </span>
                <span className="text-sm font-semibold text-foreground">
                  ₹
                  {summaryData?.averageTransaction?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Success Rate
                </span>
                <span className="text-sm font-semibold text-success">
                  {summaryData?.successRate?.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Total Properties
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {summaryData?.totalProperties}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Active Investments
                </span>
                <span className="text-sm font-semibold text-accent">
                  {summaryData?.activeInvestments}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">
            Recent Activity (Last 30 Days)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {summaryData?.recentActivity?.transactions}
              </div>
              <div className="text-xs text-muted-foreground">Transactions</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-success mb-1">
                ₹{summaryData?.recentActivity?.volume?.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-muted-foreground">Volume</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div
                className={`text-2xl font-bold mb-1 ${
                  summaryData?.recentActivity?.profitLoss >= 0
                    ? "text-success"
                    : "text-error"
                }`}
              >
                {summaryData?.recentActivity?.profitLoss >= 0 ? "+" : ""}₹
                {summaryData?.recentActivity?.profitLoss?.toLocaleString(
                  "en-IN"
                )}
              </div>
              <div className="text-xs text-muted-foreground">P&L</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
