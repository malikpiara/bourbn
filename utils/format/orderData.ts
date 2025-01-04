import { FormValues } from '@/lib/schema';
import { DocumentData } from '@/types/document';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { COMPANY_INFO, VAT_RATE, DATE_FORMAT } from '@/lib/constants';
import { formatNIF, formatPostalCode } from './form';

export const formatOrderData = (values: FormValues): DocumentData => {
  try {
    // Validate that we have at least one table entry
    if (!values.tableEntries.length) {
      throw new Error('A encomenda deve ter pelo menos um produto.');
    }

    const orderItems = values.tableEntries.map((entry) => {
      const total = entry.quantity * entry.unitPrice;
      if (isNaN(total)) {
        throw new Error('Erro ao calcular o total do produto.');
      }

      return {
        ref: entry.ref,
        description: entry.description,
        quantity: entry.quantity,
        unitPrice: entry.unitPrice,
        total,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
    if (isNaN(totalAmount)) {
      throw new Error('Erro ao calcular o total da encomenda.');
    }

    return {
      company: COMPANY_INFO, // From constants
      customer: {
        name: values.name,
        email: values.email,
        phone: values.phoneNumber,
        nif: formatNIF(values.nif),
        address: {
          address1: values.address1,
          address2: values.address2 || '',
          postalCode: formatPostalCode(values.postalCode),
          city: values.city,
          hasElevator: values.elevator || false,
        },
      },
      order: {
        id: values.orderNumber.toString(),
        storeId: `OCT ${values.storeId}`,
        date: format(values.date, DATE_FORMAT, { locale: pt }),
        items: orderItems,
        vat: VAT_RATE,
        totalAmount,
        notes: values.notes!,
      },
    };
  } catch (error) {
    console.error('Error formatting order data:', error);
    throw error;
  }
};
