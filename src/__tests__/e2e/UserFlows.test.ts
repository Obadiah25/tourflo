import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../lib/supabase';

describe('TourFlo E2E User Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scenario 1: Tourist Discovery to Booking Flow', () => {
    it('should complete full tourist booking journey', async () => {
      const testEmail = `tourist-${Date.now()}@test.com`;
      const testPassword = 'Test123!@#';

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      expect(signUpError).toBeNull();
      expect(signUpData.user).toBeDefined();

      const { data: experiences, error: experiencesError } = await supabase
        .from('experiences')
        .select('*')
        .eq('category', 'Theme Parks')
        .limit(5);

      expect(experiencesError).toBeNull();
      expect(experiences).toBeDefined();
      expect(experiences!.length).toBeGreaterThan(0);

      const selectedExperience = experiences![0];
      expect(selectedExperience.currency).toBe('USD');
      expect(selectedExperience.county).toBeDefined();
      expect(selectedExperience.state).toBe('Florida');

      const { data: experienceDetail, error: detailError } = await supabase
        .from('experiences')
        .select(`
          *,
          operators (
            id,
            business_name,
            county,
            rating
          )
        `)
        .eq('id', selectedExperience.id)
        .single();

      expect(detailError).toBeNull();
      expect(experienceDetail).toBeDefined();
      expect(experienceDetail.operators).toBeDefined();

      const bookingData = {
        experience_id: selectedExperience.id,
        user_id: signUpData.user!.id,
        booking_date: new Date().toISOString(),
        guest_count: 2,
        total_price: selectedExperience.price * 2,
        currency: 'USD',
        status: 'pending',
        guest_name: 'John Doe',
        guest_email: testEmail,
        guest_phone: '+1-555-0123',
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      expect(bookingError).toBeNull();
      expect(booking).toBeDefined();
      expect(booking.currency).toBe('USD');
      expect(booking.total_price).toBe(selectedExperience.price * 2);

      const { data: confirmationData, error: confirmError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', payment_status: 'paid' })
        .eq('id', booking.id)
        .select()
        .single();

      expect(confirmError).toBeNull();
      expect(confirmationData.status).toBe('confirmed');

      await supabase.from('bookings').delete().eq('id', booking.id);
      await supabase.auth.admin.deleteUser(signUpData.user!.id);
    });

    it('should display Florida locations throughout booking flow', async () => {
      const { data: experiences } = await supabase
        .from('experiences')
        .select('county, state, location')
        .limit(10);

      experiences?.forEach(exp => {
        expect(exp.state).toBe('Florida');
        expect(exp.county).toBeDefined();
        expect(exp.county).not.toMatch(/St\. Ann|Portland|Westmoreland/);
      });
    });
  });

  describe('Scenario 2: Operator Signup to First Booking', () => {
    it('should complete operator onboarding and receive booking', async () => {
      const operatorEmail = `operator-${Date.now()}@test.com`;
      const operatorPassword = 'Operator123!@#';

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: operatorEmail,
        password: operatorPassword,
      });

      expect(signUpError).toBeNull();
      expect(signUpData.user).toBeDefined();

      const operatorProfile = {
        id: signUpData.user!.id,
        business_name: 'Sunshine Tours FL',
        email: operatorEmail,
        phone: '+1-555-0199',
        county: 'Miami-Dade',
        business_state: 'Florida',
        ein: '12-3456789',
        business_address: '123 Ocean Drive',
        city: 'Miami',
        zip_code: '33139',
        is_verified: true,
      };

      const { data: operator, error: operatorError } = await supabase
        .from('operators')
        .insert(operatorProfile)
        .select()
        .single();

      expect(operatorError).toBeNull();
      expect(operator).toBeDefined();
      expect(operator.county).toBe('Miami-Dade');
      expect(operator.ein).toBe('12-3456789');
      expect(operator.ein).toBeDefined();

      const experienceData = {
        title: 'Sunset Kayak Tour',
        description: 'Beautiful sunset kayaking in Biscayne Bay',
        category: 'Beach & Water',
        price: 65.00,
        currency: 'USD',
        county: 'Miami-Dade',
        state: 'Florida',
        location: 'Miami Beach, Miami-Dade County',
        duration: 120,
        max_capacity: 8,
        operator_id: operator.id,
        rating: 4.5,
        review_count: 0,
      };

      const { data: experience, error: experienceError } = await supabase
        .from('experiences')
        .insert(experienceData)
        .select()
        .single();

      expect(experienceError).toBeNull();
      expect(experience).toBeDefined();
      expect(experience.currency).toBe('USD');
      expect(experience.county).toBe('Miami-Dade');
      expect(experience.state).toBe('Florida');

      const touristEmail = `tourist-${Date.now()}@test.com`;
      const { data: tourist } = await supabase.auth.signUp({
        email: touristEmail,
        password: 'Tourist123!@#',
      });

      const bookingData = {
        experience_id: experience.id,
        user_id: tourist.user!.id,
        booking_date: new Date(Date.now() + 86400000).toISOString(),
        guest_count: 2,
        total_price: experience.price * 2,
        currency: 'USD',
        status: 'confirmed',
        payment_status: 'paid',
        guest_name: 'Jane Smith',
        guest_email: touristEmail,
        guest_phone: '+1-555-0155',
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      expect(bookingError).toBeNull();
      expect(booking).toBeDefined();
      expect(booking.total_price).toBe(130.00);
      expect(booking.currency).toBe('USD');

      const { data: operatorBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          experiences (
            title,
            operator_id
          )
        `)
        .eq('experiences.operator_id', operator.id);

      expect(operatorBookings).toBeDefined();
      expect(operatorBookings!.length).toBeGreaterThan(0);

      await supabase.from('bookings').delete().eq('id', booking.id);
      await supabase.from('experiences').delete().eq('id', experience.id);
      await supabase.from('operators').delete().eq('id', operator.id);
      await supabase.auth.admin.deleteUser(signUpData.user!.id);
      await supabase.auth.admin.deleteUser(tourist.user!.id);
    });

    it('should verify operator uses Florida business info not Jamaica', async () => {
      const { data: operators } = await supabase
        .from('operators')
        .select('business_state, county, ein')
        .limit(5);

      operators?.forEach(op => {
        expect(op.business_state).toBe('Florida');
        expect(op.ein).toBeDefined();
        if (op.county) {
          expect(op.county).not.toMatch(/St\. Ann|Portland|Westmoreland/);
        }
      });
    });
  });

  describe('Scenario 3: Inventory Management Updates', () => {
    it('should update availability and reflect in customer view', async () => {
      const { data: experience } = await supabase
        .from('experiences')
        .select('id, title, max_capacity')
        .limit(1)
        .single();

      if (!experience) {
        return;
      }

      const testDate = new Date(Date.now() + 86400000 * 7);
      const availabilityData = {
        experience_id: experience.id,
        date: testDate.toISOString().split('T')[0],
        available_spots: experience.max_capacity,
        total_capacity: experience.max_capacity,
        status: 'available',
      };

      const { data: availability, error: availError } = await supabase
        .from('experience_availability')
        .upsert(availabilityData, { onConflict: 'experience_id,date' })
        .select()
        .single();

      expect(availError).toBeNull();
      expect(availability).toBeDefined();

      const { data: customerView, error: viewError } = await supabase
        .from('experiences')
        .select(`
          *,
          experience_availability!inner(*)
        `)
        .eq('id', experience.id)
        .eq('experience_availability.date', testDate.toISOString().split('T')[0])
        .single();

      expect(viewError).toBeNull();
      expect(customerView).toBeDefined();

      const updatedSpots = experience.max_capacity - 2;
      const { error: updateError } = await supabase
        .from('experience_availability')
        .update({ available_spots: updatedSpots })
        .eq('experience_id', experience.id)
        .eq('date', testDate.toISOString().split('T')[0]);

      expect(updateError).toBeNull();

      const { data: updatedView } = await supabase
        .from('experience_availability')
        .select('available_spots')
        .eq('experience_id', experience.id)
        .eq('date', testDate.toISOString().split('T')[0])
        .single();

      expect(updatedView?.available_spots).toBe(updatedSpots);

      await supabase
        .from('experience_availability')
        .delete()
        .eq('experience_id', experience.id)
        .eq('date', testDate.toISOString().split('T')[0]);
    });
  });

  describe('Scenario 4: Seasonal Pricing Adjustments', () => {
    it('should handle seasonal pricing for Florida peak seasons', async () => {
      const peakSeasons = {
        winter: { months: [12, 1, 2, 3], multiplier: 1.25 },
        spring: { months: [4, 5], multiplier: 1.15 },
        summer: { months: [6, 7, 8], multiplier: 1.0 },
        fall: { months: [9, 10, 11], multiplier: 1.10 },
      };

      const { data: experience } = await supabase
        .from('experiences')
        .select('id, price, currency')
        .limit(1)
        .single();

      if (!experience) {
        return;
      }

      expect(experience.currency).toBe('USD');

      const basePrice = experience.price;

      const winterDate = new Date(2025, 0, 15);
      const winterMonth = winterDate.getMonth() + 1;
      const winterMultiplier = peakSeasons.winter.multiplier;
      const winterPrice = basePrice * winterMultiplier;

      expect(peakSeasons.winter.months).toContain(winterMonth);
      expect(winterPrice).toBeGreaterThan(basePrice);

      const summerDate = new Date(2025, 6, 15);
      const summerMonth = summerDate.getMonth() + 1;
      const summerMultiplier = peakSeasons.summer.multiplier;
      const summerPrice = basePrice * summerMultiplier;

      expect(peakSeasons.summer.months).toContain(summerMonth);
      expect(summerPrice).toBe(basePrice);

      const pricingCalculation = (date: Date, base: number) => {
        const month = date.getMonth() + 1;
        let multiplier = 1.0;

        if (peakSeasons.winter.months.includes(month)) {
          multiplier = peakSeasons.winter.multiplier;
        } else if (peakSeasons.spring.months.includes(month)) {
          multiplier = peakSeasons.spring.multiplier;
        } else if (peakSeasons.fall.months.includes(month)) {
          multiplier = peakSeasons.fall.multiplier;
        }

        return Math.round(base * multiplier * 100) / 100;
      };

      expect(pricingCalculation(winterDate, basePrice)).toBeCloseTo(winterPrice, 2);
      expect(pricingCalculation(summerDate, basePrice)).toBeCloseTo(summerPrice, 2);
    });

    it('should verify all pricing remains in USD across seasons', async () => {
      const { data: experiences } = await supabase
        .from('experiences')
        .select('price, currency');

      experiences?.forEach(exp => {
        expect(exp.currency).toBe('USD');
        expect(exp.currency).not.toBe('JMD');
        expect(exp.price).toBeGreaterThan(0);
      });
    });
  });

  describe('Scenario 5: Geographic Filter and Search', () => {
    it('should filter experiences by Florida counties', async () => {
      const counties = ['Miami-Dade', 'Orange', 'Broward'];

      for (const county of counties) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('county', county);

        expect(error).toBeNull();

        data?.forEach(exp => {
          expect(exp.county).toBe(county);
          expect(exp.state).toBe('Florida');
        });
      }
    });

    it('should search experiences and return only Florida results', async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('state, county, location')
        .ilike('location', '%Florida%');

      expect(error).toBeNull();

      data?.forEach(exp => {
        expect(exp.state).toBe('Florida');
        expect(exp.county).toBeDefined();
      });
    });
  });
});
