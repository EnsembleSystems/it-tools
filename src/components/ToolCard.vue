<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { ref, toRefs } from 'vue';
import FavoriteButton from './FavoriteButton.vue';

// import { useAppTheme } from '/theme_ensemble';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
// const appTheme = useAppTheme();

const isHovered = ref(false);

const cardStyle = computed(() => ({
  border: '2px solid',
  borderColor: isHovered.value ? '#2886BB' : 'transparent',
  transition: 'border-color 0.3s ease-in-out',
}));
</script>

<template>
  <router-link :to="tool.path" class="decoration-none">
    <!-- <c-card class="h-full transition transition-duration-0.5s !border-2px !hover:border-primary"> -->
    <c-card
      class="h-full"
      :style="cardStyle"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div flex items-center justify-between>
        <n-icon class="text-neutral-400 dark:text-neutral-600" size="40" :component="tool.icon" />

        <div flex items-center gap-8px>
          <div
            v-if="tool.isNew"
            class="rounded-full px-8px py-3px text-xs text-white dark:text-neutral-800"
            :style="{
              'background-color': theme.primaryColor,
            }"
          >
            {{ $t('toolCard.new') }}
          </div>

          <FavoriteButton :tool="tool" />
        </div>
      </div>

      <div class="truncat my-5px text-lg text-black dark:text-white">
        {{ tool.name }}
      </div>

      <div class="line-clamp-2 text-neutral-500 dark:text-neutral-400">
        {{ tool.description }}
      </div>
    </c-card>
  </router-link>
</template>

<!-- <style lang="less" scoped>
.ToolCard {

  &:hover {
    border-color: v-bind('appTheme.primary.color');
  }
}
</style> -->
