import ApiConstants from '../Constants/Api.constants';

export const resolveImage = img => {
  if (!img) return null;
  if (
    typeof img === 'string' &&
    (img.startsWith('http://') || img.startsWith('https://'))
  ) {
    return img;
  }
  const cleanPath =
    typeof img === 'string' && img.startsWith('/') ? img.slice(1) : img;
  return `${ApiConstants.imageBaseURL}${cleanPath}`;
};
