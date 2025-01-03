'use client';
import { BlobProvider } from '@react-pdf/renderer';
import { OrderDocument } from '@/components/documents/OrderDocument';
import { mockData } from '@/lib/mockData';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { formSchema, FormValues } from '@/lib/schema';
import { useCallback, useEffect, useState } from 'react';
import { DocumentData } from '@/types/document';
import { DEFAULT_ORDER_NUMBER } from '@/lib/constants';
import { formatOrderData, downloadPdf } from '@/lib/form-utils';
import { StoreSelection } from '../../form-sections/StoreSelection';
import CustomerSection from './CustomerSection';
import ProductSection from './ProductSection';
import { OrderMetadata } from './OrderMetadata';

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

                <OrderMetadata
                  form={form}
                  isOpen={isCollapsibleOpen}
                  onOpenChange={setIsCollapsibleOpen}
                />

                <ProductSection form={form} />
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
        </Form>
      )}
    </BlobProvider>
  );
}
