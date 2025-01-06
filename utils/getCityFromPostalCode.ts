export const getCityFromPostalCode = (
  postalCode: string
): string | undefined => {
  const prefix = parseInt(postalCode.slice(0, 4), 10); // Extract first 4 digits as a number

  if (prefix >= 0 && prefix <= 1999) {
    return 'Lisboa';
  } else if (prefix >= 2000 && prefix <= 2999) {
    return 'Santarém';
  } else if (prefix >= 3000 && prefix <= 3999) {
    return 'Coimbra';
  } else if (prefix >= 4000 && prefix <= 4999) {
    return 'Porto';
  } else if (prefix >= 5000 && prefix <= 5999) {
    return 'Vila Real';
  } else if (prefix >= 6000 && prefix <= 6999) {
    return 'Castelo Branco';
  } else if (prefix >= 7000 && prefix <= 7999) {
    return 'Évora';
  } else if (prefix >= 8000 && prefix <= 8999) {
    return 'Faro';
  } else if (prefix >= 9000 && prefix <= 9999) {
    return 'Funchal';
  }

  return undefined; // Return undefined for unknown postal codes
};
