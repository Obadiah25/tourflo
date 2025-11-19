import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

export const mockExperienceCard = {
  id: '1',
  title: 'Test Experience',
  description: 'Test Description',
  category: 'Beach & Water',
  price: 99.99,
  currency: 'USD',
  location: 'Miami Beach',
  county: 'Miami-Dade',
  state: 'Florida',
  rating: 4.7,
  reviewCount: 125,
  images: ['test-image.jpg'],
  duration: 120,
  operatorId: 'op-1',
};

export const ExperienceCard = ({ experience }: { experience: any }) => {
  return (
    <div data-testid="experience-card">
      <h3>{experience.title}</h3>
      <div className={`category-badge bg-${experience.category.toLowerCase().replace(/\s/g, '-')}-100 text-${experience.category.toLowerCase().replace(/\s/g, '-')}-700`}>
        {experience.category}
      </div>
      <p>${experience.price}</p>
      <p>{experience.rating}</p>
    </div>
  );
};
