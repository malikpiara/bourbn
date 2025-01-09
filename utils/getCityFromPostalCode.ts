import rawPostalCodeMap from './postalCodeMap.json';

const postalCodeMap = rawPostalCodeMap as Record<string, string>;

export function getCityFromPostalCode(postalCode: string): string | undefined {
  // Remove any whitespace
  postalCode = postalCode.replace(/\s/g, '');

  // If the user typed something other than 7 digits, bail out
  if (postalCode.length !== 7) {
    return undefined;
  }

  // 1. Extract the first 4 digits for the prefix
  const prefix = postalCode.slice(0, 4);

  // 2. Extract the last 3 digits for the extension
  const extensionRaw = postalCode.slice(4); // e.g. "061"

  // 3. Convert extension to a number, then back to string to remove leading zeros
  const extension = parseInt(extensionRaw, 10).toString(); // "061" → "61"

  // 4. Construct the key
  const key = `${prefix}-${extension}`; // e.g. "3750-61"

  // 5. Lookup in postalCodeMap
  return capitalizeFirstLetter(postalCodeMap[key]);
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
