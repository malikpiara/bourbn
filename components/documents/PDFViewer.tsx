import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';

// Custom styles for text selection
const textLayerStyles = `
  .react-pdf__Page__textContent {
    opacity: 0.5;
  }

  .react-pdf__Page__textContent ::selection {
    background: rgba(250, 233, 157, 1);  /* Light yellow */
    color: inherit;
  }

  .textLayer {
    opacity: 0.5;
    mix-blend-mode: multiply;
  }

  .textLayer ::selection {
    background: rgba(250, 233, 157, 1);
    color: inherit;
  }

  /* For Firefox */
  .textLayer ::-moz-selection {
    background: rgba(250, 233, 157, 1);
    color: inherit;
  }
`;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string | null;
  className?: string;
}

const PDFViewer = ({ url, className }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsClient(true);

    // Add custom styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = textLayerStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error): void => {
    console.error('Error loading PDF:', error);
    setError(error);
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    setKey((prev) => prev + 1);
  };

  if (!isClient) {
    return null;
  }

  if (!url) {
    return (
      <div className='flex justify-center items-center h-64 bg-gray-50 rounded-lg'>
        <p className='text-gray-500'>Nenhum PDF para visualizar</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className || ''}`}>
      {/* PDF Document */}
      <div className='flex-grow mb-16'>
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className='flex justify-center items-center h-64'>
              <p className='text-gray-500'>A carregar PDF...</p>
            </div>
          }
          error={
            <div className='flex justify-center items-center h-64 bg-red-50 rounded-lg'>
              <p className='text-red-500'>
                {error ? `Erro: ${error.message}` : 'Erro ao carregar o PDF!'}
              </p>
            </div>
          }
        >
          <div
            key={key}
            className='animate-slide-fade rounded-lg overflow-hidden'
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className='rounded-3xl'
              width={700}
            />
          </div>
        </Document>
      </div>

      {/* Fixed controls at bottom */}
      {!loading && !error && numPages > 1 && (
        <div className='fixed bottom-8 right-5 flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg z-10'>
          <Button
            onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            variant='outline'
            size='sm'
          >
            Anterior
          </Button>

          <p className='text-sm font-medium px-2'>
            Página {pageNumber} de {numPages}
          </p>

          <Button
            onClick={() => handlePageChange(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            variant='outline'
            size='sm'
          >
            Seguinte
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
