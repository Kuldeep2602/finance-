import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpensesChart } from "@/components/ExpensesChart";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatters";

const STORAGE_KEY = "finance-tracker-transactions";

const Index = () => {
  // State for transactions and UI
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>(undefined);

  // Load saved transactions from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    if (savedTransactions) {
      try {
        // Parse stored JSON and convert date strings back to Date objects
        const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  // Handle transaction actions
  const handleAddTransaction = (transaction: Transaction) => {
    if (currentTransaction) {
      // Update existing transaction
      setTransactions(
        transactions.map(t =>
          t.id === transaction.id ? transaction : t
        )
      );
    } else {
      // Add new transaction
      setTransactions([...transactions, transaction]);
    }
    
    setIsFormOpen(false);
    setCurrentTransaction(undefined);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Personal Finance Tracker</h1>
            <p className="text-muted-foreground">Track your income and expenses with ease</p>
          </div>
          <Button 
            onClick={() => {
              setCurrentTransaction(undefined);
              setIsFormOpen(true);
            }}
            className="bg-finance-blue hover:bg-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Income</h3>
            <p className="text-2xl font-semibold text-finance-green">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Expenses</h3>
            <p className="text-2xl font-semibold text-finance-red">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Balance</h3>
            <p className={`text-2xl font-semibold ${balance >= 0 ? "text-finance-green" : "text-finance-red"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <TransactionList 
              transactions={transactions} 
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>
          
          <TabsContent value="charts">
            <ExpensesChart transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Transaction Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription>
              {currentTransaction
                ? "Update your transaction details below."
                : "Enter the details of your new transaction."}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            transaction={currentTransaction}
            onSubmit={handleAddTransaction}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentTransaction(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
