// src/utils/utils.ts
export interface RoutineItem {
  id: string;
  time: string;
  task: string;
  description: string;
  image: any;
  insertionOrder?: number;
}

export interface FormData {
  time: string;
  task: string;
  description: string;
}

export const parseTime = (
  timeStr: string
): { hours: number; minutes: number; isValid: boolean } => {
  if (!timeStr || typeof timeStr !== "string") {
    return { hours: 0, minutes: 0, isValid: false };
  }

  const cleanTime = timeStr.trim().toUpperCase();
  const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/;
  const match = cleanTime.match(timeRegex);

  if (!match) {
    return { hours: 0, minutes: 0, isValid: false };
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2] || "0", 10);
  const ampm = match[3];

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return { hours: 0, minutes: 0, isValid: false };
  }

  if (ampm) {
    if (hours < 1 || hours > 12) {
      return { hours: 0, minutes: 0, isValid: false };
    }

    if (ampm === "PM" && hours !== 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }
  }

  return { hours, minutes, isValid: true };
};

export const timeToMinutes = (timeStr: string): number => {
  const { hours, minutes, isValid } = parseTime(timeStr);
  if (!isValid) {
    return Number.MAX_SAFE_INTEGER;
  }
  return hours * 60 + minutes;
};

export const sortRoutineItems = (items: RoutineItem[]): RoutineItem[] => {
  return [...items].sort((a, b) => {
    const timeA = timeToMinutes(a.time);
    const timeB = timeToMinutes(b.time);

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    const orderA = a.insertionOrder || 0;
    const orderB = b.insertionOrder || 0;
    return orderA - orderB;
  });
};