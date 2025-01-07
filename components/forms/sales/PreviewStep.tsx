import { BlobProvider } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { DocumentData } from '@/types/document';
import { OrderDocument } from '@/components/documents/OrderDocument';
import { DirectSalesDocument } from '@/components/documents/DirectSales';

interface PreviewStepProps {
  documentData: DocumentData;
  handleDownload: (url: string) => void;
  handleBackToForm: () => void;
  pdfError: string | null;
  isGenerating: boolean;
}

export const PreviewStep = ({
  documentData,
  handleDownload,
  handleBackToForm,
  pdfError,
  isGenerating,
}: PreviewStepProps) => {
  if (!documentData) {
    return <p>Erro: Os dados do documento estão indisponíveis.</p>;
  }

  const isDelivery = documentData.order.salesType === 'delivery';
  const DocumentComponent = isDelivery ? OrderDocument : DirectSalesDocument;
  const documentType = isDelivery ? 'Encomenda' : 'Venda Direta';

  return (
    <div className='space-y-6 animate-slide-fade'>
      <h2 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
        Pré-visualização do Documento
      </h2>

      <BlobProvider document={<DocumentComponent {...documentData} />}>
        {({ url, loading }) => (
          <>
            <div className='border rounded-lg p-4 bg-gray-50'>
              <h3 className='text-lg font-medium mb-2'>
                Detalhes da {documentType}
              </h3>
              <div className='space-y-2'>
                <p>Cliente: {documentData.customer.name}</p>
                <p>Número: {documentData.order.id}</p>
                <p>Total de Itens: {documentData.order.items.length}</p>
                <p>Valor Total: €{documentData.order.totalAmount.toFixed(2)}</p>
                {isDelivery && documentData.customer.address && (
                  <p>
                    Morada de Entrega: {documentData.customer.address.address1}
                    {documentData.customer.address.address2 &&
                      `, ${documentData.customer.address.address2}`}
                  </p>
                )}
              </div>
            </div>

            <div className='flex gap-4'>
              <Button
                type='button'
                onClick={() => {
                  if (url) handleDownload(url);
                }}
                disabled={loading || isGenerating}
                className='flex-1'
              >
                {loading || isGenerating ? 'A gerar PDF...' : 'Transferir PDF'}
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
          </>
        )}
      </BlobProvider>

      {pdfError && <p className='text-sm text-red-700 mt-2'>{pdfError}</p>}
    </div>
  );
};
