import { describe, expect, it } from 'vitest';
import { type JsonValue, condenseJsonStructures } from '../json-data-condenser.service';

const asJsonValue = <T extends JsonValue>(val: T): T => val;

describe('condenseJsonStructures', () => {
  it('removes duplicate object structures in an array but keeps unique ones', () => {
    const input = asJsonValue({
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'David', email: 'david@example.com' },
        { id: 5, name: 'Eve' },
        { name: 'Frank', email: 'frank@example.com' },
        { id: 6, name: 'Grace', email: 'grace@example.com' },
        { name: 'Heidi', phone: '123-456-7890' },
      ],
      status: 'active',
    });

    const output = condenseJsonStructures(input, { preserveKeyOrder: true });

    expect(output).toEqual({
      users: [
        { id: 1, name: 'Alice' },
        { id: 4, name: 'David', email: 'david@example.com' },
        { name: 'Frank', email: 'frank@example.com' },
        { name: 'Heidi', phone: '123-456-7890' },
      ],
      status: 'active',
    });
  });

  it('preserves key order if specified', () => {
    const input = asJsonValue({
      people: [
        { id: 1, name: 'Alice' },
        { name: 'Alice', id: 1 }, // Same keys but different order
      ],
    });

    const output = condenseJsonStructures(input, { preserveKeyOrder: true });

    expect(output).toEqual({
      people: [
        { id: 1, name: 'Alice' },
        { name: 'Alice', id: 1 },
      ],
    });
  });

  it('treats objects with same keys but different order as equal when preserveKeyOrder is false', () => {
    const input = asJsonValue({
      people: [
        { id: 1, name: 'Alice' },
        { name: 'Alice', id: 1 },
      ],
    });

    const output = condenseJsonStructures(input, { preserveKeyOrder: false });

    expect(output).toEqual({
      people: [
        { id: 1, name: 'Alice' },
      ],
    });
  });

  it('keeps all non-array values untouched', () => {
    const input = asJsonValue({
      status: 'ok',
      count: 5,
      success: true,
      metadata: {
        source: 'api',
        timestamp: '2025-06-27T12:00:00Z',
      },
    });

    const output = condenseJsonStructures(input, { preserveKeyOrder: false });

    expect(output).toEqual(input);
  });

  it('keeps non-object array values untouched', () => {
    const input = asJsonValue([1, 2, 3, 'a', true, null]);

    const output = condenseJsonStructures(input, { preserveKeyOrder: false });

    expect(output).toEqual([1, 2, 3, 'a', true, null]);
  });

  it('returns primitive values unchanged', () => {
    expect(condenseJsonStructures(42, { preserveKeyOrder: false })).toBe(42);
    expect(condenseJsonStructures('hello', { preserveKeyOrder: false })).toBe('hello');
    expect(condenseJsonStructures(null, { preserveKeyOrder: false })).toBe(null);
    expect(condenseJsonStructures(true, { preserveKeyOrder: false })).toBe(true);
  });

  it('handles nested object arrays and preserves unique structures', () => {
    const input = asJsonValue({
      data: {
        results: [
          {
            id: '1',
            components: [
              { content_type: 'text', content: { format: 'markdown', text: 'Foo' } },
              { content_type: 'video', content: { video_id: 'v1', duration: '1:00', platform: 'yt' } },
              { content_type: 'image', content: { url: 'i.jpg', alt: 'Bar' } },
              { content_type: 'text', content: { format: 'markdown', text: 'Baz' } },
            ],
          },
          {
            id: '2',
            components: [
              { content_type: 'code', content: { lang: 'js', code: 'x' } },
              { content_type: 'code', content: { lang: 'py', code: 'y' } },
            ],
          },
        ],
      },
    });

    const output = condenseJsonStructures(input, { preserveKeyOrder: false });

    expect(output).toEqual({
      data: {
        results: [
          {
            id: '1',
            components: [
              { content_type: 'text', content: { format: 'markdown', text: 'Foo' } },
              { content_type: 'video', content: { video_id: 'v1', duration: '1:00', platform: 'yt' } },
              { content_type: 'image', content: { url: 'i.jpg', alt: 'Bar' } },
            ],
          },
          {
            id: '2',
            components: [
              { content_type: 'code', content: { lang: 'js', code: 'x' } },
            ],
          },
        ],
      },
    });
  });
});
