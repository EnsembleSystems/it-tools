import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json data condenser',
  path: '/json-data-condenser',
  description: 'Removes duplicate-shaped objects in JSON arrays to simplify the data.',
  keywords: ['json', 'data', 'condenser'],
  component: () => import('./json-data-condenser.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-06-26'),
});
