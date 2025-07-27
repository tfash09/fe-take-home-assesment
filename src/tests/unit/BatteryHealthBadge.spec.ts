import { render, screen } from '@testing-library/vue';
import BatteryHealthBadge from '@/components/BatteryHealthBadge.vue';
import { describe, it, expect } from 'vitest';

const createDevice = (status: 'healthy' | 'unhealthy' | 'unknown', usage: number | null) => ({
  status,
  averageDailyUsage: usage,
  serialNumber: 'ABC123',
  academyId: 1001,
  readingCount: 12
});

describe('BatteryHealthBadge.vue', () => {
  it('displays correct badge for healthy device', () => {
    render(BatteryHealthBadge, {
      props: {
        device: createDevice('healthy', 15.2),
        showUsage: true
      }
    });

    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('15.2%/day')).toBeInTheDocument();
  });

  it('displays correct badge for unhealthy device', () => {
    render(BatteryHealthBadge, {
      props: {
        device: createDevice('unhealthy', 8.6),
        showUsage: true
      }
    });

    expect(screen.getByText('Needs Replacement')).toBeInTheDocument();
    expect(screen.getByText('8.6%/day')).toBeInTheDocument();
  });

  it('displays "Unknown" for unknown status', () => {
    render(BatteryHealthBadge, {
      props: {
        device: createDevice('unknown', 4.0),
        showUsage: true
      }
    });

    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('4.0%/day')).toBeInTheDocument();
  });

  it('shows N/A when usage is null', () => {
    render(BatteryHealthBadge, {
      props: {
        device: createDevice('healthy', null),
        showUsage: true
      }
    });

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('does not show usage when showUsage is false', () => {
    render(BatteryHealthBadge, {
      props: {
        device: createDevice('healthy', 5.4),
        showUsage: false
      }
    });

    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.queryByText('5.4%/day')).not.toBeInTheDocument();
  });
});
