import batteryData from '@/data/battery.json';

export interface BatteryReading {
  academyId: number;
  batteryLevel: number;
  employeeId: string;
  serialNumber: string;
  timestamp: string;
}

export interface DeviceHealth {
  serialNumber: string;
  academyId: number;
  status: 'healthy' | 'unhealthy' | 'unknown';
  averageDailyUsage: number | null;
  readingCount: number;
}

export interface SchoolSummary {
  academyId: number;
  totalDevices: number;
  unhealthyDevices: number;
  healthyDevices: number;
  unknownDevices: number;
  devices: DeviceHealth[];
}

class BatteryService {
  private data: BatteryReading[] = batteryData;

  analyzeDeviceHealth(): DeviceHealth[] {
    const deviceMap = new Map<string, BatteryReading[]>();

    this.data.forEach((reading) => {
      if (!deviceMap.has(reading.serialNumber)) {
        deviceMap.set(reading.serialNumber, []);
      }
      deviceMap.get(reading.serialNumber)!.push(reading);
    });

    const deviceHealthResults: DeviceHealth[] = [];

    deviceMap.forEach((readings, serialNumber) => {
      readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      const academyId = readings[0].academyId;
      const readingCount = readings.length;

      if (readingCount === 1) {
        deviceHealthResults.push({
          serialNumber,
          academyId,
          status: 'unknown',
          averageDailyUsage: null,
          readingCount
        });
        return;
      }

      let totalUsage = 0;
      let validIntervals = 0;
      let totalTimeSpan = 0;

      for (let i = 1; i < readings.length; i++) {
        const prev = readings[i - 1];
        const curr = readings[i];
        const timeDiff = new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime();
        const batteryDiff = prev.batteryLevel - curr.batteryLevel;

        if (batteryDiff > 0) {
          totalUsage += batteryDiff;
          validIntervals++;
          totalTimeSpan += timeDiff;
        }
      }

      let averageDailyUsage: number | null = null;
      let status: 'healthy' | 'unhealthy' | 'unknown' = 'unknown';

      if (validIntervals > 0 && totalTimeSpan > 0) {
        const totalDays = totalTimeSpan / (1000 * 60 * 60 * 24);
        averageDailyUsage = (totalUsage / totalDays) * 100;
        status = averageDailyUsage > 30 ? 'unhealthy' : 'healthy';
      }

      deviceHealthResults.push({
        serialNumber,
        academyId,
        status,
        averageDailyUsage,
        readingCount
      });
    });

    return deviceHealthResults;
  }

  getSchoolSummaries(): SchoolSummary[] {
    const deviceHealth = this.analyzeDeviceHealth();
    const schoolMap = new Map<number, SchoolSummary>();

    deviceHealth.forEach((device) => {
      if (!schoolMap.has(device.academyId)) {
        schoolMap.set(device.academyId, {
          academyId: device.academyId,
          totalDevices: 0,
          unhealthyDevices: 0,
          healthyDevices: 0,
          unknownDevices: 0,
          devices: []
        });
      }

      const school = schoolMap.get(device.academyId)!;
      school.totalDevices++;
      school.devices.push(device);

      switch (device.status) {
        case 'unhealthy':
          school.unhealthyDevices++;
          break;
        case 'healthy':
          school.healthyDevices++;
          break;
        case 'unknown':
          school.unknownDevices++;
          break;
      }
    });

    return Array.from(schoolMap.values()).sort((a, b) => b.unhealthyDevices - a.unhealthyDevices);
  }

  getSchoolDetails(academyId: number): SchoolSummary | null {
    const summaries = this.getSchoolSummaries();
    return summaries.find((s) => s.academyId === academyId) || null;
  }
}

export const batteryService = new BatteryService();
