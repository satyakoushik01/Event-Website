/*
 * Resolves the story images without requiring the data file to know whether
 * an image lives in public/assets or src/assets.
 */
const localImages = import.meta.glob(
  [
    '../../assets/**/*.jpg',
    '../../assets/**/*.jpeg',
    '../../assets/**/*.png',
    '../../assets/**/*.webp',
    '../../assets/**/*.JPG',
    '../../assets/**/*.JPEG',
    '../../assets/**/*.PNG',
    '../../assets/**/*.WEBP',
  ],
  { eager: true, query: '?url', import: 'default' }
);

const entries = Object.entries(localImages);

const filenameOf = (value = '') =>
  value.split('/').pop().split('?')[0].toLowerCase();

export function resolveStoryImage(story, fallbackOnly = false) {
  const original = story?.image || '';
  const filename = filenameOf(original);

  const exact = entries.find(([path]) => filenameOf(path) === filename);
  if (exact) return exact[1];

  const category = String(story?.category || '').toLowerCase();
  const name = String(story?.names || '').toLowerCase();

  const keywords = [
    category.replace(/[^a-z]/g, ''),
    ...(category.includes('wedding') ? ['wedding', 'marriage'] : []),
    ...(category.includes('birthday') ? ['birthday', 'birth'] : []),
    ...(category.includes('corporate') ? ['corporate', 'conference', 'office'] : []),
    ...(category.includes('engagement') ? ['engagement', 'couple'] : []),
    ...(category.includes('celebration') ? ['celebration', 'party'] : []),
    ...(name.includes('25th') || name.includes('30th') ? ['birthday'] : []),
  ].filter(Boolean);

  const semantic = entries.find(([path]) => {
    const lower = path.toLowerCase();
    return keywords.some((keyword) => lower.includes(keyword));
  });

  if (semantic) return semantic[1];

  if (fallbackOnly) {
    return entries[0]?.[1] || '';
  }

  return original;
}
