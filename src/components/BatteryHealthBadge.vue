<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import type { DeviceHealth } from '@/services/BatteryService';
import { computed } from 'vue';

interface Props {
  device: DeviceHealth;
  showUsage?: boolean;
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  switch (props.device.status) {
    case 'healthy':
      return 'bg-success text-success-foreground';
    case 'unhealthy':
      return 'bg-destructive text-destructive-foreground';
    case 'unknown':
    default:
      return 'bg-unknown text-unknown-foreground';
  }
});

const formattedStatus = computed(() => {
  switch (props.device.status) {
    case 'healthy':
      return 'Healthy';
    case 'unhealthy':
      return 'Needs Replacement';
    case 'unknown':
    default:
      return 'Unknown';
  }
});

const formattedUsage = computed(() => {
  if (props.device.averageDailyUsage === null) return 'N/A';
  return `${props.device.averageDailyUsage.toFixed(1)}%/day`;
});
</script>

<template>
  <div class="flex items-center gap-2">
    <Badge :class="statusClass">
      {{ formattedStatus }}
    </Badge>
    <span v-if="showUsage" class="text-sm text-muted-foreground">
      {{ formattedUsage }}
    </span>
  </div>
</template>
