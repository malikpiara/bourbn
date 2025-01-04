export const formatNIF = (nif: string): string => {
  return nif.replace(/(\d{3})(?=\d)/g, '$1 ');
};

export const formatPostalCode = (postalCode: string): string => {
  if (!postalCode) return postalCode;
  return postalCode.replace(/(\d{4})(\d{3})/, '$1-$2');
};
