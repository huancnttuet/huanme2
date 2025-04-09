import Image from 'next/image';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';

export default function Intro() {
  return (
    <section
      className='px-4 py-4 sm:px-12 sm:py-24'
      id='hero'>
      <div className='container mx-auto flex flex-col md:flex-row items-center gap-4'>
        <div className='md:w-3/4 mb-8 md:mb-0'>
          <div className='text-4xl font-bold mb-4 flex gap-4 flex-col sm:flex-row'>
            <div className='text-center'>
              <motion.h1
                className='text-4xl font-bold mb-4 w-[240px] leading-[3.75rem]'
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                Hello 👋 I am
              </motion.h1>
            </div>
            <TypeAnimation
              sequence={[
                'Huan Phan Luong',
                2000,
                'Frontend Developer',
                2000,
                'Backend Developer',
                2000,
                'Web Developer',
                2000,
              ]}
              wrapper='h2'
              cursor={true}
              repeat={Infinity}
              className='text-4xl text-blue-500 leading-[3.75rem] text-left'
            />
          </div>
          <p className=' text-lg text-muted-foreground sm:text-xl mb-6'>
            I&#39;m a passionate Software Engineer with hands-on experience in
            building modern web applications using Next.js, React.js, and
            Node.js. I specialize in developing scalable, high-performance
            full-stack applications with a focus on clean code, responsive
            design, and seamless user experiences.
          </p>
          <Button
            className='mt-10'
            size={'lg'}
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/assets/pdf/HUANPL_Software_Engineer_CV.pdf';
              link.download = 'Huan_Phan_Resume.pdf';
              link.click();
            }}>
            Resume
          </Button>
        </div>
        <div className='md:w-1/2'>
          {/* Right side with profile image */}
          <div className='flex justify-center items-center relative mt-8 md:mt-0'>
            {/* Profile image */}
            <div className='relative w-80 h-80 '>
              {/* Decorative elements */}
              <div className='absolute top-0 right-0 text-[#5a5a00] font-bold'>
                <div className='flex'>
                  <span className='text-2xl'>+</span>
                  <span className='text-3xl ml-1'>+</span>
                </div>
                <div className='flex ml-4'>
                  <span className='text-2xl'>+</span>
                </div>
              </div>

              {/* Slashes decoration */}
              <div className='absolute bottom-0 -right-12 text-[#5a5a00] text-2xl font-bold'>
                / / / / /
              </div>

              <div className='absolute top-0 left-0'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='360'
                  height='360'
                  viewBox='0 0 493 493'
                  fill='none'>
                  <path
                    d='M143.385 479.93L143.385 479.929C86.1603 457.468 37.9742 403.063 14.9662 333.777C-7.95257 264.576 -5.57458 180.566 36.1367 115.425C77.9457 50.1815 159.226 3.66055 244.33 0.656615C329.356 -2.3478 418.26 38.0833 460.778 103.39C503.292 168.78 499.498 259.152 470.485 326.715C441.489 394.148 387.218 438.755 326.908 465.895C266.679 492.947 200.512 502.389 143.385 479.93Z'
                    stroke='#474306'
                  />
                </svg>
              </div>
              <div className='absolute top-[8px] left-0 w-[350px] h-[350px] rounded-full  overflow-hidden'>
                <Image
                  src='/assets/images/huanpl2.png'
                  alt='huanpl2'
                  width={400}
                  height={400}
                  className='object-cover w-full h-full'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='max-w-4xl mx-auto my-16 relative'>
          <div className='border border-gray-700 p-8 rounded-md relative'>
            <span className='text-6xl text-[#8b5cf6] absolute -top-10 left-4'>
              &quot;
            </span>
            <p className='text-xl md:text-2xl font-light text-center py-4'>
              Coding like poetry should be short and concise.
            </p>
            <div className='text-right mt-4'>
              <p className='inline-block dark:bg-[#1a1d21] px-4 py-2 border border-gray-700 rounded-md'>
                - Santosh Kalwar
              </p>
            </div>
            <span className='text-6xl text-[#8b5cf6] absolute -bottom-10 right-4 rotate-180'>
              &quot;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
