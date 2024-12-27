'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { MyDocument } from '@/components/document';
import React from 'react';

export const PdfViewer = () => {
  return (
    <PDFViewer width={1100} height={2000}>
      <MyDocument />
    </PDFViewer>
  );
};