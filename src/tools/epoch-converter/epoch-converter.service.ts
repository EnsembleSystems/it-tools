const MILLISECONDS_THRESHOLD = 1_000_000_000_000;
const MILLISECONDS_IN_SECOND = 1000;

export interface DateParts {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
}

/**
 * Converts a Unix epoch timestamp (in seconds or milliseconds) to a human-readable date.
 *
 * @param epoch - The epoch timestamp to convert (number or string).
 * @param options - Optional timeZone setting for local time formatting.
 * @returns An object with both the local formatted string and UTC string.
 */
export function epochToDate(
  epoch: string | number,
  options?: { timeZone?: string },
): { local: string; utc: string } {
  const num = typeof epoch === 'string' ? Number.parseInt(epoch, 10) : epoch;

  if (Number.isNaN(num)) {
    throw new TypeError('Invalid epoch timestamp');
  }

  const isSecondsPrecision = num < MILLISECONDS_THRESHOLD;
  const timestampInMs = isSecondsPrecision
    ? num * MILLISECONDS_IN_SECOND
    : num;

  const date = new Date(timestampInMs);

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZoneName: 'short',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const localFormatter = new Intl.DateTimeFormat('en-US', {
    ...formatOptions,
    timeZone: options?.timeZone,
  });

  const utcFormatter = new Intl.DateTimeFormat('en-US', {
    ...formatOptions,
    timeZone: 'UTC',
  });

  return {
    local: localFormatter.format(date),
    utc: utcFormatter.format(date),
  };
}

/**
 * Converts a human-readable ISO date string into a Unix epoch timestamp (in seconds).
 *
 * @param dateString - A string in ISO format (e.g. "2025-06-20T13:48:00").
 * @param options - Optional flag to interpret the date string as UTC time.
 * @returns Epoch time as a number in seconds.
 */
export function dateToEpoch(
  dateString: string,
  options?: {
    parseAsUTC?: boolean // if true, the date string will be parsed as UTC
  },
): number {
  const { parseAsUTC } = options ?? {};

  let normalizedDateString: string = dateString;
  if (parseAsUTC && !dateString.endsWith('Z')) {
    normalizedDateString = `${dateString}Z`;
  }

  const date = new Date(normalizedDateString);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid date string');
  }

  return Math.floor(date.getTime() / 1000);
}

/**
 * Creates an ISO 8601 date string (e.g., "2025-06-20T13:48:00") from date parts.
 * Ensures all components are zero-padded to 2 digits.
 *
 * @param parts - An object containing the year, month, day, hour, minute, and second.
 * @returns A valid ISO string.
 */
export function getISODateString({
  year,
  month,
  day,
  hour,
  minute,
  second,
}: DateParts): string {
  const pad = (value: string) => value.toString().padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
}
