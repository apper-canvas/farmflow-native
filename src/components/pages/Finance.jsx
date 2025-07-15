import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TransactionForm from "@/components/organisms/TransactionForm";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { format } from "date-fns";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleAddTransaction = async (transaction) => {
    try {
      const newTransaction = await transactionService.create(transaction);
      setTransactions([newTransaction, ...transactions]);
      setShowForm(false);
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await transactionService.delete(transactionId);
      setTransactions(transactions.filter(t => t.Id !== transactionId));
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpenses;

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Finance" 
        actions={
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Transaction
          </Button>
        }
      />

      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          color="success"
          gradient={true}
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="danger"
          gradient={true}
        />
        <StatCard
          title="Net Profit"
          value={`$${profit.toLocaleString()}`}
          icon={profit >= 0 ? "DollarSign" : "AlertCircle"}
          color={profit >= 0 ? "success" : "danger"}
          gradient={true}
          trend={profit >= 0 ? "up" : "down"}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {["all", "income", "expense"].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType}
          </Button>
        ))}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No transactions found"
          description="Start tracking your farm finances by adding your first transaction"
          actionText="Add Transaction"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-earth-50 border-b border-earth-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                    Description
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-earth-700">
                    Amount
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-earth-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-earth-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <Badge 
                        variant={transaction.type === "income" ? "success" : "danger"}
                        className="capitalize"
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-earth-900">{transaction.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-earth-600 capitalize">
                      {transaction.category.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-sm text-earth-600">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.Id)}
                        className="p-2 hover:bg-red-50 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Finance;