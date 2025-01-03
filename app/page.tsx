'use client';
import dynamic from 'next/dynamic';

// Dynamically import the SalesForm component with client-side only rendering
const SalesForm = dynamic(
  () => import('@/components/forms/sales').then((mod) => mod.SalesForm),
  {
    ssr: false,
    loading: () => (
      <div className='p-8 m-14'>
        <p>A carregar...</p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className='p-8 m-14'>
      <SalesForm />
    </div>
  );
}
