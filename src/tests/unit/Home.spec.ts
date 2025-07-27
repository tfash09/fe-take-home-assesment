// tests/unit/Home.spec.ts
import { render, fireEvent } from '@testing-library/vue';
import Home from '../../views/Home.vue';
import { describe, it, vi } from 'vitest';

vi.mock('@/services/BatteryService', () => {
  return {
    batteryService: {
      getSchoolSummaries: () => [
        { academyId: 101, totalDevices: 10, unhealthyDevices: 3, healthyDevices: 7, devices: [] },
        { academyId: 202, totalDevices: 5, unhealthyDevices: 1, healthyDevices: 4, devices: [] },
        { academyId: 303, totalDevices: 8, unhealthyDevices: 0, healthyDevices: 8, devices: [] }
      ],
      getSchoolDetails: (id: number) => ({
        academyId: id,
        devices: [
          {
            serialNumber: 'XYZ123',
            status: 'healthy',
            averageDailyUsage: 1.2,
            readingCount: 100,
            academyId: id
          }
        ]
      })
    }
  };
});

describe('Home.vue', () => {
  it('filters schools by academy ID search', async () => {
    const { getByPlaceholderText, findByText } = render(Home);
    const input = getByPlaceholderText('Search by Academy ID...');
    await fireEvent.update(input, '202');

    await findByText('Academy 202');
  });

  it('shows no match message if filters eliminate all schools', async () => {
    const { getByPlaceholderText, findByText } = render(Home);
    const input = getByPlaceholderText('Search by Academy ID...');
    await fireEvent.update(input, '9999');

    await findByText('No Schools Match Filters');
  });
});
