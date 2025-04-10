'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LinkPreview from './link-preview';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Vitable',
    description:
      'Vitable is an Australian personalized vitamin subscription platform that provides tailored supplements based on individual health goals and lifestyle.',

    fullDescription:
      'Vitable is an Australian personalized vitamin subscription platform that provides tailored supplements based on individual health goals and lifestyle. I contributed to the development and maintenance of both frontend and backend features, ensuring seamless user interactions and optimized performance. I integrated third-party APIs, handled data synchronization, and implemented scalable solutions using Next.js and Node.js. I also worked closely with the design team to build responsive interfaces that enhance user engagement and accessibility.',

    image: '/assets/images/projects/vitable.jpg',
    techlogies: [
      'NextJS',
      'ExpressJS',
      'ReactJS',
      'NodeJS',
      'AWS',
      'PostgreSQL',
      'Redis',
      'Bitbucket',
      'Vercel',
    ],
    metadata: {
      title: 'Vitable',
      description: 'Vitable | Personalised Daily Vitamin Packs',
      image: '/assets/images/projects/vitable.jpg',
      favicon: 'https://www.vitable.com.au/favicon.ico',
      url: 'https://www.vitable.com.au/',
    },
  },
  {
    id: 2,
    title: 'Ehon',
    description:
      'Ehon is a Japanese educational platform focused on delivering interactive and engaging content for children through digital storytelling.',
    fullDescription: `Ehon is a Japanese educational platform focused on delivering interactive and engaging content for children through digital storytelling. I was involved in building key features of the platform using ReactJS for the user interface and NodeJS for backend services. I implemented RESTful APIs, managed MySQL databases, and ensured data integrity and security. My role also included optimizing performance and improving the codebase for better scalability and maintainability.`,
    image: '/assets/images/projects/ehon.webp',
    techlogies: ['NodeJS', 'ReactJS', 'AWS', 'MySQL', 'Redis', 'Docker'],
    metadata: {
      title: 'Ehon',
      description: 'Ehon | Japanese Educational Platform',
      image: '/assets/images/projects/ehon.webp',
      favicon:
        'https://ehon-inc.jp/cdn/shop/t/12/assets/favicon.ico?v=92684485878422692971699505911',
      url: 'https://ehon-inc.jp/',
    },
  },
  {
    id: 3,
    title: 'Build with XO',
    description:
      'Build with XO is a personal e-commerce project focused on selling 3D model, designed to showcase modern frontend and backend technologies',
    fullDescription: `Build with XO is a personal e-commerce project focused on selling 3D model, designed to showcase modern frontend and backend technologies. I developed the platform using NextJS with server-side rendering and optimized performance through Vercel deployment. The project features a fully responsive UI built with TailwindCSS and the Shadcn component library. Zustand was used for lightweight global state management, and MongoDB handled dynamic product data storage. The site includes a modern shopping experience with cart functionality, product detail pages, and admin controls for managing listings.`,
    image: '/assets/images/projects/buildxo.jpg',
    techlogies: ['NextJS', 'ReactJS', 'MongoDB', 'Vercel'],
    metadata: {
      title: 'Build with XO',
      description: 'Build with XO | Personal E-commerce Project',
      image: '/assets/images/projects/buildxo.jpg',
      favicon: 'https://www.buildwithxo.com/favicon.ico',
      url: 'https://www.buildwithxo.com/',
    },
  },
];

export default function Projects() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section
      className='py-20 px-4 sm:px-20'
      id='projects'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold'>
          <span className='text-[#8b5cf6]'>#</span>projects
        </h2>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layoutId={`project-${project.id}`}
            onClick={() => setSelectedId(project.id)}
            className='bg-gray-800 rounded-lg overflow-hidden cursor-pointer'
            whileHover={{ scale: 1.05 }}>
            <div className='border border-gray-800 rounded-md overflow-hidden bg-[#1a1d21]'>
              <div className='h-48 relative bg-gradient-to-br from-green-900 to-black'>
                <div className='absolute inset-0 p-6 flex items-center justify-center'>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              </div>
              <div className='p-4 border-t border-gray-800'>
                <div className='flex flex-wrap gap-2 mb-3'>
                  {project.techlogies.map((tech) => (
                    <span
                      key={tech}
                      className='text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded'>
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className='text-xl font-bold mb-2 text-white'>
                  {project.title}
                </h3>
                <p className='text-gray-400 text-sm mb-4'>
                  {project.description}
                </p>
                <div className='flex gap-3'>
                  <Link
                    href={project.metadata.url}
                    target='_blank'
                    className='px-4 py-2 border border-[#8b5cf6] text-[#8b5cf6] rounded hover:bg-[#8b5cf6] hover:bg-opacity-10 transition-colors flex items-center'>
                    Live <span className='mx-1'>&lt;~&gt;</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={`project-${selectedId}`}
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
            onClick={() => setSelectedId(null)}>
            <motion.div
              className='bg-gray-800 p-8 rounded-lg max-w-2xl w-full'
              onClick={(e) => e.stopPropagation()}>
              <LinkPreview
                metadata={
                  projects.find((p) => p.id === selectedId)?.metadata ||
                  projects[0].metadata
                }
              />
              <div className='flex gap-2 mt-4'>
                {projects
                  .find((p) => p.id === selectedId)
                  ?.techlogies.map((tech) => (
                    <span
                      key={tech}
                      className='text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded'>
                      {tech}
                    </span>
                  ))}
              </div>
              <h3 className='text-xl font-bold mb-2 text-white'>
                {projects.find((p) => p.id === selectedId)?.title ||
                  projects[0].title}
              </h3>
              <p className='text-gray-400 text-sm mb-4'>
                {projects.find((p) => p.id === selectedId)?.fullDescription ||
                  projects[0].fullDescription}
              </p>

              <button
                onClick={() => setSelectedId(null)}
                className='mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
