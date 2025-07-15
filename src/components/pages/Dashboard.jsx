import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [farms, crops, tasks, transactions, weather] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getAll(),
      ]);

      const activeCrops = crops.filter(crop => ["planted", "growing", "flowering"].includes(crop.status.toLowerCase()));
      const pendingTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed);
      
      const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const recentTasks = tasks
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
        .slice(0, 5);

      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setDashboardData({
        stats: {
          totalFarms: farms.length,
          activeCrops: activeCrops.length,
          pendingTasks: pendingTasks.length,
          completedTasks: completedTasks.length,
          totalIncome,
          totalExpenses,
          profit: totalIncome - totalExpenses,
        },
        recentTasks,
        recentTransactions,
        weather: weather.slice(0, 5),
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const { stats, recentTasks, recentTransactions, weather } = dashboardData;

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Dashboard" 
        showFarmSelector={true}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={stats.totalFarms}
          icon="MapPin"
          color="primary"
          gradient={true}
        />
        <StatCard
          title="Active Crops"
          value={stats.activeCrops}
          icon="Sprout"
          color="success"
          gradient={true}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="Clock"
          color="warning"
          gradient={true}
        />
        <StatCard
          title="Profit"
          value={`$${stats.profit.toLocaleString()}`}
          icon="TrendingUp"
          color={stats.profit >= 0 ? "success" : "danger"}
          gradient={true}
          trend={stats.profit >= 0 ? "up" : "down"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-earth-900">Weather Forecast</h3>
            <ApperIcon name="CloudSun" size={20} className="text-earth-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {weather.slice(0, 4).map((day, index) => (
              <WeatherCard key={index} weather={day} index={index} />
            ))}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-earth-900">Recent Tasks</h3>
            <ApperIcon name="CheckSquare" size={20} className="text-earth-600" />
          </div>
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-earth-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    task.completed 
                      ? "bg-green-100 text-green-600" 
                      : "bg-primary-100 text-primary-600"
                  }`}>
                    <ApperIcon 
                      name={task.completed ? "CheckCircle" : "Clock"} 
                      size={16} 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-earth-900 text-sm">{task.title}</p>
                    <p className="text-xs text-earth-600">{task.farmName}</p>
                  </div>
                </div>
                <Badge 
                  variant={task.completed ? "success" : "warning"}
                  size="sm"
                >
                  {task.completed ? "Done" : "Pending"}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-earth-900">Recent Transactions</h3>
            <ApperIcon name="DollarSign" size={20} className="text-earth-600" />
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-earth-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    transaction.type === "income" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    <ApperIcon 
                      name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                      size={16} 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-earth-900 text-sm">{transaction.description}</p>
                    <p className="text-xs text-earth-600">{transaction.category}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;