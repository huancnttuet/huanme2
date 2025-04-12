'use client';

import useCommon from '@/store/common';

export default function Spinner() {
  const { isLoading } = useCommon((state) => state);

  return (
    <>
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary'></div>
        </div>
      )}
    </>
  );
}
