'use client';

import { motion } from 'framer-motion';

const timelineItems = [
  {
    period: '09/2017-12/2021',
    title:
      'University of Engineering and Technology(VNU) | Bachelor of Information Technology',
    description: `- GPA: 3.6
                  - TOEIC: 450
                  - 3rd Prize at the National Procon Competition 2019
                  - Phong Vu Scholarship 2018`,
  },
  {
    period: '08/2021 - 10/2022',
    title: 'Punch Entertainment Vietnam Co., Ltd. | Software Engineer',
    description: `
      Assisted in the development of web applications using NodeJS and ReactJS.
      Worked on the implementation of RESTful APIs for communication between frontend and backend.
      Participated in code reviews and debugging sessions to ensure high-quality, bug-free code.
      Wrote unit and integration tests to improve the reliability of the application.
      Gained experience working with cloud platforms such as AWS.
        `,
  },
  {
    title: 'Vietnam Multimedia Services., JSC | Software Engineer',
    period: ' 04/2022 - present',
    description: `
      Developed and maintained web applications using NodeJS, ReactJS.
      Integrated third-party APIs and optimized performance to ensure smooth user experience and fast
      loading times.
      Collaborated closely with UI/UX designers to translate design prototypes into interactive and
      responsive web interfaces.
      Wrote clean, scalable, and maintainable code following industry best practices and coding standards.
      Collaborated with cross-functional teams in an Agile environment to deliver new features and bug
      fixes on time.
      `,
  },
];

export default function About() {
  return (
    <section
      className='py-20 px-4 sm:px-20'
      id='about'>
      <h2 className='text-3xl font-bold'>
        <span className='text-[#8b5cf6]'>#</span>about
      </h2>
      <div className='max-w-4xl mx-auto space-y-4'>
        <div>
          <motion.div
            key={'about'}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1 * 0.1 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 1 },
            }}>
            <p className='text-lg  sm:text-xl mb-12'>
              A software engineer with 3+ years of experience designing,
              developing, and deploying scalable software solutions. Proven
              ability to work in fast-paced environments and deliver quality
              results within tight deadlines. Passionate about writing clean,
              maintainable code and continually improving development skills.
            </p>
          </motion.div>
        </div>

        <div className='max-w-4xl mx-auto'>
          {/* Timeline items */}
          <div className='space-y-16'>
            {timelineItems.map((item, index) => (
              <motion.div
                key={'about' + index}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: index * 0.5 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 1 },
                }}>
                <div
                  key={index}
                  className='flex'>
                  <div className='mr-6 pt-1'>
                    <div className='w-4 h-4 rounded-full bg-[#1e2761]'></div>
                  </div>
                  <div>
                    <h2 className='text-xl font-bold mb-2 '>{item.title}</h2>
                    <h3 className='text-xl font-semibold mb-4'>
                      {item.period}
                    </h3>
                    <p className='text-lg'>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
