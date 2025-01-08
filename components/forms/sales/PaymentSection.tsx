import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/lib/schema';
import { formatCurrency } from '@/utils/format/currency';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PaymentSectionProps {
  form: UseFormReturn<FormValues>;
}

const PAYMENT_TYPES = [
  { value: 'mbway', label: 'MBWay' },
  { value: 'cash', label: 'Numerário' },
  { value: 'card', label: 'Multibanco' },
  { value: 'transfer', label: 'Transferência' },
] as const;

export function PaymentSection({ form }: PaymentSectionProps) {
  const fields = form.watch('tableEntries');
  const orderDate = form.watch('date');

  // Calculate total
  const total = fields.reduce((sum, field) => {
    const quantity = field.quantity || 0;
    const rawUnitPrice = field.unitPrice || '0';
    const unitPrice = parseFloat(rawUnitPrice.toString().replace(',', '.'));
    const price = isNaN(unitPrice) ? 0 : unitPrice;
    return sum + quantity * price;
  }, 0);

  // State for slider and payments
  const [sliderValue, setSliderValue] = useState(50);
  const [firstPayment, setFirstPayment] = useState('0');
  const [secondPayment, setSecondPayment] = useState('0');
  const [paymentType, setPaymentType] = useState<string>('');

  useEffect(() => {
    const halfTotal = (total / 2).toFixed(2).replace('.', ',');
    setFirstPayment(halfTotal);
    setSecondPayment(halfTotal);
  }, [total]);

  const firstPaymentValue = parseFloat(firstPayment.replace(',', '.')) || 0;
  const secondPaymentValue = parseFloat(secondPayment.replace(',', '.')) || 0;
  const paymentsMatchTotal =
    Math.abs(firstPaymentValue + secondPaymentValue - total) < 0.01;

  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    setSliderValue(percentage);
    const firstAmount = (total * (percentage / 100))
      .toFixed(2)
      .replace('.', ',');
    const secondAmount = (total * ((100 - percentage) / 100))
      .toFixed(2)
      .replace('.', ',');
    setFirstPayment(firstAmount);
    setSecondPayment(secondAmount);
  };

  const handleFirstPaymentChange = (value: string) => {
    setFirstPayment(value);
    const firstValue = parseFloat(value.replace(',', '.')) || 0;
    const remainingValue = total - firstValue;
    setSecondPayment(remainingValue.toFixed(2).replace('.', ','));
    setSliderValue((firstValue / total) * 100);
  };

  const handleSecondPaymentChange = (value: string) => {
    setSecondPayment(value);
    const secondValue = parseFloat(value.replace(',', '.')) || 0;
    const remainingValue = total - secondValue;
    setFirstPayment(remainingValue.toFixed(2).replace('.', ','));
    setSliderValue(((total - secondValue) / total) * 100);
  };

  return (
    <Card className='w-full animate-slide-fade'>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {/* Total Amount Display */}
          <div className='flex justify-between items-center bg-muted p-4 rounded-lg'>
            <span className='font-semibold'>Valor Total:</span>
            <span className='font-semibold text-lg'>
              {formatCurrency(total)}
            </span>
          </div>

          {/* Payment Split Slider */}
          <div className='space-y-3'>
            <Label className='text-sm text-muted-foreground'>
              Distribuição dos Pagamentos
            </Label>
            <div className='pt-4'>
              <Slider
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className='mb-6 cursor-pointer hover:cursor-grab active:cursor-grabbing'
              />
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>{sliderValue}%</span>
                <span>{100 - sliderValue}%</span>
              </div>
            </div>
          </div>

          {/* Payment Sections */}
          <div className='space-y-8'>
            {/* First Payment */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <h3 className='text-base font-semibold mb-1'>
                    Pagamento no acto de venda
                  </h3>
                  <div className='text-sm text-muted-foreground'>
                    {format(orderDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}
                  </div>
                </div>
                <Input
                  type='text'
                  className='w-32 text-right'
                  placeholder='0,00'
                  value={firstPayment}
                  onChange={(e) => handleFirstPaymentChange(e.target.value)}
                />
              </div>

              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecione o Método de Pagamento' />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Second Payment */}
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h3 className='text-base font-semibold mb-1'>
                  Pagamento no acto de entrega
                </h3>
              </div>
              <Input
                type='text'
                className='w-32 text-right'
                placeholder='0,00'
                value={secondPayment}
                onChange={(e) => handleSecondPaymentChange(e.target.value)}
              />
            </div>
          </div>

          {/* Warning if payments don't match total */}
          {!paymentsMatchTotal && (
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                A soma dos pagamentos (
                {formatCurrency(firstPaymentValue + secondPaymentValue)}) não
                coincide com o valor total ({formatCurrency(total)})
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
