// src/tests/unit/DeviceTable.spec.ts
import { render, screen } from '@testing-library/vue';
import DeviceTable from '@/components/DeviceTable.vue'; // Update if your path differs
import type { DeviceHealth } from '@/services/BatteryService';
import { describe, expect, it } from 'vitest';

const mockDevices: DeviceHealth[] = [
  {
    serialNumber: 'SN-001',
    academyId: 101,
    status: 'healthy',
    averageDailyUsage: 20.5,
    readingCount: 12
  },
  {
    serialNumber: 'SN-002',
    academyId: 101,
    status: 'unhealthy',
    averageDailyUsage: 35.1,
    readingCount: 8
  },
  {
    serialNumber: 'SN-003',
    academyId: 101,
    status: 'unknown',
    averageDailyUsage: null,
    readingCount: 5
  }
];

describe('DeviceTable.vue', () => {
  it('renders the card title with academy ID and device count', () => {
    render(DeviceTable, {
      props: {
        devices: mockDevices,
        academyId: 101
      }
    });

    expect(screen.getByText(/Academy 101 - Device Details/)).toBeInTheDocument();
    expect(screen.getByText('(3 devices)')).toBeInTheDocument();
  });

  it('renders each device row with correct data', () => {
    render(DeviceTable, {
      props: {
        devices: mockDevices,
        academyId: 1
      }
    });

    // Serial numbers
    expect(screen.getByText('SN-001')).toBeInTheDocument();
    expect(screen.getByText('SN-002')).toBeInTheDocument();
    expect(screen.getByText('SN-003')).toBeInTheDocument();

    // Usage
    expect(screen.getByText('20.5%')).toBeInTheDocument();
    expect(screen.getByText('35.1%')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();

    // Reading counts
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows BatteryHealthBadge component for each device', () => {
    render(DeviceTable, {
      props: {
        devices: mockDevices,
        academyId: 5
      }
    });

    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Needs Replacement')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
