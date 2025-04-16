
/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date as a string (MM/DD/YYYY)
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date instanceof Date ? date : new Date(date));
};

/**
 * Group transactions by month for chart data
 */
export const groupTransactionsByMonth = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyData: Record<string, { expenses: number; income: number }> = {};
  
  // Sort transactions by date (oldest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  sortedTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { expenses: 0, income: 0 };
    }
    
    if (transaction.type === 'expense') {
      monthlyData[monthYear].expenses += transaction.amount;
    } else {
      monthlyData[monthYear].income += transaction.amount;
    }
  });
  
  // Convert to array format for Recharts
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data
  }));
};

import { Transaction, MonthlyData } from '@/types';
