export interface CategorySummary {
  monthlyAmounts: { [month: string]: number };
  total: number;
}

export interface MonthlyTotal {
  income: number;
  expense: number;
  balance: number;
}

export interface BudgetSummary {
  incomeCategories: { [category: string]: CategorySummary };
  expenseCategories: { [category: string]: CategorySummary };
  monthlyTotals: { [month: string]: MonthlyTotal };
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}
