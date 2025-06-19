import { describe, expect, it } from 'vitest';
import { decompress } from '../gzip-decompressor.service';

const validGzipBase64 = 'H4sIAAAAAAAAA/NIzcnJVwjPL8pJAQBWsRdKCwAAAA==';

describe('decompress', () => {
  it('correctly decompresses valid gzip base64 string', async () => {
    const result = await decompress(validGzipBase64);
    expect(result).toContain('Hello World');
  });

  it('throws error on invalid base64 string', async () => {
    await expect(() =>
      decompress('not-a-valid-gzip-base64'),
    ).rejects.toThrow();
  });
});
