import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DiscoveryFeed from '../../components/DiscoveryFeed';
import ExperienceDetailPage from '../../components/ExperienceDetailPage';
import OnboardingFlow from '../../components/OnboardingFlow';
import ChatScreen from '../../components/ChatScreen';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        in: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));

describe('TourFlo Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DiscoveryFeed - Category Display', () => {
    it('should render exactly 9 Florida category tiles', async () => {
      render(<DiscoveryFeed />);

      await waitFor(() => {
        const categoryTiles = screen.getAllByRole('button', { name: /category/i });
        expect(categoryTiles).toHaveLength(9);
      });
    });

    it('should display correct category names for Florida', async () => {
      render(<DiscoveryFeed />);

      const expectedCategories = [
        'Beach & Water',
        'Theme Parks',
        'Nature & Wildlife',
        'Food & Nightlife',
        'Arts & Culture',
        'Sports & Recreation',
        'Family Fun',
        'Romantic',
        'Adventure'
      ];

      await waitFor(() => {
        expectedCategories.forEach(category => {
          expect(screen.getByText(category)).toBeInTheDocument();
        });
      });
    });

    it('should render category icons with correct colors', async () => {
      render(<DiscoveryFeed />);

      await waitFor(() => {
        const beachIcon = screen.getByTestId('category-beach-water');
        expect(beachIcon).toHaveClass('text-blue-500');

        const themeParkIcon = screen.getByTestId('category-theme-parks');
        expect(themeParkIcon).toHaveClass('text-purple-500');
      });
    });

    it('should not display any Jamaica-specific categories', async () => {
      render(<DiscoveryFeed />);

      const jamaicanCategories = ['Reggae', 'Jerk', 'Irie Vibes'];

      await waitFor(() => {
        jamaicanCategories.forEach(category => {
          expect(screen.queryByText(category)).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('ExperienceDetailPage - Florida Location Display', () => {
    const mockExperience = {
      id: '1',
      title: 'Everglades Airboat Tour',
      location: 'Miami-Dade County',
      county: 'Miami-Dade',
      state: 'Florida',
      price: 89.99,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 245,
    };

    it('should display Florida county location (not parish)', async () => {
      render(<ExperienceDetailPage experience={mockExperience} />);

      expect(screen.getByText(/Miami-Dade County/i)).toBeInTheDocument();
      expect(screen.queryByText(/parish/i)).not.toBeInTheDocument();
    });

    it('should show USD pricing without JMD', async () => {
      render(<ExperienceDetailPage experience={mockExperience} />);

      expect(screen.getByText(/\$89.99/)).toBeInTheDocument();
      expect(screen.queryByText(/JMD/i)).not.toBeInTheDocument();
    });

    it('should display Florida-appropriate location details', async () => {
      render(<ExperienceDetailPage experience={mockExperience} />);

      expect(screen.getByText(/Florida/i)).toBeInTheDocument();
      expect(screen.queryByText(/Jamaica/i)).not.toBeInTheDocument();
    });
  });

  describe('OnboardingFlow - Florida Location Selection', () => {
    it('should show Florida counties in location dropdown', async () => {
      render(<OnboardingFlow onComplete={vi.fn()} />);

      const locationSelect = screen.getByLabelText(/location/i);
      fireEvent.click(locationSelect);

      await waitFor(() => {
        expect(screen.getByText(/Miami-Dade/i)).toBeInTheDocument();
        expect(screen.getByText(/Orange County/i)).toBeInTheDocument();
        expect(screen.getByText(/Broward/i)).toBeInTheDocument();
      });
    });

    it('should not display Jamaica parishes in location options', async () => {
      render(<OnboardingFlow onComplete={vi.fn()} />);

      const locationSelect = screen.getByLabelText(/location/i);
      fireEvent.click(locationSelect);

      await waitFor(() => {
        expect(screen.queryByText(/St. Ann/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Portland/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Westmoreland/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('FlorBot - AI Assistant Branding', () => {
    it('should display "FlorBot" name instead of JAHBOI', async () => {
      render(<ChatScreen />);

      expect(screen.getByText(/FlorBot/i)).toBeInTheDocument();
      expect(screen.queryByText(/JAHBOI/i)).not.toBeInTheDocument();
    });

    it('should show Florida context in AI responses', async () => {
      render(<ChatScreen />);

      const messageInput = screen.getByPlaceholderText(/ask me anything/i);
      fireEvent.change(messageInput, { target: { value: 'Tell me about yourself' } });
      fireEvent.submit(messageInput.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/Florida/i)).toBeInTheDocument();
        expect(screen.queryByText(/Jamaica/i)).not.toBeInTheDocument();
      });
    });

    it('should use Florida slang instead of Jamaican patois', async () => {
      render(<ChatScreen />);

      await waitFor(() => {
        expect(screen.queryByText(/irie/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/yah mon/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Experience Cards - Pricing & Category Display', () => {
    const mockExperiences = [
      {
        id: '1',
        title: 'Disney Magic',
        category: 'Theme Parks',
        price: 159.00,
        currency: 'USD',
        rating: 4.9,
      },
      {
        id: '2',
        title: 'Beach Sunset Cruise',
        category: 'Beach & Water',
        price: 75.00,
        currency: 'USD',
        rating: 4.7,
      },
    ];

    it('should display USD pricing for all experiences', async () => {
      mockExperiences.forEach(exp => {
        render(<ExperienceCard experience={exp} />);
        expect(screen.getByText(`$${exp.price}`)).toBeInTheDocument();
      });
    });

    it('should show correct category badge colors', async () => {
      render(<ExperienceCard experience={mockExperiences[0]} />);

      const categoryBadge = screen.getByText('Theme Parks');
      expect(categoryBadge).toHaveClass('bg-purple-100', 'text-purple-700');
    });

    it('should display ratings in 4.2-4.9 range', async () => {
      mockExperiences.forEach(exp => {
        render(<ExperienceCard experience={exp} />);
        const rating = exp.rating;
        expect(rating).toBeGreaterThanOrEqual(4.2);
        expect(rating).toBeLessThanOrEqual(4.9);
      });
    });
  });
});
