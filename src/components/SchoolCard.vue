<script setup lang="ts">
import { computed } from 'vue';
import { Tablet, AlertTriangle, CheckCircle, HelpCircle, ChevronRight } from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SchoolSummary } from '@/services/BatteryService';

interface Props {
  school: SchoolSummary;
  onViewDetails: (academyId: number) => void;
}

const props = defineProps<Props>();

const getPriorityLevel = computed(() => {
  const ratio = props.school.unhealthyDevices / props.school.totalDevices;
  if (ratio >= 0.5) return 'high';
  if (ratio >= 0.25) return 'medium';
  return 'low';
});

const getPriorityColor = computed(() => {
  switch (getPriorityLevel.value) {
    case 'high':
      return 'border-destructive bg-gradient-to-br from-destructive/5 to-destructive/10';
    case 'medium':
      return 'border-warning bg-gradient-to-br from-warning/5 to-warning/10';
    default:
      return 'border-border bg-gradient-card';
  }
});

const getPriorityIcon = computed(() => {
  switch (getPriorityLevel.value) {
    case 'high':
      return { icon: AlertTriangle, class: 'h-5 w-5 text-destructive' };
    case 'medium':
      return { icon: AlertTriangle, class: 'h-5 w-5 text-warning' };
    default:
      return { icon: CheckCircle, class: 'h-5 w-5 text-success' };
  }
});

</script>

<template>
  <Card :class="`transition-all duration-200 hover:shadow-elevated ${getPriorityColor}`">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-2">
          <Tablet class="h-5 w-5 text-primary" />
          Academy {{ props.school.academyId }}
        </CardTitle>
        <component :is="getPriorityIcon.icon" :class="getPriorityIcon.class" />

      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Stats Overview -->
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-3 rounded-lg bg-background/50">
          <div class="text-2xl font-bold text-foreground">
            {{ props.school.totalDevices }}
          </div>
          <div class="text-sm text-muted-foreground">Total Devices</div>
        </div>
        <div class="text-center p-3 rounded-lg bg-destructive/10">
          <div class="text-2xl font-bold text-destructive">
            {{ props.school.unhealthyDevices }}
          </div>
          <div class="text-sm text-muted-foreground">Need Replacement</div>
        </div>
      </div>

      <!-- Status Badges -->
      <div class="flex flex-wrap gap-2">
        <Badge
          v-if="props.school.healthyDevices > 0"
          class="bg-success text-success-foreground"
        >
          <CheckCircle class="h-3 w-3 mr-1" />
          {{ props.school.healthyDevices }} Healthy
        </Badge>
        <Badge
          v-if="props.school.unhealthyDevices > 0"
          class="bg-destructive text-destructive-foreground"
        >
          <AlertTriangle class="h-3 w-3 mr-1" />
          {{ props.school.unhealthyDevices }} Unhealthy
        </Badge>
        <Badge
          v-if="props.school.unknownDevices > 0"
          class="bg-unknown text-unknown-foreground"
        >
          <HelpCircle class="h-3 w-3 mr-1" />
          {{ props.school.unknownDevices }} Unknown
        </Badge>
      </div>

      <!-- Action Button -->
      <Button
        variant="outline"
        class="w-full"
        @click="() => props.onViewDetails(props.school.academyId)"
      >
        View Device Details
        <ChevronRight class="h-4 w-4 ml-2" />
      </Button>
    </CardContent>
  </Card>
</template>
