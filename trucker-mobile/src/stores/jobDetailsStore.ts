// Simple store for job details that can be accessed by any component
// This avoids prop drilling while keeping the data flow explicit

type JobDetail = {
  id: string;
  code: string;
  price: string;
  stopCount: string;
  cargoTotal: string;
  customer: string;
  issueLabel: string;
  footerCta: string;
  stops: Array<{
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
    actions: Array<{ key: string; label: string }>;
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
  }>;
};

// Store for dynamic job details from API
let dynamicJobDetails: Record<string, JobDetail> = {};

// Listeners for store updates
const listeners: Set<() => void> = new Set();

export function setJobDetails(details: Record<string, JobDetail>) {
  dynamicJobDetails = details;
  listeners.forEach((listener) => listener());
}

export function getJobDetails(): Record<string, JobDetail> {
  return dynamicJobDetails;
}

export function getJobDetail(jobId: string): JobDetail | null {
  return dynamicJobDetails[jobId] || null;
}

export function subscribeToJobDetails(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hasJobDetail(jobId: string): boolean {
  return jobId in dynamicJobDetails;
}

