import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { type DateParts, dateToEpoch, epochToDate, getISODateString } from '../epoch-converter.service';

process.env.TZ = 'America/Vancouver';

describe('epochToDate', () => {
  it('converts known epoch seconds to correct formatted date (America/Vancouver)', () => {
    const epoch = 1750707060;
    const expectedUTC = 'Mon, Jun 23, 2025, 19:31:00 UTC';
    const expectedLocal = 'Mon, Jun 23, 2025, 12:31:00 PDT';

    const result = epochToDate(epoch, {
      timeZone: 'America/Vancouver',
    });

    expect(result.local).toBe(expectedLocal);
    expect(result.utc).toBe(expectedUTC);
  });

  it('throws for invalid string input', () => {
    expect(() => epochToDate('not-a-number')).toThrowError(TypeError);
  });

  it('throws for NaN input', () => {
    expect(() => epochToDate(Number.NaN)).toThrowError(TypeError);
  });
});

describe('dateToEpoch', () => {
  it('converts a known local date to correct epoch (2025-06-20 13:48:00) with timezone offset', () => {
    const input = '2025-06-20T13:48:00-07:00';

    const expectedEpoch = 1750452480;
    const result = dateToEpoch(input);
    expect(result).toBe(expectedEpoch);
  });

  it('converts a UTC date to correct epoch', () => {
    const input = '2025-06-20T13:48:00';
    const expectedEpoch = 1750427280;
    const result = dateToEpoch(input, { parseAsUTC: true });
    expect(result).toBe(expectedEpoch);
  });

  it('throws for invalid date string', () => {
    expect(() => dateToEpoch('not-a-date')).toThrowError(TypeError);
  });

  it('throws for empty string', () => {
    expect(() => dateToEpoch('')).toThrowError(TypeError);
  });
});

describe('epochToDate - Year 2038 boundary', () => {
  it('converts max 32-bit signed int epoch correctly (2038-01-19 03:14:07)', () => {
    const epoch = 2147483647;

    const result = epochToDate(epoch, {
      timeZone: 'America/Vancouver',
    });

    const expectedLocal = 'Mon, Jan 18, 2038, 19:14:07 PST';

    const expectedUTC = 'Tue, Jan 19, 2038, 03:14:07 UTC';

    expect(result.local).toBe(expectedLocal);
    expect(result.utc).toBe(expectedUTC);
  });

  it('handles epoch just after 32-bit boundary (2038-01-19 03:14:08)', () => {
    const epoch = 2147483648;

    const result = epochToDate(epoch, {
      timeZone: 'America/Vancouver',
    });

    const expectedLocal = 'Mon, Jan 18, 2038, 19:14:08 PST';

    const expectedUTC = 'Tue, Jan 19, 2038, 03:14:08 UTC';

    expect(result.local).toBe(expectedLocal);
    expect(result.utc).toBe(expectedUTC);
  });
});

describe('dateToEpoch - Year 2038 boundary (UTC)', () => {
  it('converts "2038-01-19T03:14:07" to epoch 2147483647 in UTC mode', () => {
    const result = dateToEpoch('2038-01-19T03:14:07', { parseAsUTC: true });
    expect(result).toBe(2147483647);
  });

  it('converts "2038-01-19T03:14:08" to epoch 2147483648 in UTC mode', () => {
    const result = dateToEpoch('2038-01-19T03:14:08', { parseAsUTC: true });
    expect(result).toBe(2147483648);
  });
});

describe('getISODateString', () => {
  it('generates a correctly padded ISO date string from date parts', () => {
    const parts: DateParts = {
      year: '2025',
      month: '6',
      day: '3',
      hour: '9',
      minute: '5',
      second: '1',
    };

    const isoString = getISODateString(parts);
    expect(isoString).toBe('2025-06-03T09:05:01');
  });

  it('handles already padded inputs correctly', () => {
    const parts: DateParts = {
      year: '2025',
      month: '12',
      day: '31',
      hour: '23',
      minute: '59',
      second: '59',
    };

    const isoString = getISODateString(parts);
    expect(isoString).toBe('2025-12-31T23:59:59');
  });

  it('handles all-zero input values', () => {
    const parts: DateParts = {
      year: '2025',
      month: '0',
      day: '0',
      hour: '0',
      minute: '0',
      second: '0',
    };

    const isoString = getISODateString(parts);
    expect(isoString).toBe('2025-00-00T00:00:00');
  });
});
