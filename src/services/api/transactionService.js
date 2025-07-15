import transactionsData from "@/services/mockData/transactions.json";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.transactions];
  }

  async getById(id) {
    await this.delay();
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    return { ...transaction };
  }

  async create(transactionData) {
    await this.delay();
    const maxId = Math.max(...this.transactions.map(t => t.Id), 0);
    const newTransaction = {
      ...transactionData,
      Id: maxId + 1,
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    this.transactions[index] = { ...transactionData, Id: parseInt(id) };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    this.transactions.splice(index, 1);
return true;
  }

  async exportTransactions(transactions, startDate, endDate) {
    await this.delay(500);
    
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
    await this.delay(500);
    
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