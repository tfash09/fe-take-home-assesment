<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Input from '@/components/ui/input/Input.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SchoolCard from '../components/SchoolCard.vue';
import DeviceTable from '../components/DeviceTable.vue';
import { batteryService } from '@/services/BatteryService';
import { ArrowLeft, Battery, Shield, AlertTriangle, Search, Filter } from 'lucide-vue-next';

const selectedSchool = ref<number | null>(null);
const priorityFilter = ref<string>('all');
const searchTerm = ref<string>('');

const schools = batteryService.getSchoolSummaries();
const selectedSchoolData = computed(() => selectedSchool.value ? batteryService.getSchoolDetails(selectedSchool.value) : null);

const getPriorityLevel = (unhealthyDevices: number) => {
  if (unhealthyDevices >= 3) return 'high';
  if (unhealthyDevices >= 1) return 'medium';
  return 'low';
};

const filteredSchools = computed(() => {
  return schools.filter(school => {
    const matchesPriority = priorityFilter.value === 'all' || getPriorityLevel(school.unhealthyDevices) === priorityFilter.value;
    const matchesSearch = searchTerm.value === '' || school.academyId.toString().includes(searchTerm.value);
    return matchesPriority && matchesSearch;
  });
});

const totalStats = computed(() => {
  return schools.reduce((acc, school) => ({
    totalDevices: acc.totalDevices + school.totalDevices,
    unhealthyDevices: acc.unhealthyDevices + school.unhealthyDevices,
    healthyDevices: acc.healthyDevices + school.healthyDevices
  }), { totalDevices: 0, unhealthyDevices: 0, healthyDevices: 0 });
});
</script>

<template>
  <div class="min-h-screen bg-gradient-background">
    <div class="container mx-auto px-4 py-8">
      <template v-if="selectedSchool && selectedSchoolData">
        <div class="mb-6">
          <Button variant="outline" @click="selectedSchool = null" class="mb-4">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <h1 class="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Academy {{ selectedSchool }} Details
          </h1>
          <p class="text-muted-foreground mt-2">
            Detailed battery health analysis for all devices within School
          </p>
        </div>

        <DeviceTable :devices="selectedSchoolData.devices" :academyId="selectedSchool" />
      </template>

      <template v-else>
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold bg-gradient-primary bg-clip-text text-primary mb-2">
            Schools Battery Field Support
          </h1>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay ahead of battery issues by tracking device health across schools. Quickly find where replacements are needed to keep classrooms running without interruption.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card class="bg-gradient-card shadow-card">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-lg">
                <Battery class="h-5 w-5 text-primary" />
                Total Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-foreground">{{ totalStats.totalDevices }}</div>
              <p class="text-sm text-muted-foreground">Across all academies</p>
            </CardContent>
          </Card>

          <Card class="bg-gradient-card shadow-card">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-lg">
                <AlertTriangle class="h-5 w-5 text-destructive" />
                Need Replacement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-destructive">{{ totalStats.unhealthyDevices }}</div>
              <p class="text-sm text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card class="bg-gradient-card shadow-card">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-lg">
                <Shield class="h-5 w-5 text-success" />
                Healthy Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-success">{{ totalStats.healthyDevices }}</div>
              <p class="text-sm text-muted-foreground">Operating normally</p>
            </CardContent>
          </Card>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">School Priority Ranking</h2>
          <p class="text-muted-foreground mb-4">
            Schools are ranked by number of devices needing battery replacement. High-priority schools require immediate field technician visits.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex items-center gap-2">
              <Filter class="h-4 w-4 text-muted-foreground" />
              <Select v-model="priorityFilter">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority (3+ devices)</SelectItem>
                  <SelectItem value="medium">Medium Priority (1-2 devices)</SelectItem>
                  <SelectItem value="low">Low Priority (0 devices)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center gap-2 flex-1 max-w-md">
              <Search class="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Academy ID..."
                v-model="searchTerm"
                class="flex-1"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SchoolCard
            v-for="school in filteredSchools"
            :key="school.academyId"
            :school="school"
            @view-details="selectedSchool = school.academyId"
          />
        </div>

        <Card v-if="filteredSchools.length === 0 && schools.length > 0" class="text-center py-12">
          <CardContent>
            <Filter class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-semibold mb-2">No Schools Match Filters</h3>
            <p class="text-muted-foreground">
              Try adjusting your priority level or search criteria.
            </p>
          </CardContent>
        </Card>

        <Card v-if="schools.length === 0" class="text-center py-12">
          <CardContent>
            <Battery class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-semibold mb-2">No Data Available</h3>
            <p class="text-muted-foreground">
              No battery readings found. Please ensure the data source is available.
            </p>
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
