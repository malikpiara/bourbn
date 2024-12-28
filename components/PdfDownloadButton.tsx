'use client';

import { BlobProvider } from '@react-pdf/renderer';
import { MyDocument } from '@/components/document';
import React from 'react';
import { mockData } from '@/lib/mockData';

export const PdfDownloadButton = () => {
  return (
    <BlobProvider document={<MyDocument {...mockData} />}>
      {({ loading, url }) => {
        if (loading) {
          return <button>Loading...</button>;
        }

        return (
          <a
            href={url || ''}
            download='encomenda.pdf'
            className='download-button'
          >
            <button>Download PDF</button>
          </a>
        );
      }}
    </BlobProvider>
  );
};
