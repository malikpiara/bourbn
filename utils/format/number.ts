/* 
This function was created because in Portugal, people use commas instead of dots when they are
inserting prices on a form. 
*/

export const ptFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Function to parse Portuguese formatted numbers back to JavaScript numbers
export const parsePtNumber = (value: string): number => {
  // Remove all characters except digits, comma, and period
  const cleanValue = value.replace(/[^\d,.-]/g, '');

  // Convert comma to period for JavaScript number parsing
  const standardizedValue = cleanValue.replace(',', '.');

  // Parse the value to a float
  return parseFloat(standardizedValue);
};
