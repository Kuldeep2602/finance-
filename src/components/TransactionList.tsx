
import React, { useState } from "react";
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle, Search } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete 
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      formatCurrency(transaction.amount)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  // Sort transactions based on sort key and direction
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    if (sortKey === "amount") {
      return sortDirection === "asc" 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    }
    
    // Sort by description
    const valueA = String(a[sortKey]).toLowerCase();
    const valueB = String(b[sortKey]).toLowerCase();
    
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle column sorting
  const handleSort = (key: keyof Transaction) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {sortedTransactions.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortKey === "date" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("description")}
                >
                  Description
                  {sortKey === "description" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortKey === "amount" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="flex items-center">
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-4 w-4 mr-2 text-finance-green" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 mr-2 text-finance-red" />
                    )}
                    {transaction.description}
                  </TableCell>
                  <TableCell className={`text-right ${
                    transaction.type === "income" 
                      ? "text-finance-green" 
                      : "text-finance-red"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-muted/20 border rounded-md">
          <p className="text-muted-foreground mb-2">No transactions found</p>
          {searchTerm ? (
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add a transaction to get started
            </p>
          )}
        </div>
      )}
    </div>
  );
}
