/**
 * Represents any valid JSON value, including nested objects and arrays.
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Checks if a value is a plain (non-array) object.
 *
 * @param val - The value to check.
 * @returns True if the value is a non-null, non-array object.
 */
function isPlainObject(val: unknown): val is Record<string, JsonValue> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Recursively generates a deep signature string for a given JSON value.
 * This signature reflects the structure and key types of the value,
 * and is used to detect and eliminate redundant object structures in arrays.
 *
 * @param value - The JSON value to generate a structural signature for.
 * @param preserveOrder - Whether to preserve object key order (default: false).
 * @returns A normalized string representing the structure of the value.
 */
function getDeepKeySignature(value: JsonValue, preserveOrder = false): string {
  if (value === null || typeof value !== 'object') {
    return typeof value;
  }

  if (Array.isArray(value)) {
    return `array<${value.map(v => getDeepKeySignature(v, preserveOrder)).join('|')}>`;
  }

  const keys = preserveOrder ? Object.keys(value) : Object.keys(value).sort();
  const nested = keys
    .map(key => `${key}:${getDeepKeySignature((value as Record<string, JsonValue>)[key], preserveOrder)}`)
    .join(',');

  return `{${nested}}`;
}

/**
 * Recursively condenses a JSON object by removing redundant objects
 * with identical structures (key shape and nested types) in arrays.
 *
 * For arrays of objects, only one representative per unique structure
 * is kept. Objects with additional or differing key paths are preserved.
 *
 * Non-array values and primitives are returned unchanged.
 *
 * @param data - The JSON value to condense.
 * @returns A condensed version of the original JSON value.
 */
export function condenseJsonStructures(data: JsonValue, options?: { preserveKeyOrder?: boolean }): JsonValue {
  const preserveOrder = options?.preserveKeyOrder ?? false;

  // Case 1: Handle arrays
  if (Array.isArray(data)) {
    const seenSignatures = new Set<string>();
    const result: JsonValue[] = [];

    for (const item of data) {
      if (isPlainObject(item)) {
        const signature = getDeepKeySignature(item, preserveOrder);
        if (!seenSignatures.has(signature)) {
          seenSignatures.add(signature);
          result.push(condenseJsonStructures(item, options));
        }
      }
      else {
        result.push(condenseJsonStructures(item, options));
      }
    }

    return result;
  }

  // Case 2: Handle plain objects
  if (isPlainObject(data)) {
    const result: Record<string, JsonValue> = {};
    for (const key of Object.keys(data)) {
      result[key] = condenseJsonStructures(data[key], options);
    }
    return result;
  }

  // Case 3: Base case – primitive (string, number, boolean, null)
  return data;
}
