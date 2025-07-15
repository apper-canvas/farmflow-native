import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { farmService } from '@/services/api/farmService';
import { cropService } from '@/services/api/cropService';
import { taskService } from '@/services/api/taskService';
import { transactionService } from '@/services/api/transactionService';
import { weatherService } from '@/services/api/weatherService';

// Async thunk for loading dashboard data
export const loadDashboardData = createAsyncThunk(
  'dashboard/loadData',
  async (_, { rejectWithValue }) => {
    try {
      const [farms, crops, tasks, transactions, weather] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getAll(),
      ]);

      const activeCrops = crops.filter(crop => ["planted", "growing", "flowering"].includes(crop.status?.toLowerCase() || ""));
      const pendingTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed);
      
      const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const recentTasks = tasks
        .sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0))
        .slice(0, 5);

      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5);

      return {
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
        weatherLastUpdated: weather.length > 0 ? weather[0].lastUpdated : null,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load dashboard data');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    refreshDashboard: (state) => {
      state.loading = true;
      state.error = null;
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { refreshDashboard, clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;