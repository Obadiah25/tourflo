import { describe, it, expect, beforeAll } from 'vitest';
import mockData from '../../../TOURFLO_MOCK_DATA.json';

describe('TourFlo Data Validation Tests', () => {
  let experiences: any[];
  let operators: any[];
  let categories: any[];

  beforeAll(() => {
    experiences = mockData.experiences || [];
    operators = mockData.operators || [];
    categories = mockData.categories || [];
  });

  describe('Mock Experience Data Integrity', () => {
    it('should load exactly 45 mock experiences', () => {
      expect(experiences).toBeDefined();
      expect(experiences.length).toBe(45);
    });

    it('should have all required fields for each experience', () => {
      const requiredFields = [
        'id',
        'title',
        'description',
        'category',
        'price',
        'currency',
        'location',
        'county',
        'state',
        'rating',
        'reviewCount',
        'images',
        'duration',
        'operatorId'
      ];

      experiences.forEach((exp, index) => {
        requiredFields.forEach(field => {
          expect(exp[field], `Experience ${index} missing field: ${field}`).toBeDefined();
        });
      });
    });

    it('should verify all experiences use USD currency only', () => {
      experiences.forEach(exp => {
        expect(exp.currency).toBe('USD');
        expect(exp.currency).not.toBe('JMD');
      });
    });

    it('should verify pricing is in valid USD range', () => {
      experiences.forEach(exp => {
        expect(exp.price).toBeGreaterThan(0);
        expect(exp.price).toBeLessThan(1000);
        expect(typeof exp.price).toBe('number');
      });
    });

    it('should verify no JMD pricing exists in data', () => {
      const dataString = JSON.stringify(experiences);
      expect(dataString).not.toContain('JMD');
      expect(dataString).not.toContain('J$');
    });
  });

  describe('Florida Location Validation', () => {
    const validFloridaCounties = [
      'Miami-Dade',
      'Orange',
      'Broward',
      'Palm Beach',
      'Hillsborough',
      'Pinellas',
      'Duval',
      'Lee',
      'Polk',
      'Brevard',
      'Collier',
      'Monroe',
      'Sarasota',
      'Seminole',
      'Manatee'
    ];

    const jamaicanParishes = [
      'St. Ann',
      'Portland',
      'Westmoreland',
      'Hanover',
      'Trelawny',
      'St. James',
      'Kingston',
      'St. Catherine'
    ];

    it('should verify all locations are valid Florida counties', () => {
      experiences.forEach(exp => {
        expect(validFloridaCounties).toContain(exp.county);
      });
    });

    it('should verify no Jamaican parishes exist in data', () => {
      const dataString = JSON.stringify(experiences);

      jamaicanParishes.forEach(parish => {
        expect(dataString).not.toContain(parish);
      });
    });

    it('should verify state is always "Florida"', () => {
      experiences.forEach(exp => {
        expect(exp.state).toBe('Florida');
        expect(exp.state).not.toBe('Jamaica');
      });
    });

    it('should verify location strings contain "County" not "Parish"', () => {
      experiences.forEach(exp => {
        if (exp.location.includes('County') || exp.location.includes('county')) {
          expect(exp.location).toMatch(/county/i);
        }
        expect(exp.location).not.toMatch(/parish/i);
      });
    });
  });

  describe('Category System Validation', () => {
    const validCategories = [
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

    it('should verify exactly 9 categories exist', () => {
      expect(categories.length).toBe(9);
    });

    it('should verify all experiences use valid categories', () => {
      experiences.forEach(exp => {
        expect(validCategories).toContain(exp.category);
      });
    });

    it('should verify no Jamaica-specific categories exist', () => {
      const invalidCategories = ['Reggae', 'Jerk', 'Beach (Jamaica)', 'Irie Vibes'];

      experiences.forEach(exp => {
        expect(invalidCategories).not.toContain(exp.category);
      });
    });

    it('should verify each category has at least 3 experiences', () => {
      validCategories.forEach(category => {
        const count = experiences.filter(exp => exp.category === category).length;
        expect(count, `Category "${category}" should have at least 3 experiences`).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('Rating System Validation', () => {
    it('should verify all ratings are in 4.2-4.9 range', () => {
      experiences.forEach(exp => {
        expect(exp.rating).toBeGreaterThanOrEqual(4.2);
        expect(exp.rating).toBeLessThanOrEqual(4.9);
      });
    });

    it('should verify rating precision is one decimal place', () => {
      experiences.forEach(exp => {
        const decimalPlaces = (exp.rating.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(1);
      });
    });

    it('should verify review counts are realistic', () => {
      experiences.forEach(exp => {
        expect(exp.reviewCount).toBeGreaterThan(0);
        expect(exp.reviewCount).toBeLessThan(10000);
      });
    });
  });

  describe('Operator Data Validation', () => {
    it('should verify operator IDs match experiences', () => {
      const operatorIds = operators.map(op => op.id);

      experiences.forEach(exp => {
        expect(operatorIds).toContain(exp.operatorId);
      });
    });

    it('should verify operators have Florida business info', () => {
      operators.forEach(op => {
        expect(op.businessState).toBe('Florida');
        expect(op.businessState).not.toBe('Jamaica');
      });
    });

    it('should verify operators have EIN not TRN', () => {
      operators.forEach(op => {
        if (op.taxId) {
          expect(op.ein || op.EIN).toBeDefined();
          expect(op.trn || op.TRN).toBeUndefined();
        }
      });
    });
  });
});
