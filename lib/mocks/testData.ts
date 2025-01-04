import { FormValues } from '../schema';
import { mockData } from './mockData';
import { UseFormReturn } from 'react-hook-form';

// Create test form values that match the form schema
export const testFormValues: FormValues = {
  name: mockData.customer.name,
  storeId: mockData.order.storeId.replace('OCT ', ''),
  notes: '',
  orderNumber: parseInt(mockData.order.id),
  date: new Date(),
  email: mockData.customer.email,
  phoneNumber: mockData.customer.phone
    .replace(/\D/g, '')
    .slice(0, 9)
    .padStart(9, '0'),
  nif: (mockData.customer.nif || '000000000')
    .replace(/\D/g, '')
    .slice(0, 9)
    .padStart(9, '0'),
  address1: mockData.customer.address.address1,
  address2: mockData.customer.address.address2 || '',
  postalCode: mockData.customer.address.postalCode
    .replace(/\D/g, '')
    .slice(0, 7)
    .padStart(7, '0'),
  city: mockData.customer.address.city,
  elevator: mockData.customer.address.hasElevator,
  tableEntries: mockData.order.items.map((item, index) => ({
    id: index + 1,
    ref: item.ref,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  })),
};

// Helper function to fill form with test data
export const fillFormWithTestData = (form: UseFormReturn<FormValues>) => {
  form.reset();

  Object.entries(testFormValues).forEach(([key, value]) => {
    form.setValue(key as keyof FormValues, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  });
};
