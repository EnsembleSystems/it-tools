/**
 * Represents any valid JSON value, including nested objects and arrays.
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Recursively generates a deep signature string for a given JSON value.
 * This signature reflects the structure and key types of the value,
 * and is used to detect and eliminate redundant object structures in arrays.
 *
 * @param value - The JSON value to generate a structural signature for.
 * @returns A normalized string representing the structure of the value.
 */
function getDeepKeySignature(value: JsonValue): string {
  if (value === null || typeof value !== 'object') {
    return typeof value;
  }

  if (Array.isArray(value)) {
    return `array<${value.map(getDeepKeySignature).join('|')}>`;
  }

  const keys = Object.keys(value).sort();
  const nested = keys
    .map(key => `${key}:${getDeepKeySignature((value as Record<string, JsonValue>)[key])}`)
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
export function condenseJsonStructures(data: JsonValue): JsonValue {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    const seenSignatures = new Set<string>();
    const result: JsonValue[] = [];

    for (const item of data) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const signature = getDeepKeySignature(item);
        if (!seenSignatures.has(signature)) {
          seenSignatures.add(signature);
          result.push(condenseJsonStructures(item));
        }
      }
      else {
        result.push(condenseJsonStructures(item));
      }
    }

    return result;
  }

  const result: Record<string, JsonValue> = {};
  for (const key in data) {
    result[key] = condenseJsonStructures(data[key]);
  }
  return result;
}
