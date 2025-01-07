// Interfaces

export interface Address {
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  hasElevator: boolean;
}

export interface Company {
  designacaoSocial: string;
  NIF: string;
}

export interface Customer {
  name: string;
  nif?: string;
  email?: string;
  phone: string | null; // Using string | null since react-phone-number-input uses this type (E.164)
  address: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  ref: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  storeId: string;
  salesType: 'direct' | 'delivery';
  date: string;
  items: OrderItem[];
  vat: string;
  totalAmount: number;
  notes?: string;
}

// Main interface that combines all the above
export interface DocumentData {
  company: Company;
  customer: Customer;
  order: Order;
}
