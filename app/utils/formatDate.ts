import dayjs from "dayjs";

type TimeSlot = {
  value: string; // "12:00-12:30"
  label: string; // "12:00 - 12:30"
  startTime: string; // "12:00"
};

export function formatDateToISOString(date: Date, time?: string): string {
  // time look like : "12:00"
  if (!time) {
    const isoString = dayjs(date).toISOString();
    return isoString;
  } else {
    const isoString = dayjs(date)
      .set("hour", Number(time.split(":")[0]))
      .set("minute", Number(time.split(":")[1]))
      .toISOString();
    return isoString;
  }
}

export function timeAgo(createdAt: Date): string {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const diffInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
  );

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24 && now.toDateString() === createdDate.toDateString()) {
    return `${diffInHours} hours`;
  }

  // คำนวณต่างวันอย่างถูกต้อง
  const diffInDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - createdDate.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  return diffInDays === 1 ? "1 day" : `${diffInDays} days`;
}

export function getDateDiffInDays(
  startDate: string | Date,
  endDate: string | Date
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export const formatISOToDate = {
  toShortFormat: (isoString: string | Date): string => {
    return dayjs(isoString).format("DD/MM/YYYY");
  },

  toLongFormat: (isoString: string | Date): string => {
    return dayjs(isoString).format("DD MMMM YYYY");
  },

  toFullFormat: (isoString: string | Date): string => {
    return dayjs(isoString).format("ddd , DD MMM YYYY");
  },

  toFullDateTimeFormat: (isoString: string | Date): string => {
    return dayjs(isoString).format("ddd , DD MMM YYYY HH:mm");
  },

  toTimeDisplay: (isoString: string | Date): string => {
    return dayjs(isoString).format("HH:mm");
  },

  toTimeFieldInput: (isoString: string | Date): string => {
    return dayjs(isoString).format("HH:mm");
  },

  toDateAndTime: (isoString: string | Date): string => {
    return dayjs(isoString).format("DD/MM/YYYY HH:mm");
  },
  createTimeSlot: (startTime: string): TimeSlot => {
    const start = dayjs(startTime, "HH:mm");
    const end = start.add(30, "minute");

    return {
      value: `${start.format("HH:mm")}-${end.format("HH:mm")}`,
      label: `${start.format("HH:mm")} - ${end.format("HH:mm")}`,
      startTime: start.format("HH:mm"),
    };
  },

  calculateDaysBetween: (
    isoString1: string | Date,
    isoString2: string | Date
  ): string => {
    const start = dayjs(isoString1);
    const end = dayjs(isoString2);

    const years = end.diff(start, "year");
    let adjustedStart = start.add(years, "year");

    const months = end.diff(adjustedStart, "month");
    adjustedStart = adjustedStart.add(months, "month");

    const days = end.diff(adjustedStart, "day");

    const parts = [];
    if (years > 0) parts.push(`${years} ปี`);
    if (months > 0) parts.push(`${months} เดือน`);
    if (days > 0 || parts.length === 0) parts.push(`${days} วัน`);

    return parts.join(" ");
  },
};
