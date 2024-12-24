'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const PdfDownloadButton = dynamic(
  () =>
    import('../../components/PdfDownloadButton').then(
      (mod) => mod.PdfDownloadButton
    ),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const PdfViewer = dynamic(
  () => import('../../components/PdfViewer').then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>,
  }
);

export default function PDF() {
  return (
    <>
      <PdfDownloadButton />
      <PdfViewer />
    </>
  );
}
