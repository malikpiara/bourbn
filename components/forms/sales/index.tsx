import { BlobProvider } from '@react-pdf/renderer';
import { OrderDocument } from '@/components/documents/OrderDocument';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { formSchema, FormValues } from '@/lib/schema';
import { useCallback, useState } from 'react';
import { DocumentData } from '@/types/document';
import { DEFAULT_ORDER_NUMBER } from '@/lib/constants';
import { downloadPdf } from '@/utils/form';
import { formatOrderData } from '@/utils/format';
import { StoreSelection } from './StoreSelection';
import CustomerSection from './CustomerSection';
import ProductSection from './ProductSection';
import { OrderMetadata } from './OrderMetadata';
import { fillFormWithTestData } from '@/lib/mocks/testData';

// Define our form steps
type FormStep = 'store' | 'details' | 'preview';

export function SalesForm() {
  // Replace the numeric step with our new step type
  const [currentStep, setCurrentStep] = useState<FormStep>('store');
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
    setCurrentStep('details');
  };

  // New function to handle preview generation
  const handlePreviewGeneration = useCallback(async (values: FormValues) => {
    try {
      // Validate form data
      const result = formSchema.safeParse(values);
      if (!result.success) {
        console.error('Validation Errors:', result.error.errors);
        setPdfError('Por favor, verifique os dados do formulário.');
        return;
      }

      // Transform form data
      const formattedData = formatOrderData(values);
      setDocumentData(formattedData);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating preview:', error);
      setPdfError(
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao gerar a pré-visualização.'
      );
    }
  }, []);

  // Modified submit handler for the final download
  const handleDownload = useCallback(
    async (url: string | null) => {
      if (!url || !documentData) return;

      setIsGenerating(true);
      setPdfError(null);

      try {
        await downloadPdf(url, documentData.order.id);
        console.log('PDF downloaded successfully');
      } catch (error) {
        console.error('Error downloading PDF:', error);
        setPdfError(
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao transferir o PDF.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [documentData]
  );

  // Function to go back to form editing
  const handleBackToForm = useCallback(() => {
    setCurrentStep('details');
    setDocumentData(null);
    setPdfError(null);
  }, []);

  // Test data handler
  const handleFillTestData = useCallback(() => {
    fillFormWithTestData(form);
    setCurrentStep('details');
  }, [form]);

  return (
    <div className='space-y-8'>
      {/* Development-only test data button */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          type='button'
          onClick={handleFillTestData}
          variant='outline'
          className='mb-4'
        >
          Fill Test Data
        </Button>
      )}

      {currentStep === 'preview' ? (
        <BlobProvider document={<OrderDocument {...documentData!} />}>
          {({ url, loading, error: blobError }) => (
            <div className='space-y-6'>
              <h2 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
                Pré-visualização do Documento
              </h2>

              {/* Preview content would go here - you'll need to create this component */}
              <div className='border rounded-lg p-4 bg-gray-50'>
                <h3 className='text-lg font-medium mb-2'>
                  Detalhes da Encomenda
                </h3>
                {/* Display order summary */}
                {documentData && (
                  <div className='space-y-2'>
                    <p>Cliente: {documentData.customer.name}</p>
                    <p>Número da Encomenda: {documentData.order.id}</p>
                    <p>Total de Items: {documentData.order.items.length}</p>
                    <p>
                      Valor Total: €{documentData.order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className='flex gap-4'>
                <Button
                  type='button'
                  onClick={() => handleDownload(url)}
                  disabled={loading || isGenerating}
                  className='flex-1'
                >
                  {isGenerating ? 'A gerar PDF...' : 'Transferir PDF'}
                </Button>
                <Button
                  type='button'
                  onClick={handleBackToForm}
                  variant='outline'
                  className='flex-1'
                >
                  Voltar ao Formulário
                </Button>
              </div>

              {(pdfError || blobError) && (
                <p className='text-sm text-red-700 mt-2'>
                  {pdfError ||
                    'Ocorreu um erro ao gerar o documento. Por favor, tente novamente.'}
                </p>
              )}
            </div>
          )}
        </BlobProvider>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePreviewGeneration)}
            autoComplete='off'
            className='space-y-8'
          >
            {currentStep === 'store' ? (
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
                  disabled={!form.formState.isValid}
                  className='w-full'
                >
                  Pré-visualizar Documento
                </Button>
              </>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}
