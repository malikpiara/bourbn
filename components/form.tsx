'use client';
import { BlobProvider } from '@react-pdf/renderer';
import { OrderDocument } from '@/components/documents/OrderDocument';
import { mockData } from '@/lib/mockData';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { DynamicTable } from './table';
import { formSchema, FormValues } from '@/lib/schema';
import { useCallback, useEffect, useState } from 'react';
import { DocumentData } from '@/types/document';
import {
  COMPANY_INFO,
  VAT_RATE,
  DEFAULT_ORDER_NUMBER,
  DATE_FORMAT,
} from '@/lib/constants';

// autoComplete='new-password' is a hack I put together to disable
// the browser autofill.

export function SalesForm() {
  const [step, setStep] = useState(1); // Maybe it might make more sense to call this 'store' and 'setStore'?
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      orderNumber: DEFAULT_ORDER_NUMBER,
      date: new Date(),
      email: '',
      phoneNumber: '',
      nif: '',
      address1: '',
      address2: '',
      postalCode: '',
      city: '',
      tableEntries: [],
      storeId: '',
      elevator: false,
      notes: '',
    },
  });

  const handleStoreSelect = (value: string) => {
    form.setValue('storeId', value);
    setStep(2);
  };

  const StoreSelection = () => (
    <div className='space-y-8'>
      <h2 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
        Selecione a Loja
      </h2>
      <FormField
        control={form.control}
        name='storeId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loja</FormLabel>
            <Select
              onValueChange={(value) => handleStoreSelect(value)}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a loja onde a venda está a ser executada' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='1'>1 - Clássica</SelectItem>
                <SelectItem value='3'>3 - Moderna</SelectItem>
                <SelectItem value='6'>6 - Iluminação</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const createSubmitHandler = useCallback(
    (url: string | null) => async (values: FormValues) => {
      // If we're already generating, don't allow another submission
      if (isGenerating) {
        return;
      }
      setIsGenerating(true);
      setPdfError(null);

      try {
        // Log the form values to help us debug
        console.log('Form Values:', values);
        console.log('Table Entries:', values.tableEntries);

        // Validate form data using zod
        const result = formSchema.safeParse(values);
        if (!result.success) {
          console.error('Validation Errors:', result.error.errors);
          setPdfError('Por favor, verifique os dados do formulário.');
          return;
        }

        // Transform form data and store it
        const formattedDocumentData = formatOrderData(values);
        console.log('Formatted Data:', formattedDocumentData);

        setDocumentData(formattedDocumentData);

        // Wait a moment for state to update
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Wait for the PDF to be generated
        if (!url) {
          throw new Error('Aguardando geração do PDF...');
        } // Now we know we have a URL, we can download
        downloadPdf(url, formattedDocumentData.order.id);
      } catch (error) {
        console.error('Error details:', error);
        setPdfError(
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao processar o formulário.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating]
  );

  useEffect(() => {
    // Clean up function that runs when component unmounts
    return () => {
      if (documentData) {
        // Clean up any blob URLs
        URL.revokeObjectURL(documentData.toString());
      }
    };
  }, [documentData]);

  return (
    <BlobProvider
      document={<OrderDocument {...(documentData || mockData)} />}
      key={documentData ? 'doc' : 'mock'}
    >
      {({ url, loading, error: blobError }) => (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createSubmitHandler(url))}
            autoComplete='off'
            className='space-y-8'
          >
            {step === 1 ? (
              <StoreSelection />
            ) : (
              <>
                <h2 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
                  Nova Encomenda
                </h2>
                <FormField
                  control={form.control}
                  name='orderNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Encomenda</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='6111'
                          autoComplete='false'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        O número da encomenda é gerado automaticamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Data da encomenda</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[340px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: pt }) // Remember to change this once you scale.
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                            locale={pt} // Change this when you get customers outside Portugal.
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"'>
                  Produtos
                </h2>
                <FormField
                  control={form.control}
                  name='tableEntries'
                  render={({ fieldState: { error } }) => (
                    <FormItem>
                      <FormControl>
                        <DynamicTable form={form} />
                      </FormControl>
                      <div className='space-y-2'>
                        {error?.type === 'too_small' && (
                          <p className='text-sm font-medium text-destructive'>
                            Por favor, adicione pelo menos um produto à
                            encomenda.
                          </p>
                        )}
                        {error && error.type !== 'too_small' && (
                          <p className='text-sm font-medium text-destructive'>
                            Verifique se todos os campos dos produtos estão
                            preenchidos corretamente.
                          </p>
                        )}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea className='resize-none' {...field} />
                      </FormControl>
                      <FormDescription>
                        Notas importantes que vão ser lidas pela equipa mas que
                        não vão para o cliente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Input autoComplete='false' {...field} />
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
                        <Input autoComplete='new-password' {...field} />
                      </FormControl>
                      <FormDescription>
                        O cliente vai receber notificações através deste
                        endereço.
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
                        <Input autoComplete='new-password' {...field} />
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
                        <InputOTP
                          maxLength={9}
                          {...field}
                          onKeyDown={(event) => {
                            // Allow only numeric keys, Backspace, Delete, Arrow keys, etc.
                            if (
                              !/^[0-9]$/.test(event.key) && // Numeric keys
                              event.key !== 'Backspace' &&
                              event.key !== 'Delete' &&
                              event.key !== 'ArrowLeft' &&
                              event.key !== 'ArrowRight' &&
                              event.key !== 'Tab'
                            ) {
                              event.preventDefault(); // Block other keys
                            }
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                            <InputOTPSlot index={8} />
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
                        <InputOTP
                          maxLength={7}
                          {...field}
                          onKeyDown={(event) => {
                            // Allow only numeric keys, Backspace, Delete, Arrow keys, etc.
                            if (
                              !/^[0-9]$/.test(event.key) && // Numeric keys
                              event.key !== 'Backspace' &&
                              event.key !== 'Delete' &&
                              event.key !== 'ArrowLeft' &&
                              event.key !== 'ArrowRight' &&
                              event.key !== 'Tab'
                            ) {
                              event.preventDefault(); // Block other keys
                            }
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
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
                        <Input autoComplete='new-password' {...field} />
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
                          Se o elevador não estiver operacional, por favor deixe
                          a caixa vazia.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  disabled={!form.formState.isValid || isGenerating || loading}
                  className='w-full'
                >
                  {isGenerating || loading ? 'A gerar PDF...' : 'Submeter'}
                </Button>

                {(pdfError || blobError) && (
                  <p className='text-sm text-red-700 mt-2'>
                    {pdfError || 'Ocorreu um erro ao gerar o documento.'}
                  </p>
                )}
              </>
            )}
          </form>
        </Form>
      )}
    </BlobProvider>
  );
}

const formatNIF = (nif: string): string => {
  // Format NIF with spaces: 123 456 789
  return nif.replace(/(\d{3})(?=\d)/g, '$1 ');
};

const formatPostalCode = (postalCode: string): string => {
  if (!postalCode) return postalCode;
  // Format postal code: 1234-567
  return postalCode.replace(/(\d{4})(\d{3})/, '$1-$2');
};

// Helper function to trigger the PDF download
const downloadPdf = (url: string, documentId: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = `encomenda-${documentId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const formatOrderData = (values: FormValues): DocumentData => {
  try {
    // Validate that we have at least one table entry
    if (!values.tableEntries.length) {
      throw new Error('A encomenda deve ter pelo menos um produto.');
    }

    const orderItems = values.tableEntries.map((entry) => {
      const total = entry.quantity * entry.price;
      if (isNaN(total)) {
        throw new Error('Erro ao calcular o total do produto.');
      }

      return {
        ref: entry.ref,
        description: entry.designation,
        quantity: entry.quantity,
        unitPrice: entry.price,
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
      },
    };
  } catch (error) {
    console.error('Error formatting order data:', error);
    throw error;
  }
};
