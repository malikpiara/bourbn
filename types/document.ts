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
  email: string;
  phone: string;
  address: Address;
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
  date: string;
  items: OrderItem[];
  vat: string;
  totalAmount: number;
}

// Main interface that combines all the above
export interface DocumentData {
  company: Company;
  customer: Customer;
  order: Order;
}
