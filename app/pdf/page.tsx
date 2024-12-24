'use client';
import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { MyDocument } from '@/components/document';

export default function PDF() {
  return (
    <>
      <PDFDownloadLink document={<MyDocument />}>DOWNLOAD</PDFDownloadLink>
      <PDFViewer width={1100} height={2000}>
        <MyDocument />
      </PDFViewer>
    </>
  );
}
