import type { Job, Bid } from "../hooks/useApi";

// ============================================================================
// Types (matching App.tsx internal types)
// ============================================================================

export type RecommendedJobDetailRow = {
  label: string;
  value: string;
};

export type RecommendedJobSection = {
  rows: RecommendedJobDetailRow[];
};

export type RecommendedJob = {
  id: string;
  codeLabel: string;
  date: string;
  time: string;
  employer: string;
  jobType: string;
  price: string;
  direction: "inbound" | "outbound";
  category: "domestic" | "international";
  route: {
    origin: string;
    destination: string;
    stopsNote?: string;
  };
  startDate: string;
  startTime: string;
  sections: RecommendedJobSection[];
};

export type CurrentJobItem = {
  id: string;
  status: { key: string; label: string };
  title: string;
  chips: { icon: string; text: string; variant?: string }[];
  jobDetailId: string;
};

export type BidOrder = {
  id: string;
  orderCode: string;
  date: string;
  time: string;
  employer: string;
  destination: string;
  price: string;
  distance: string;
  cargo: string;
  weight: string;
  minimumBid: number | null;
  status: "open" | "history";
  submittedAmount?: number;
};

// ============================================================================
// Transformers
// ============================================================================

/**
 * Transform API Job to RecommendedJob format for HomeScreen
 */
export function transformJobToRecommended(job: Job): RecommendedJob {
  const pickupDate = job.pickupDate ? new Date(job.pickupDate) : new Date();
  const isInternational =
    job.origin?.toLowerCase().includes("laos") ||
    job.origin?.toLowerCase().includes("cambodia") ||
    job.origin?.toLowerCase().includes("vietnam") ||
    job.origin?.toLowerCase().includes("myanmar") ||
    job.destination?.toLowerCase().includes("laos") ||
    job.destination?.toLowerCase().includes("cambodia") ||
    job.destination?.toLowerCase().includes("vietnam") ||
    job.destination?.toLowerCase().includes("myanmar");

  const direction = job.origin?.toLowerCase().includes("bangkok") ? "outbound" : "inbound";

  const stopsCount = job.stops?.length || 0;
  const stopsNote = stopsCount > 2 ? `${stopsCount - 2} more stops` : undefined;

  return {
    id: job.id,
    codeLabel: `Order ID ${job.jobNumber}`,
    date: pickupDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
    time: pickupDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    employer: job.customer?.name || "Unknown Customer",
    jobType: isInternational
      ? `International ${direction === "inbound" ? "inbound" : "outbound"} shipment`
      : `Domestic ${direction === "inbound" ? "inbound" : "outbound"} delivery`,
    price: `฿ ${Number(job.price || 0).toLocaleString()}`,
    direction: direction,
    category: isInternational ? "international" : "domestic",
    route: {
      origin: job.origin,
      destination: job.destination,
      stopsNote: stopsNote,
    },
    startDate: pickupDate.toLocaleDateString("en-GB"),
    startTime: pickupDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    sections: [
      {
        rows: [
          { label: "Cargo", value: job.cargo || "General cargo" },
          { label: "Weight", value: job.cargoWeight ? `${job.cargoWeight} kg` : "-" },
          { label: "Distance", value: job.distance ? `${job.distance} km` : "-" },
        ],
      },
    ],
  };
}

/**
 * Transform API Job to CurrentJobItem format for CurrentJobsScreen
 */
export function transformJobToCurrentJob(
  job: Job,
  icons: { priceIcon: string; routeIcon: string }
): CurrentJobItem {
  const statusMap: Record<string, { key: string; label: string }> = {
    pending: { key: "notStarted", label: "Not started" },
    in_progress: { key: "inTransit", label: "In transit" },
    completed: { key: "completed", label: "Completed" },
    cancelled: { key: "cancelled", label: "Cancelled" },
  };

  return {
    id: job.id,
    status: statusMap[job.status] || { key: "notStarted", label: "Not started" },
    title: `${job.origin} → ${job.destination}`,
    chips: [
      { icon: icons.priceIcon, text: `฿ ${Number(job.price || 0).toLocaleString()}`, variant: "accent" },
      { icon: icons.routeIcon, text: job.distance ? `${job.distance} km` : "-" },
    ],
    jobDetailId: job.id,
  };
}

/**
 * Transform API Bid to BidOrder format for BidsScreen
 */
export function transformBidToBidOrder(bid: Bid): BidOrder {
  const pickupDate = bid.pickupDate ? new Date(bid.pickupDate) : new Date();

  return {
    id: bid.id,
    orderCode: bid.bidNumber,
    date: pickupDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
    time: pickupDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    employer: bid.customer?.name || "Open Bid",
    destination: `${bid.origin} → ${bid.destination}`,
    price: bid.requestedPrice ? `฿ ${Number(bid.requestedPrice).toLocaleString()}` : "Open",
    distance: "-",
    cargo: bid.cargo || "General",
    weight: bid.cargoWeight ? `${bid.cargoWeight} kg` : "-",
    minimumBid: bid.minimumBid ? Number(bid.minimumBid) : null,
    status: bid.status === "open" ? "open" : "history",
    submittedAmount: bid.submittedPrice ? Number(bid.submittedPrice) : undefined,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number | string | null, currency: string = "THB"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num === null || isNaN(num || 0)) return "฿ 0";
  return `฿ ${num.toLocaleString()}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Format time for display
 */
export function formatTime(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

