'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { OrderDocument } from '@/components/documents/OrderDocument';
import React from 'react';
import { mockData } from '@/lib/mockData';

export const PdfViewer = () => {
  return (
    <PDFViewer width={1100} height={2000}>
      <OrderDocument {...mockData} />
    </PDFViewer>
  );
};
