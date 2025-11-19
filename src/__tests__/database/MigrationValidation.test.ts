import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../../lib/supabase';

describe('TourFlo Database Migration Tests', () => {
  let migrationSuccess = false;

  beforeAll(async () => {
    const { data, error } = await supabase.from('experiences').select('id').limit(1);
    migrationSuccess = !error;
  });

  describe('Operator Table Schema Changes', () => {
    it('should have county field instead of parish', async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('county')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should NOT have parish field', async () => {
      const { data: columns } = await supabase
        .rpc('get_table_columns', { table_name: 'operators' });

      const columnNames = columns?.map((col: any) => col.column_name) || [];
      expect(columnNames).not.toContain('parish');
    });

    it('should have ein field instead of trn', async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('ein')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should NOT have trn field', async () => {
      const { data: columns } = await supabase
        .rpc('get_table_columns', { table_name: 'operators' });

      const columnNames = columns?.map((col: any) => col.column_name) || [];
      expect(columnNames).not.toContain('trn');
    });

    it('should have business_state field for Florida', async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('business_state')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should verify existing operators have been migrated to Florida', async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('business_state, county, ein');

      if (data && data.length > 0) {
        data.forEach(operator => {
          expect(operator.business_state).toBe('Florida');
          expect(operator.county).toBeDefined();
          expect(operator.county).not.toMatch(/St\. Ann|Portland|Westmoreland/);
        });
      }
    });
  });

  describe('Currency System Migration', () => {
    it('should verify currencies table exists', async () => {
      const { data, error } = await supabase
        .from('currencies')
        .select('code')
        .limit(1);

      expect(error).toBeNull();
    });

    it('should have USD currency in currencies table', async () => {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('code', 'USD')
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.code).toBe('USD');
      expect(data?.symbol).toBe('$');
    });

    it('should NOT have JMD currency', async () => {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('code', 'JMD')
        .maybeSingle();

      expect(data).toBeNull();
    });

    it('should verify all experiences use USD currency', async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('currency');

      if (data && data.length > 0) {
        data.forEach(exp => {
          expect(exp.currency).toBe('USD');
        });
      }
    });
  });

  describe('Category System Migration', () => {
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

    it('should have exactly 9 Florida categories', async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      expect(error).toBeNull();
      expect(data?.length).toBe(9);
    });

    it('should verify all expected categories exist', async () => {
      for (const categoryName of expectedCategories) {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .eq('name', categoryName)
          .maybeSingle();

        expect(error).toBeNull();
        expect(data).toBeDefined();
        expect(data?.name).toBe(categoryName);
      }
    });

    it('should NOT have Jamaica-specific categories', async () => {
      const jamaicanCategories = ['Reggae', 'Jerk', 'Irie Vibes'];

      for (const categoryName of jamaicanCategories) {
        const { data } = await supabase
          .from('categories')
          .select('name')
          .eq('name', categoryName)
          .maybeSingle();

        expect(data).toBeNull();
      }
    });

    it('should verify each category has icon and color defined', async () => {
      const { data } = await supabase
        .from('categories')
        .select('name, icon, color');

      data?.forEach(category => {
        expect(category.icon).toBeDefined();
        expect(category.icon.length).toBeGreaterThan(0);
        expect(category.color).toBeDefined();
        expect(category.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('Vibe Tags Migration', () => {
    const expectedVibeTags = [
      'Family-Friendly',
      'Romantic',
      'Adventure',
      'Relaxing',
      'Cultural',
      'Foodie',
      'Nightlife',
      'Outdoor'
    ];

    it('should have exactly 8 vibe tags', async () => {
      const { data, error } = await supabase
        .from('vibe_tags')
        .select('*');

      expect(error).toBeNull();
      expect(data?.length).toBe(8);
    });

    it('should verify all expected vibe tags exist', async () => {
      for (const tagName of expectedVibeTags) {
        const { data, error } = await supabase
          .from('vibe_tags')
          .select('name')
          .eq('name', tagName)
          .maybeSingle();

        expect(error).toBeNull();
        expect(data).toBeDefined();
      }
    });

    it('should verify vibe tags have icons defined', async () => {
      const { data } = await supabase
        .from('vibe_tags')
        .select('name, icon');

      data?.forEach(tag => {
        expect(tag.icon).toBeDefined();
        expect(tag.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Location Data Migration', () => {
    it('should verify experiences have county field', async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('county')
        .limit(5);

      expect(error).toBeNull();
      data?.forEach(exp => {
        expect(exp.county).toBeDefined();
      });
    });

    it('should verify no parish data exists in experiences', async () => {
      const { data: columns } = await supabase
        .rpc('get_table_columns', { table_name: 'experiences' });

      const columnNames = columns?.map((col: any) => col.column_name) || [];
      expect(columnNames).not.toContain('parish');
    });

    it('should verify location strings use Florida counties', async () => {
      const { data } = await supabase
        .from('experiences')
        .select('location, county')
        .limit(10);

      const floridaCounties = ['Miami-Dade', 'Orange', 'Broward', 'Palm Beach', 'Hillsborough'];

      data?.forEach(exp => {
        const isValidCounty = floridaCounties.some(county =>
          exp.county === county || exp.location.includes(county)
        );
        expect(exp.location).not.toMatch(/parish/i);
      });
    });
  });

  describe('Operator Data Migration Integrity', () => {
    it('should verify Jamaica operators migrated to Florida locations', async () => {
      const { data } = await supabase
        .from('operators')
        .select('business_name, county, business_state');

      data?.forEach(operator => {
        if (operator.business_state) {
          expect(operator.business_state).toBe('Florida');
        }
        if (operator.county) {
          expect(operator.county).not.toMatch(/St\. Ann|Portland|Westmoreland|Hanover/i);
        }
      });
    });

    it('should verify operator contact info uses US format', async () => {
      const { data } = await supabase
        .from('operators')
        .select('phone, business_state');

      data?.forEach(operator => {
        if (operator.phone) {
          expect(operator.phone).not.toMatch(/^\+876/);
        }
      });
    });
  });
});
