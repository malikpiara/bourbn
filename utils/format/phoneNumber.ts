export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return ''; // Handle null or empty phone number

  if (phone.startsWith('+')) {
    // Extract country code and the rest of the number
    const countryCodeMatch = phone.match(/^\+(\d+)/); // Match "+<digits>"
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : '';
    const restOfNumber = phone.slice(countryCode.length + 1); // Correct slicing

    // Ensure that `restOfNumber` is actually extracted
    console.log('Country Code:', countryCode);
    console.log('Rest of Number:', restOfNumber);

    return `+${countryCode} ${restOfNumber}`.trim();
  }

  return phone; // Return as-is if not in E.164 format
};
