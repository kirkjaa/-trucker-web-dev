import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

// ============================================================================
// Types
// ============================================================================

export interface DashboardStats {
  jobs: {
    total: number;
    active: number;
    completed: number;
    pending: number;
  };
  customers: {
    total: number;
  };
  vehicles: {
    total: number;
    available: number;
  };
  finance: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalExpenses: number;
    monthlyExpenses: number;
    profit: number;
    monthlyProfit: number;
  };
  bids: {
    open: number;
  };
  drivers: {
    total: number;
  };
}

export interface MyStats {
  jobs: {
    total: number;
    active: number;
    completed: number;
  };
  earnings: {
    total: number;
    monthly: number;
  };
  expenses: {
    total: number;
    monthly: number;
  };
  profit: {
    total: number;
    monthly: number;
  };
}

export interface Job {
  id: string;
  jobNumber: string;
  customerId: string | null;
  vehicleId: string | null;
  driverId: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  origin: string;
  destination: string;
  distance: string | null;
  estimatedDuration: string | null;
  cargo: string | null;
  cargoWeight: string | null;
  temperature: string | null;
  price: string | null;
  progress: number;
  notes: string | null;
  pickupDate: string | null;
  deliveryDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string } | null;
  vehicle: { id: string; registrationNumber: string } | null;
  driver: { id: string; displayName: string } | null;
  stops: JobStop[];
}

export interface JobStop {
  id: string;
  jobId: string;
  sequence: number;
  name: string;
  address: string | null;
  contact: string | null;
  phone: string | null;
  cargo: string | null;
  arrivalTime: string | null;
  departureTime: string | null;
  status: "pending" | "ready" | "completed";
  checkedIn: boolean;
  checkedInAt: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Bid {
  id: string;
  bidNumber: string;
  customerId: string | null;
  origin: string;
  destination: string;
  cargo: string | null;
  cargoWeight: string | null;
  requestedPrice: string | null;
  submittedPrice: string | null;
  minimumBid: string | null;
  status: "open" | "submitted" | "accepted" | "rejected" | "expired";
  pickupDate: string | null;
  expiresAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string } | null;
}

export interface Expense {
  id: string;
  jobId: string | null;
  stopId: string | null;
  userId: string | null;
  title: string;
  category: string;
  amount: string;
  currency: string;
  description: string | null;
  receiptUrl: string | null;
  date: string;
  createdAt: string;
  job: { id: string; jobNumber: string } | null;
}

export interface Conversation {
  id: string;
  type: "private" | "group";
  name: string | null;
  avatar: string | null;
  lastMessage: {
    content: string | null;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  participants: {
    id: string;
    displayName: string;
    avatar: string | null;
  }[];
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  messageType: string;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
    avatar: string | null;
  } | null;
}

// ============================================================================
// Generic Hook for API Calls
// ============================================================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApiCall<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.message || "An error occurred" });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ============================================================================
// Dashboard Hooks
// ============================================================================

export function useDashboardStats() {
  return useApiCall<DashboardStats>(() => api.dashboard.stats(), []);
}

export function useMyStats() {
  return useApiCall<MyStats>(() => api.dashboard.myStats(), []);
}

export function useRecentJobs(limit: number = 10) {
  return useApiCall<Job[]>(() => api.dashboard.recentJobs(limit), [limit]);
}

// ============================================================================
// Jobs Hooks
// ============================================================================

export function useJobs(status?: string) {
  return useApiCall<Job[]>(
    () => api.jobs.list({ status, limit: 50 }),
    [status]
  );
}

export function useMyJobs(status?: string) {
  return useApiCall<Job[]>(
    () => api.jobs.myJobs({ status, limit: 50 }),
    [status]
  );
}

export function useJob(id: string | null) {
  return useApiCall<Job | null>(
    async () => {
      if (!id) return null;
      return api.jobs.get(id);
    },
    [id]
  );
}

// ============================================================================
// Bids Hooks
// ============================================================================

export function useBids(status?: string) {
  return useApiCall<{ data: Bid[]; total: number }>(
    () => api.bids.list({ status }),
    [status]
  );
}

export function useOpenBids() {
  return useApiCall<{ data: Bid[]; total: number }>(
    () => api.bids.open(),
    []
  );
}

// ============================================================================
// Expenses Hooks
// ============================================================================

export function useExpenses(params?: { jobId?: string; startDate?: string; endDate?: string }) {
  return useApiCall<{ data: Expense[]; total: number }>(
    () => api.expenses.list(params),
    [params?.jobId, params?.startDate, params?.endDate]
  );
}

export function useMyExpenses(params?: { startDate?: string; endDate?: string }) {
  return useApiCall<{ data: Expense[]; total: number }>(
    () => api.expenses.myExpenses(params),
    [params?.startDate, params?.endDate]
  );
}

export function useExpenseSummary(params?: { startDate?: string; endDate?: string }) {
  return useApiCall<{
    byCategory: { category: string; total: number; count: number }[];
    grandTotal: number;
  }>(() => api.expenses.summary(params), [params?.startDate, params?.endDate]);
}

// ============================================================================
// Chat Hooks
// ============================================================================

export function useConversations() {
  return useApiCall<Conversation[]>(() => api.chat.list(), []);
}

export function useConversation(id: string | null) {
  return useApiCall<Conversation | null>(
    async () => {
      if (!id) return null;
      return api.chat.get(id);
    },
    [id]
  );
}

export function useMessages(conversationId: string | null, limit: number = 50) {
  return useApiCall<Message[]>(
    async () => {
      if (!conversationId) return [];
      return api.chat.getMessages(conversationId, { limit });
    },
    [conversationId, limit]
  );
}
