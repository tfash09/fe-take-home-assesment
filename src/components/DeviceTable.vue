<template>
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Tablet class="h-5 w-5 text-primary" />
          Academy {{ academyId }} - Device Details
          <span class="text-sm text-muted-foreground ml-2">
            ({{ devices.length }} devices)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Avg Daily Usage</TableHead>
                <TableHead class="text-right">Readings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="device in sortedDevices"
                :key="device.serialNumber"
              >
                <TableCell class="font-mono text-sm">
                  <div class="flex items-center gap-2">
                    <Activity class="h-4 w-4 text-muted-foreground" />
                    {{ device.serialNumber }}
                  </div>
                </TableCell>
                <TableCell>
                  <BatteryHealthBadge :device="device" />
                </TableCell>
                <TableCell class="text-right">
                  <span
                    v-if="device.averageDailyUsage !== null"
                    :class="[
                      'font-medium',
                      device.averageDailyUsage > 30
                        ? 'text-destructive'
                        : 'text-success',
                    ]"
                  >
                    {{ device.averageDailyUsage.toFixed(1) }}%
                  </span>
                  <span v-else class="text-muted-foreground">N/A</span>
                </TableCell>
                <TableCell class="text-right text-muted-foreground">
                  {{ device.readingCount }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import BatteryHealthBadge from './BatteryHealthBadge.vue';
  import { Tablet, Activity } from 'lucide-vue-next'; // or your preferred Lucide Vue wrapper
  import type { DeviceHealth } from '@/services/BatteryService';
  import { computed } from 'vue';
  
  interface Props {
    devices: DeviceHealth[];
    academyId: number;
  }
  
  const props = defineProps<Props>();
  
  const sortedDevices = computed(() => {
    const statusOrder: Record<string, number> = {
      unhealthy: 0,
      unknown: 1,
      healthy: 2,
    };
  
    return [...props.devices].sort((a, b) => {
      const statusDiff =
        statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
  
      if (a.averageDailyUsage !== null && b.averageDailyUsage !== null) {
        return b.averageDailyUsage - a.averageDailyUsage;
      }
      return 0;
    });
  });
  </script>
  