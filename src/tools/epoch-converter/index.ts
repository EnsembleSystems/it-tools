import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Epoch converter',
  path: '/epoch-converter',
  description: 'Converts epoch to human readable date and vice versa',
  keywords: ['epoch', 'converter'],
  component: () => import('./epoch-converter.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-06-19'),
});
