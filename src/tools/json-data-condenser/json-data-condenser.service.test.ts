import { describe, expect, it } from 'vitest';
import { condenseJsonStructures } from './json-data-condenser.service';

describe('condenseJsonStructures', () => {
  it('removes duplicate object structures in an array', () => {
    const input = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'David', email: 'david@example.com' },
        { id: 5, name: 'Eve' },
      ],
      status: 'active',
    };

    const output = condenseJsonStructures(input);

    expect(output).toEqual({
      users: [
        { id: 1, name: 'Alice' },
        { id: 4, name: 'David', email: 'david@example.com' },
      ],
      status: 'active',
    });
  });

  it('keeps all non-array values intact', () => {
    const input = {
      status: 'ok',
      count: 5,
      success: true,
      metadata: {
        source: 'api',
      },
    };

    const output = condenseJsonStructures(input);

    expect(output).toEqual(input);
  });

  it('keeps non-object array values', () => {
    const input = [1, 2, 3, 'a', true, null];

    const output = condenseJsonStructures(input);

    expect(output).toEqual([1, 2, 3, 'a', true, null]);
  });

  it('recursively condenses nested object arrays', () => {
    const input = {
      groups: [
        {
          name: 'Group A',
          users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
            { id: 4, name: 'David', email: 'david@example.com' },
            { id: 5, name: 'Eve' },
          ],
        },
      ],
    };

    const output = condenseJsonStructures(input);

    expect(output).toEqual({
      groups: [
        {
          name: 'Group A',
          users: [
            { id: 1, name: 'Alice' },
            { id: 4, name: 'David', email: 'david@example.com' },
          ],
        },
      ],
    });
  });

  it('returns primitive values unchanged', () => {
    expect(condenseJsonStructures(42)).toBe(42);
    expect(condenseJsonStructures('hello')).toBe('hello');
    expect(condenseJsonStructures(null)).toBe(null);
    expect(condenseJsonStructures(true)).toBe(true);
  });
});
