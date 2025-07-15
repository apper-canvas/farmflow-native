import { toast } from "react-toastify";

class TransactionService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "farm_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("transaction", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(transaction => ({
        Id: transaction.Id,
        name: transaction.Name,
        tags: transaction.Tags,
        farmId: transaction.farm_id?.toString() || "",
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "farm_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById("transaction", parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        farmId: response.data.farm_id?.toString() || "",
        type: response.data.type,
        category: response.data.category,
        amount: response.data.amount,
        date: response.data.date,
        description: response.data.description
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching transaction with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [
          {
            Name: transactionData.description,
            type: transactionData.type,
            category: transactionData.category,
            amount: transactionData.amount,
            date: transactionData.date,
            description: transactionData.description,
            farm_id: transactionData.farmId ? parseInt(transactionData.farmId) : null
          }
        ]
      };

      const response = await this.apperClient.createRecord("transaction", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} transactions:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newTransaction = successfulRecords[0].data;
          return {
            Id: newTransaction.Id,
            name: newTransaction.Name,
            tags: newTransaction.Tags,
            farmId: newTransaction.farm_id?.toString() || "",
            type: newTransaction.type,
            category: newTransaction.category,
            amount: newTransaction.amount,
            date: newTransaction.date,
            description: newTransaction.description
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
      } else {
        console.error("Error creating transaction:", error.message);
      }
      return null;
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: transactionData.description,
            type: transactionData.type,
            category: transactionData.category,
            amount: transactionData.amount,
            date: transactionData.date,
            description: transactionData.description,
            farm_id: transactionData.farmId ? parseInt(transactionData.farmId) : null
          }
        ]
      };

      const response = await this.apperClient.updateRecord("transaction", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} transactions:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTransaction = successfulUpdates[0].data;
          return {
            Id: updatedTransaction.Id,
            name: updatedTransaction.Name,
            tags: updatedTransaction.Tags,
            farmId: updatedTransaction.farm_id?.toString() || "",
            type: updatedTransaction.type,
            category: updatedTransaction.category,
            amount: updatedTransaction.amount,
            date: updatedTransaction.date,
            description: updatedTransaction.description
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
      } else {
        console.error("Error updating transaction:", error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("transaction", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} transactions:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
      } else {
        console.error("Error deleting transaction:", error.message);
      }
      return false;
    }
  }

  async exportTransactions(transactions, startDate, endDate) {
    // Create CSV content
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.date,
        transaction.type,
        `"${transaction.description}"`,
        transaction.category.replace('_', ' '),
        transaction.amount
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const dateRange = startDate && endDate ? 
      `_${startDate}_to_${endDate}` : 
      `_${new Date().toISOString().split('T')[0]}`;
    
    link.setAttribute('download', `financial_report${dateRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }

  async exportTransactionsPDF(transactions, startDate, endDate) {
    // Calculate totals
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Financial Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { margin-bottom: 30px; }
          .summary-item { display: inline-block; margin: 10px 20px; padding: 10px; border: 1px solid #ddd; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .income { color: green; }
          .expense { color: red; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Financial Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          ${startDate && endDate ? `<p>Period: ${startDate} to ${endDate}</p>` : ''}
        </div>
        <div class="summary">
          <div class="summary-item">
            <strong>Total Income:</strong> <span class="income">$${totalIncome.toLocaleString()}</span>
          </div>
          <div class="summary-item">
            <strong>Total Expenses:</strong> <span class="expense">$${totalExpenses.toLocaleString()}</span>
          </div>
          <div class="summary-item">
            <strong>Net Profit:</strong> <span class="${netProfit >= 0 ? 'income' : 'expense'}">$${netProfit.toLocaleString()}</span>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(transaction => `
              <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td class="${transaction.type}">${transaction.type}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category.replace('_', ' ')}</td>
                <td class="${transaction.type}">$${transaction.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create PDF using print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    
    return true;
  }
}

export const transactionService = new TransactionService();