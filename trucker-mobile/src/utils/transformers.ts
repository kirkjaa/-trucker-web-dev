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
  employer: string;
  serviceType: string;
  origin: string;
  destination: string;
  dateLabel: string;
  timeLabel: string;
  priceLabel: string;
  equipment: string;
  safetyEquipment: string;
  minimumBid: number;
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

  const isInternational =
    bid.origin?.toLowerCase().includes("laos") ||
    bid.origin?.toLowerCase().includes("cambodia") ||
    bid.destination?.toLowerCase().includes("laos") ||
    bid.destination?.toLowerCase().includes("cambodia");

  return {
    id: bid.id,
    orderCode: bid.bidNumber,
    employer: bid.customer?.name || "Open Bid",
    serviceType: isInternational
      ? "International shipment"
      : "Domestic shipment",
    origin: bid.origin,
    destination: bid.destination,
    dateLabel: pickupDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
    timeLabel: pickupDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    priceLabel: bid.requestedPrice ? `฿ ${Number(bid.requestedPrice).toLocaleString()}` : "Open",
    equipment: bid.cargo ? `Cargo: ${bid.cargo}` : "Standard equipment",
    safetyEquipment: bid.cargoWeight ? `Weight: ${bid.cargoWeight} kg` : "-",
    minimumBid: bid.minimumBid ? Number(bid.minimumBid) : 0,
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

// ============================================================================
// Job Detail Types (matching App.tsx internal types)
// ============================================================================

export type CurrentJobDetailStopAction = {
  key: string;
  label: string;
};

export type CurrentJobDetailStop = {
  id: string;
  title: string;
  badge?: { label: string; tone: "success" | "warning" | "error" };
  contactName: string;
  contactRole: string;
  routeCode: string;
  cargo: string;
  scheduleLabel: string;
  scheduleValue: string;
  note: string;
  isHighlighted?: boolean;
  actions: CurrentJobDetailStopAction[];
  address: string;
  mapImage: string;
  productDescription?: string;
  checkInLabel?: string;
  checkInValue?: string;
  checkInCta?: string;
  postCheckInCta?: string;
  postCheckInIcon?: string;
  paymentInfo?: {
    method: string;
    amount: string;
    timestamp: string;
  };
  podTimestamp?: string;
};

export type CurrentJobDetail = {
  id: string;
  code: string;
  price: string;
  stopCount: string;
  cargoTotal: string;
  customer: string;
  issueLabel: string;
  footerCta: string;
  stops: CurrentJobDetailStop[];
};

/**
 * Transform API Job to CurrentJobDetail format for job detail screens
 */
export function transformJobToDetail(
  job: Job,
  mapImage: string = "/assets/images/map.png"
): CurrentJobDetail {
  const stops: CurrentJobDetailStop[] = (job.stops || []).map((stop, index) => {
    const isPickup = index === 0;
    const isDropoff = index === (job.stops?.length || 1) - 1;
    const stopType = isPickup ? "Pickup" : isDropoff ? "Drop-off" : "Stop";
    
    const scheduleDate = stop.arrivalTime 
      ? new Date(stop.arrivalTime) 
      : job.pickupDate 
        ? new Date(job.pickupDate) 
        : new Date();

    return {
      id: stop.id,
      title: `${stopType} • ${stop.name}`,
      badge: stop.status === "completed" 
        ? { label: "Completed", tone: "success" as const }
        : stop.status === "ready"
          ? { label: "Ready", tone: "warning" as const }
          : index === 0 
            ? { label: "On schedule", tone: "success" as const }
            : undefined,
      contactName: stop.contact || "Contact TBD",
      contactRole: isPickup ? "Warehouse contact" : "Receiving contact",
      routeCode: `${job.jobNumber} · ${stop.name.split(",")[0]}`,
      cargo: stop.cargo || job.cargo || "General cargo",
      scheduleLabel: isPickup ? "Pick-up time" : "Drop-off time",
      scheduleValue: formatDate(scheduleDate.toISOString()) + " · " + formatTime(scheduleDate.toISOString()),
      note: stop.notes || "No special instructions",
      isHighlighted: index === 0 && !stop.checkedIn,
      actions: [
        { key: "call", label: "Call" },
        { key: "route", label: "Route" },
        { key: "info", label: "View info" },
        ...(isPickup ? [{ key: "status", label: "Update status" }] : []),
      ],
      address: stop.address || stop.name,
      mapImage: mapImage,
      productDescription: stop.cargo || job.cargo,
      checkInLabel: "Check-in time",
      checkInValue: stop.checkedInAt 
        ? formatDate(stop.checkedInAt) + " · " + formatTime(stop.checkedInAt)
        : formatDate(scheduleDate.toISOString()) + " · " + formatTime(scheduleDate.toISOString()),
      checkInCta: stop.checkedIn ? undefined : "Check in",
      postCheckInCta: isDropoff && stop.checkedIn ? "Pay" : undefined,
      paymentInfo: isDropoff ? {
        method: "On delivery",
        amount: formatCurrency(job.price),
        timestamp: formatDate(new Date().toISOString()) + " | " + formatTime(new Date().toISOString()),
      } : undefined,
    };
  });

  // If no stops, create default pickup/dropoff stops
  if (stops.length === 0) {
    const pickupDate = job.pickupDate ? new Date(job.pickupDate) : new Date();
    const deliveryDate = job.deliveryDate ? new Date(job.deliveryDate) : new Date();

    stops.push({
      id: `${job.id}-pickup`,
      title: `Pickup • ${job.origin.split(",")[0]}`,
      badge: { label: "On schedule", tone: "success" },
      contactName: job.customer?.name || "Contact TBD",
      contactRole: "Warehouse contact",
      routeCode: `${job.jobNumber} · ${job.origin.split(",")[0]}`,
      cargo: job.cargo || "General cargo",
      scheduleLabel: "Pick-up time",
      scheduleValue: formatDate(pickupDate.toISOString()) + " · " + formatTime(pickupDate.toISOString()),
      note: "Contact warehouse on arrival",
      isHighlighted: true,
      actions: [
        { key: "call", label: "Call" },
        { key: "route", label: "Route" },
        { key: "info", label: "View info" },
        { key: "status", label: "Update status" },
      ],
      address: job.origin,
      mapImage: mapImage,
      productDescription: job.cargo,
      checkInLabel: "Check-in time",
      checkInValue: formatDate(pickupDate.toISOString()) + " · " + formatTime(pickupDate.toISOString()),
      checkInCta: "Check in",
    });

    stops.push({
      id: `${job.id}-dropoff`,
      title: `Drop-off • ${job.destination.split(",")[0]}`,
      contactName: "Receiving contact",
      contactRole: "Receiving lead",
      routeCode: `${job.jobNumber} · ${job.destination.split(",")[0]}`,
      cargo: job.cargo || "General cargo",
      scheduleLabel: "Drop-off time",
      scheduleValue: formatDate(deliveryDate.toISOString()) + " · " + formatTime(deliveryDate.toISOString()),
      note: "Verify delivery with receiving team",
      actions: [
        { key: "call", label: "Call" },
        { key: "route", label: "Route" },
        { key: "info", label: "View info" },
      ],
      address: job.destination,
      mapImage: mapImage,
      checkInCta: "Check in",
      postCheckInCta: "Pay",
      paymentInfo: {
        method: "On delivery",
        amount: formatCurrency(job.price),
        timestamp: formatDate(new Date().toISOString()) + " | " + formatTime(new Date().toISOString()),
      },
    });
  }

  return {
    id: job.id,
    code: job.jobNumber,
    price: formatCurrency(job.price),
    stopCount: `Stops: ${stops.length}`,
    cargoTotal: `Cargo: ${job.cargo || "General"}${job.cargoWeight ? ` (${job.cargoWeight} kg)` : ""}`,
    customer: job.customer?.name || "Unknown Customer",
    issueLabel: "Report issue",
    footerCta: job.status === "pending" ? "Start job" : job.status === "in_progress" ? "Continue" : "Completed",
    stops,
  };
}

