import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import {
  transformJobToRecommended,
  transformBidToBidOrder,
  type RecommendedJob,
  type BidOrder,
} from "../utils/transformers";

interface HomeData {
  // Jobs for recommendation
  recommendedJobs: RecommendedJob[];
  // Bids for bidding screen
  bidOrders: BidOrder[];
  // My active jobs count
  activeJobsCount: number;
  // Loading states
  loading: boolean;
  error: string | null;
  // Refetch functions
  refetchJobs: () => void;
  refetchBids: () => void;
}

export function useHomeData(): HomeData {
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [bidOrders, setBidOrders] = useState<BidOrder[]>([]);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      // Fetch pending jobs (available for drivers to accept)
      const jobs = await api.jobs.list({ status: "pending", limit: 20 });
      const transformed = jobs.map(transformJobToRecommended);
      setRecommendedJobs(transformed);

      // Get count of active jobs for the current user
      const myJobs = await api.jobs.myJobs({ status: "in_progress" });
      setActiveJobsCount(myJobs.length);
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message);
    }
  }, []);

  const fetchBids = useCallback(async () => {
    try {
      const result = await api.bids.open();
      const transformed = result.data.map(transformBidToBidOrder);
      setBidOrders(transformed);
    } catch (err: any) {
      console.error("Failed to fetch bids:", err);
      // Don't set error for bids, just log it
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchJobs(), fetchBids()]);
      setLoading(false);
    };

    loadData();
  }, [fetchJobs, fetchBids]);

  return {
    recommendedJobs,
    bidOrders,
    activeJobsCount,
    loading,
    error,
    refetchJobs: fetchJobs,
    refetchBids: fetchBids,
  };
}

// ============================================================================
// My Jobs Hook (for driver's current jobs)
// ============================================================================

interface MyJobsData {
  activeJobs: any[];
  completedJobs: any[];
  pendingJobs: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMyJobsData(): MyJobsData {
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [active, completed, pending] = await Promise.all([
        api.jobs.myJobs({ status: "in_progress" }),
        api.jobs.myJobs({ status: "completed" }),
        api.jobs.myJobs({ status: "pending" }),
      ]);
      setActiveJobs(active);
      setCompletedJobs(completed);
      setPendingJobs(pending);
    } catch (err: any) {
      console.error("Failed to fetch my jobs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    activeJobs,
    completedJobs,
    pendingJobs,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============================================================================
// Dashboard Stats Hook
// ============================================================================

interface DashboardData {
  stats: {
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    pendingJobs: number;
    totalEarnings: number;
    monthlyEarnings: number;
    totalExpenses: number;
    monthlyExpenses: number;
    openBids: number;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardData["stats"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardStats, myStats] = await Promise.all([
        api.dashboard.stats(),
        api.dashboard.myStats(),
      ]);

      setStats({
        totalJobs: dashboardStats.jobs.total,
        activeJobs: dashboardStats.jobs.active,
        completedJobs: dashboardStats.jobs.completed,
        pendingJobs: dashboardStats.jobs.pending,
        totalEarnings: myStats.earnings.total,
        monthlyEarnings: myStats.earnings.monthly,
        totalExpenses: myStats.expenses.total,
        monthlyExpenses: myStats.expenses.monthly,
        openBids: dashboardStats.bids.open,
      });
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    loading,
    error,
    refetch: fetchData,
  };
}

