import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';

// Use string path instead of direct import
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

  useEffect(() => {
    setIsClient(true);
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

  // Don't render anything on the server
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
    <div className={`flex flex-col items-center ${className || ''}`}>
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
        <Page
          pageNumber={pageNumber}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className='shadow-lg rounded-lg'
          width={800}
        />
      </Document>

      {!loading && !error && numPages > 1 && (
        <div className='flex items-center gap-4 mt-4'>
          <Button
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
            disabled={pageNumber <= 1}
            variant='outline'
            size='sm'
          >
            Anterior
          </Button>

          <p className='text-sm text-gray-700'>
            Página {pageNumber} de {numPages}
          </p>

          <Button
            onClick={() =>
              setPageNumber((page) => Math.min(numPages, page + 1))
            }
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
