import { FormValues } from './schema';
import { mockData } from './mockData';

export const testFormValues: FormValues = {
  // Basic information
  name: mockData.customer.name,
  storeId: mockData.order.storeId.replace('OCT ', ''), // Remove 'OCT ' prefix since it's added in formatting
  notes: '', // Optional field initialized as empty string

  // Order metadata
  orderNumber: parseInt(mockData.order.id),
  date: new Date(), // Current date for testing

  // Contact information
  email: mockData.customer.email,
  // Ensure phone number is exactly 9 digits
  phoneNumber: mockData.customer.phone
    .replace(/\D/g, '')
    .slice(0, 9)
    .padStart(9, '0'),
  // Ensure NIF is exactly 9 digits
  nif: (mockData.customer.nif || '000000000')
    .replace(/\D/g, '')
    .slice(0, 9)
    .padStart(9, '0'),

  // Address information
  address1: mockData.customer.address.address1,
  address2: mockData.customer.address.address2 || '', // Optional field
  // Ensure postal code is exactly 7 characters (4 digits + hyphen + 3 digits)
  postalCode: mockData.customer.address.postalCode
    .replace(/\D/g, '')
    .slice(0, 7)
    .padStart(7, '0'),
  city: mockData.customer.address.city,
  elevator: mockData.customer.address.hasElevator,

  // Order items
  tableEntries: mockData.order.items.map((item, index) => ({
    id: index + 1,
    ref: item.ref,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  })),
};

// Helper function to fill form with test data
export const fillFormWithTestData = (form: any) => {
  // First, reset the form to clear any existing values
  form.reset();

  // Then set each field individually to ensure proper validation
  Object.entries(testFormValues).forEach(([key, value]) => {
    form.setValue(key, value, {
      shouldValidate: true, // Trigger validation
      shouldDirty: true, // Mark field as changed
      shouldTouch: true, // Mark field as touched
    });
  });
};

// Function to generate alternative test datasets
export const generateAlternativeTestData = (
  variant: 'minimal' | 'full' | 'invalid' = 'full'
): FormValues => {
  switch (variant) {
    case 'minimal':
      // Minimal valid data set
      return {
        ...testFormValues,
        address2: '',
        notes: '',
        tableEntries: [testFormValues.tableEntries[0]],
      };

    case 'invalid':
      // Data set with validation errors for testing
      return {
        ...testFormValues,
        email: 'invalid-email',
        phoneNumber: '12345', // Too short
        nif: '12345', // Too short
        postalCode: '1234', // Too short
        tableEntries: [], // Empty array
      };

    case 'full':
    default:
      return testFormValues;
  }
};
