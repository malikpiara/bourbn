import { DocumentData } from '@/types/document';

// Mock data that will be replaced with data from form later

export const mockData: DocumentData = {
  company: {
    designacaoSocial: 'Octosólido2, LDA',
    NIF: '513 579 559',
  },
  customer: {
    name: 'Malik Piara',
    email: 'malik@hey.com',
    phone: '+351962119084',
    nif: '000 000 000',
    address: {
      address1: 'Largo Monsenhor Dalgado 12',
      address2: '3dto',
      postalCode: '1500-463',
      city: 'Lisboa, Portugal',
      hasElevator: true,
    },
  },
  order: {
    storeId: 'OCT 1',
    date: '17 de Dezembro de 2024',
    salesType: 'delivery',
    id: '17308',
    items: [
      {
        ref: 'KN-001',
        description: 'Mesa redonda Keanu',
        quantity: 1,
        unitPrice: 123.0,
        total: 123.0,
      },
      {
        ref: 'K-009',
        description: 'Mesa triangular Kare',
        quantity: 3,
        unitPrice: 93,
        total: 123.0,
      },
      {
        ref: 'K-006',
        description: 'Mesa quadrada Kare',
        quantity: 3,
        unitPrice: 93,
        total: 123.0,
      },
      {
        ref: 'K-006',
        description: 'Mesa quadrada Kare',
        quantity: 3,
        unitPrice: 93,
        total: 123.0,
      },
      {
        ref: 'K-006',
        description: 'Mesa quadrada Kare',
        quantity: 3,
        unitPrice: 93,
        total: 123.0,
      },
      {
        ref: 'K-006',
        description: 'Mesa quadrada Kare',
        quantity: 3,
        unitPrice: 93,
        total: 123.0,
      },
    ],
    vat: '23%',
    totalAmount: 123.0,
  },
};
