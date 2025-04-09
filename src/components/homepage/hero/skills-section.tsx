'use client';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const skills = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'Tailwind CSS',
  'AWS',
  'Bitbucket',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Redis',
  'Shadcn UI',
];

export default function SkillsSection() {
  return (
    <section
      className='py-20 px-4 sm:px-20'
      id='skills'>
      <h2 className='text-3xl font-bold'>
        <span className='text-[#8b5cf6]'>#</span>skills
      </h2>
      <div className='flex flex-wrap justify-center gap-2 p-10'>
        {skills.map((skill, index) => (
          <motion.div
            key={skill}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}>
            <Badge
              key={index}
              variant='secondary'
              className='text-lg py-2 px-4'>
              {skill}
            </Badge>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
