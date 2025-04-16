
export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'income' | 'expense';
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}
