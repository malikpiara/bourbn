'use client';
import { BlobProvider } from '@react-pdf/renderer';
import { OrderDocument } from '@/components/documents/OrderDocument';
import { mockData } from '@/lib/mockData';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, ChevronDown } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DynamicTable } from '../../table';
import { formSchema, FormValues } from '@/lib/schema';
import { useCallback, useEffect, useState } from 'react';
import { DocumentData } from '@/types/document';
import { DEFAULT_ORDER_NUMBER } from '@/lib/constants';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatOrderData, downloadPdf } from '@/lib/form-utils';
import { StoreSelection } from '../../form-sections/StoreSelection';
import { CustomerSection } from './CustomerSection';

// autoComplete='new-password' is a hack I put together to disable
// the browser autofill.

export function SalesForm() {
  const [step, setStep] = useState(1); // Maybe it might make more sense to call this 'store' and 'setStore'?
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

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

  const createSubmitHandler = useCallback(
    (url: string | null) => async (values: FormValues) => {
      // If we're already generating, don't allow another submission
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);
      setPdfError(null);

      try {
        // Validate form data using zod
        const result = formSchema.safeParse(values);
        if (!result.success) {
          console.error('Validation Errors:', result.error.errors);
          setPdfError('Por favor, verifique os dados do formulário.');
          return;
        }

        // Transform form data
        const formattedDocumentData = formatOrderData(values);
        setDocumentData(formattedDocumentData);

        // Wait for the PDF URL to be ready
        if (!url) {
          // Instead of throwing an error, we'll wait a bit and check again
          let attempts = 0;
          const maxAttempts = 5;
          const delay = 1000; // 1 second

          while (!url && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            attempts++;
            console.log(`Waiting for PDF URL... Attempt ${attempts}`);
          }

          if (!url) {
            throw new Error(
              'Não foi possível gerar o PDF. Por favor, tente novamente.'
            );
          }
        }

        // Download the PDF
        await downloadPdf(url, formattedDocumentData.order.id);

        // Optional: Show success message
        console.log('PDF generated and downloaded successfully');
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
              <StoreSelection form={form} onStoreSelect={handleStoreSelect} />
            ) : (
              <>
                <h2 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
                  Nova Encomenda
                </h2>
                <Collapsible
                  open={isCollapsibleOpen}
                  onOpenChange={setIsCollapsibleOpen}
                  className='w-full space-y-2 bg-[#F6F3F0] rounded-lg collapsible-transition'
                >
                  <CollapsibleTrigger asChild>
                    <div className='flex w-full items-center justify-between space-x-4 px-8 py-6 cursor-pointer rounded-lg transition-colors bg-[#F6F3F0]'>
                      <div className='flex items-center space-x-2'>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isCollapsibleOpen ? 'rotate-180' : ''
                          }`}
                        />
                        <h4>Rever Detalhes Automatizados</h4>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className='space-y-4 px-8 pb-6 collapsible-content-transition'>
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
                                    format(field.value, 'PPP', { locale: pt })
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                                locale={pt}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <h2 className='scroll-m-20 mb-4 text-2xl font-semibold tracking-tight first:mt-0"'>
                  Lista de Produtos
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

                <CustomerSection form={form} />

                <Button
                  type='submit'
                  disabled={!form.formState.isValid || isGenerating || loading}
                  className='w-full'
                >
                  {isGenerating
                    ? 'A gerar PDF...'
                    : loading
                    ? 'A preparar documento...'
                    : 'Submeter'}
                </Button>

                {(pdfError || blobError) && (
                  <p className='text-sm text-red-700 mt-2'>
                    {pdfError ||
                      'Ocorreu um erro ao gerar o documento. Por favor, tente novamente.'}
                  </p>
                )}
              </>
            )}
          </form>
          <style jsx>{`
            .collapsible-transition {
              transition: height 0.3s ease-in-out;
            }

            .collapsible-content-transition {
              transition: all 0.3s ease-in-out;
              overflow: hidden;
            }

            .collapsible-content-transition[data-state='open'] {
              animation: fadeIn 0.3s ease-out;
            }

            .collapsible-content-transition[data-state='closed'] {
              animation: fadeOut 0.3s ease-out;
            }
          `}</style>
        </Form>
      )}
    </BlobProvider>
  );
}
