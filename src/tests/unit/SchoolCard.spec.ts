import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import SchoolCard from '@/components/SchoolCard.vue'; // adjust path
import type { SchoolSummary } from '@/services/BatteryService';

const mockSchool: SchoolSummary = {
  academyId: 101,
  totalDevices: 20,
  healthyDevices: 10,
  unhealthyDevices: 5,
  unknownDevices: 5,
  devices: [
    {
      serialNumber: 'ABC123',
      status: 'healthy',
      averageDailyUsage: 10.5,
      readingCount: 25,
      academyId: 101
    },
    {
      serialNumber: 'XYZ789',
      status: 'unhealthy',
      averageDailyUsage: 20.1,
      readingCount: 12,
      academyId: 101
    }
  ]
};

describe('SchoolCard.vue', () => {
  it('renders school details correctly', () => {
    const onViewDetails = vi.fn();

    render(SchoolCard, {
      props: {
        school: mockSchool,
        onViewDetails
      }
    });

    // Titles
    expect(screen.getByText(/Academy 101/)).toBeInTheDocument();
    expect(screen.getByText('Total Devices')).toBeInTheDocument();
    expect(screen.getByText('Need Replacement')).toBeInTheDocument();

    // Values
    expect(screen.getByText('20')).toBeInTheDocument(); // total
    expect(screen.getByText('5')).toBeInTheDocument(); // unhealthy
    expect(screen.getByText('10 Healthy')).toBeInTheDocument();
    expect(screen.getByText('5 Unhealthy')).toBeInTheDocument();
    expect(screen.getByText('5 Unknown')).toBeInTheDocument();

    // Button
    expect(screen.getByRole('button', { name: /View Device Details/ })).toBeInTheDocument();
  });

  it('calls onViewDetails when button is clicked', async () => {
    const onViewDetails = vi.fn();

    render(SchoolCard, {
      props: {
        school: mockSchool,
        onViewDetails
      }
    });

    const button = screen.getByRole('button', { name: /View Device Details/ });
    await fireEvent.click(button);

    expect(onViewDetails).toHaveBeenCalledOnce();
    expect(onViewDetails).toHaveBeenCalledWith(101);
  });

  it('applies high priority style when unhealthy > 50%', () => {
    const onViewDetails = vi.fn();
    const highPrioritySchool: SchoolSummary = {
      ...mockSchool,
      unhealthyDevices: 11 // 11 / 20 = 55%
    };

    const { container } = render(SchoolCard, {
      props: {
        school: highPrioritySchool,
        onViewDetails
      }
    });

    expect(container.querySelector('.border-destructive')).toBeTruthy();
  });

  it('shows only available status badges', () => {
    const onViewDetails = vi.fn();
    const schoolWithOnlyHealthy: SchoolSummary = {
      ...mockSchool,
      unhealthyDevices: 0,
      unknownDevices: 0
    };

    render(SchoolCard, {
      props: {
        school: schoolWithOnlyHealthy,
        onViewDetails
      }
    });

    expect(screen.queryByText(/Unhealthy/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Unknown/)).not.toBeInTheDocument();
    expect(screen.getByText(/Healthy/)).toBeInTheDocument();
  });
});
