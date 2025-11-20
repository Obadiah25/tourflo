import { floridaExperiences } from './floridaData';

export const sampleExperiences = floridaExperiences.map(exp => ({
  ...exp,
  // Map new fields to old fields for backward compatibility where needed, 
  // or just keep them as is if we are updating components.
  // The old structure had: id, title, description, image_url, video_url, price_jmd, price_usd, location_name, category, duration_minutes, operator_id

  // Mapping for compatibility (though we will update components to use new fields)
  price_jmd: exp.price_usd * 155, // Approximate conversion
  category: exp.category_id,
  duration_minutes: exp.duration_hours * 60,
  operator_id: 'op-' + exp.id,
}));

export type Experience = typeof sampleExperiences[0];

