'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  metadata: Metadata;
}

interface Metadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  url: string;
}

export default function LinkPreview({ metadata }: LinkPreviewProps) {
  return (
    <a
      href={metadata.url}
      target='_blank'
      rel='noopener noreferrer'
      className='block overflow-hidden rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='flex flex-col md:flex-row'>
        {metadata.image && (
          <div className='md:w-1/3'>
            <Image
              src={metadata.image}
              alt={metadata.title}
              width={300}
              height={200}
              className='object-cover w-full h-48 md:h-full'
            />
          </div>
        )}
        <div className='p-4 flex flex-col justify-between flex-grow'>
          <div>
            <div className='flex items-center mb-2'>
              {metadata.favicon && (
                <Image
                  src={metadata.favicon}
                  alt='Favicon'
                  width={16}
                  height={16}
                  className='mr-2'
                />
              )}
              <h3 className='text-lg font-semibold text-white line-clamp-1'>
                {metadata.title}
              </h3>
            </div>
            <p className='text-sm text-gray-200 line-clamp-2'>
              {metadata.description}
            </p>
          </div>
          <div className='mt-4 flex items-center text-sm text-gray-100'>
            <ExternalLink
              size={14}
              className='mr-1'
            />
            {new URL(metadata.url).hostname}
          </div>
        </div>
      </div>
    </a>
  );
}
