import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';
import { FormValues } from '@/lib/schema';
import { useEnterKeyBlur } from '@/hooks/useEnterKeyBlur';
import { capitalizeWithPreserve, cleanSpaces } from '@/utils/format';
import { PhoneInput } from '@/components/ui/phone-input';

interface CustomerSectionProps {
  form: UseFormReturn<FormValues>;
  className?: string; // Optional className for flexibility
}

// Reusable OTP input handler to reduce code duplication
const handleOTPKeyDown = (event: React.KeyboardEvent) => {
  if (
    !/^[0-9]$/.test(event.key) &&
    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
      event.key
    )
  ) {
    event.preventDefault();
  }
};

function CustomerSection({ form, className }: CustomerSectionProps) {
  // Create a single instance of the handler for all inputs
  const handleEnterKey = useEnterKeyBlur();
  return (
    <div className={`space-y-8 ${className || ''}`}>
      <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"'>
        Dados do Cliente
      </h2>

      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input
                autoComplete='false'
                {...field}
                onKeyDown={handleEnterKey}
                onBlur={(e) => {
                  const cleanValue = cleanSpaces(e.target.value);
                  const formattedValue = capitalizeWithPreserve(cleanValue);
                  field.onChange(formattedValue);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormDescription>
              Escreve o primeiro e último nome, ou o nome da empresa.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email do cliente</FormLabel>
            <FormControl>
              <Input
                type='email'
                autoComplete='new-password'
                {...field}
                onKeyDown={handleEnterKey}
                value={field.value || ''} // Handle undefined/null values
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value || undefined); // Set to undefined if empty
                }}
              />
            </FormControl>
            <FormDescription>
              O cliente vai receber notificações através deste endereço se
              fornecido.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone do cliente</FormLabel>
            <FormControl>
              <PhoneInput
                type='tel'
                autoComplete='new-password'
                defaultCountry='PT'
                countries={[
                  'PT', // Portugal
                  'ES', // Spain
                  'FR', // France
                  'DE', // Germany
                  'IT', // Italy
                  'MZ', // Mozambique
                  'AO', // Angola
                  'BR', // Brazil
                  'CV', // Cape Verde
                  'GB', // United Kingdom
                  'NL', // Netherlands
                  'BE', // Belgium
                  'GW', // Guinea-Bissau
                  'ST', // São Tomé and Príncipe
                  'US', // United States
                  'CH', // Switzerland
                  'SE', // Sweden
                  'DK', // Denmark
                  'NO', // Norway
                ]}
                {...field}
                onKeyDown={handleEnterKey}
              />
            </FormControl>
            <FormDescription>
              Pode ser usado para auxiliar a entrega.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='nif'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de contribuinte</FormLabel>
            <FormControl>
              <InputOTP maxLength={9} {...field} onKeyDown={handleOTPKeyDown}>
                <InputOTPGroup>
                  {[...Array(9)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='address1'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Linha de morada 1</FormLabel>
            <FormControl>
              <Input
                placeholder='Rua do Carmo 12'
                autoComplete='new-password'
                {...field}
                onKeyDown={handleEnterKey}
                onBlur={(e) => {
                  const cleanValue = cleanSpaces(e.target.value);
                  const formattedValue = capitalizeWithPreserve(cleanValue);
                  field.onChange(formattedValue);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormDescription>Nome e número da rua</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='address2'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Linha de morada 2</FormLabel>
            <FormControl>
              <Input
                placeholder='Lote B, 3dto'
                autoComplete='new-password'
                {...field}
                onKeyDown={handleEnterKey}
                onBlur={(e) => {
                  const cleanValue = cleanSpaces(e.target.value);
                  field.onChange(cleanValue);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormDescription>
              Apartamento, bloco, edificio, andar, etç.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='postalCode'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código Postal</FormLabel>
            <FormControl>
              <InputOTP maxLength={7} {...field} onKeyDown={handleOTPKeyDown}>
                <InputOTPGroup>
                  {[...Array(4)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  {[...Array(3)].map((_, index) => (
                    <InputOTPSlot key={index + 4} index={index + 4} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='city'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input
                autoComplete='new-password'
                {...field}
                onKeyDown={handleEnterKey}
                onBlur={(e) => {
                  const formattedValue = capitalizeWithPreserve(e.target.value);
                  field.onChange(formattedValue);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='elevator'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel>Há elevador</FormLabel>
              <FormDescription>
                Se o elevador não estiver operacional, por favor deixe a caixa
                vazia.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

export default CustomerSection;
