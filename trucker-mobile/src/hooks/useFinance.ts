import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

// ============================================================================
// Types
// ============================================================================

export interface RevenueEntry {
  id: string;
  companyName: string;
  amount: number;
  status: "paid" | "pending";
  month: string;
  date: string;
}

export interface ExpenseEntry {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  jobNumber?: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalExpenses: number;
  profit: number;
}

// ============================================================================
// Revenue Hook
// ============================================================================

interface UseRevenueResult {
  revenues: RevenueEntry[];
  summary: {
    total: number;
    paid: number;
    pending: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRevenue(): UseRevenueResult {
  const [revenues, setRevenues] = useState<RevenueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.revenues.list({ limit: 50 });
      const transformed = (result.data || []).map((rev: any) => ({
        id: rev.id,
        companyName: rev.customer?.name || "Unknown Customer",
        amount: Number(rev.amount) || 0,
        status: rev.status === "paid" ? "paid" : "pending",
        month: new Date(rev.date || rev.createdAt).toLocaleString("en-US", { month: "long" }),
        date: rev.date || rev.createdAt,
      }));
      setRevenues(transformed);
    } catch (err: any) {
      console.error("Failed to fetch revenues:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const summary = {
    total: revenues.reduce((sum, r) => sum + r.amount, 0),
    paid: revenues.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0),
    pending: revenues.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0),
  };

  return {
    revenues,
    summary,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============================================================================
// Expenses Hook
// ============================================================================

interface UseExpensesResult {
  expenses: ExpenseEntry[];
  summary: {
    total: number;
    byCategory: { category: string; total: number; count: number }[];
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [categorySummary, setCategorySummary] = useState<
    { category: string; total: number; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listResult, summaryResult] = await Promise.all([
        api.expenses.myExpenses({ limit: 50 }),
        api.expenses.summary(),
      ]);

      const transformed = (listResult.data || []).map((exp: any) => ({
        id: exp.id,
        title: exp.title || exp.description || "Expense",
        category: exp.category || "Other",
        amount: Number(exp.amount) || 0,
        date: exp.date || exp.createdAt,
        jobNumber: exp.job?.jobNumber,
      }));
      setExpenses(transformed);
      setCategorySummary(summaryResult.byCategory || []);
    } catch (err: any) {
      console.error("Failed to fetch expenses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const summary = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    byCategory: categorySummary,
  };

  return {
    expenses,
    summary,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============================================================================
// Combined Finance Hook
// ============================================================================

interface UseFinanceResult {
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
  summary: FinanceSummary;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFinance(): UseFinanceResult {
  const {
    revenues,
    summary: revSummary,
    loading: revLoading,
    error: revError,
    refetch: refetchRev,
  } = useRevenue();
  const {
    expenses,
    summary: expSummary,
    loading: expLoading,
    error: expError,
    refetch: refetchExp,
  } = useExpenses();

  const summary: FinanceSummary = {
    totalRevenue: revSummary.total,
    paidRevenue: revSummary.paid,
    pendingRevenue: revSummary.pending,
    totalExpenses: expSummary.total,
    profit: revSummary.total - expSummary.total,
  };

  const refetch = useCallback(() => {
    refetchRev();
    refetchExp();
  }, [refetchRev, refetchExp]);

  return {
    revenues,
    expenses,
    summary,
    loading: revLoading || expLoading,
    error: revError || expError,
    refetch,
  };
}

