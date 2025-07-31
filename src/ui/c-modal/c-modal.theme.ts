import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/theme-ensemble';

export const { useTheme } = defineThemes({
  dark: {
    background: appThemes.dark.background,
  },
  light: {
    background: appThemes.light.background,
  },
});
