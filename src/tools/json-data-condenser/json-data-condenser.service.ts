type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function getKeySignature(obj: Record<string, any>): string {
  // Create a normalized signature string of sorted keys
  return Object.keys(obj).sort().join(',');
}

export function condenseJsonStructures(data: JsonValue): JsonValue {
  if (Array.isArray(data)) {
    const seenSignatures = new Set<string>();
    const result: JsonValue[] = [];

    for (const item of data) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const sig = getKeySignature(item);
        if (!seenSignatures.has(sig)) {
          seenSignatures.add(sig);
          result.push(condenseJsonStructures(item));
        }
      }
      else {
        // Keep non-object array items
        result.push(condenseJsonStructures(item));
      }
    }

    return result;
  }

  if (typeof data === 'object' && data !== null) {
    const result: Record<string, JsonValue> = {};
    for (const key in data) {
      result[key] = condenseJsonStructures(data[key]);
    }
    return result;
  }

  return data;
}
