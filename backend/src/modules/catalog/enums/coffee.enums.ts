export enum RoastLevel {
  LIGHT = 'light',
  MEDIUM_LIGHT = 'medium_light',
  MEDIUM = 'medium',
  MEDIUM_DARK = 'medium_dark',
  DARK = 'dark',
}

export enum ProcessingMethod {
  WASHED = 'washed',
  NATURAL = 'natural',
  HONEY = 'honey',
  ANAEROBIC = 'anaerobic',
  WET_HULLED = 'wet_hulled',
  DECAF = 'decaf',
}

export enum ProductCategory {
  GREEN_BEANS = 'green_beans',
  ROASTED_BEANS = 'roasted_beans',
  GROUND_COFFEE = 'ground_coffee',
  EQUIPMENT = 'equipment',
  SUBSCRIPTION_BOX = 'subscription_box',
}

// Reference list of flavor notes (the "flavor wheel"), kept as a curated constant
// rather than a separate lookup collection for this MVP pass.
export const FLAVOR_NOTES = [
  'chocolate',
  'caramel',
  'citrus',
  'berry',
  'stone_fruit',
  'floral',
  'nutty',
  'spice',
  'honey',
  'winey',
  'tropical_fruit',
  'herbal',
  'smoky',
  'earthy',
  'vanilla',
] as const;

export type FlavorNote = (typeof FLAVOR_NOTES)[number];
