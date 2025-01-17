export const COMPANY_INFO = {
  designacaoSocial: 'Octosólido2, LDA',
  NIF: '513 579 559',
} as const;

export const VAT_RATE = '23%';

export const DATE_FORMAT = "d 'de' MMMM 'de' yyyy";

export const DEFAULT_ORDER_NUMBER = 6111;

export const PAYMENT_TYPES = [
  { value: 'mbway', label: 'MBWay' },
  { value: 'cash', label: 'Numerário' },
  { value: 'card', label: 'Multibanco' },
  { value: 'transfer', label: 'Transferência' },
] as const;
