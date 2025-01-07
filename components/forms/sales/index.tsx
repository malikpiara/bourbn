import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
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
import { SalesTypeSelection } from './SalesTypeSelection';
import { stores } from './StoreSelection';
import { PreviewStep } from './PreviewStep';

// Define our form steps
type FormStep = 'store' | 'salesType' | 'details' | 'preview';

export function SalesForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('store');
  const [selectedSalesType, setSelectedSalesType] = useState<
    'direct' | 'delivery' | null
  >(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      storeId: '',
      salesType: null,
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
      elevator: false,
      notes: '',
      sameAddress: true,
      billingAddress1: '',
      billingAddress2: '',
      billingPostalCode: '',
      billingCity: '',
    },
  });

  // Handle store selection logic
  const handleStoreSelect = (storeId: string) => {
    const selectedStore = stores.find((store) => store.id === storeId);
    form.setValue('storeId', storeId);

    if (selectedStore?.salesTypes.length === 1) {
      // Automatically select the only available sales type
      const singleSalesType = selectedStore.salesTypes[0] as
        | 'direct'
        | 'delivery';
      setSelectedSalesType(singleSalesType);
      form.setValue('salesType', singleSalesType);
      setCurrentStep('details');
    } else {
      setCurrentStep('salesType'); // Proceed to sales type selection step
    }
  };

  // Handle sales type selection logic
  const handleSalesTypeSelect = (type: 'direct' | 'delivery') => {
    setSelectedSalesType(type);
    form.setValue('salesType', type);
    setCurrentStep('details'); // Proceed to details step
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
    <FormProvider {...form}>
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

        {/* Render the appropriate step */}
        {currentStep === 'store' && (
          <StoreSelection form={form} onStoreSelect={handleStoreSelect} />
        )}

        {currentStep === 'salesType' && (
          <SalesTypeSelection
            form={form} // Pass the form object from useForm
            onSalesTypeSelect={handleSalesTypeSelect}
            salesTypes={['direct', 'delivery']}
          />
        )}

        {currentStep === 'details' && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePreviewGeneration)}
              className='space-y-8'
            >
              <OrderMetadata
                form={form}
                isOpen={isCollapsibleOpen}
                onOpenChange={setIsCollapsibleOpen}
              />

              {selectedSalesType === 'delivery' && (
                <>
                  <ProductSection form={form} />
                  <CustomerSection form={form} />
                </>
              )}

              {selectedSalesType === 'direct' && <div>{/* TODO */}</div>}

              <Button
                type='submit'
                disabled={!form.formState.isValid}
                className='w-full'
              >
                Pré-visualizar Documento
              </Button>
            </form>
          </Form>
        )}

        {currentStep === 'preview' && documentData && (
          <PreviewStep
            documentData={documentData}
            handleDownload={handleDownload}
            handleBackToForm={handleBackToForm}
            pdfError={pdfError}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </FormProvider>
  );
}
