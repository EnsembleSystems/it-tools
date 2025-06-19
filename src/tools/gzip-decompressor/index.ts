import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Gzip decompressor',
  path: '/gzip-decompressor',
  description: 'Decompress GZip-encoded strings',
  keywords: ['gzip', 'decompressor'],
  component: () => import('./gzip-decompressor.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-06-13'),
});
