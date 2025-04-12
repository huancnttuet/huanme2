'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendEmail } from '@/lib/email';
import useCommon from '@/store/common';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { setIsLoading } = useCommon((state) => state);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here

    setIsLoading(true);

    sendEmail({
      name,
      email: 'huancnttuet@gmail.com',
      subject: 'New message from contact form ',
      content: message,
    }).then((res) => {
      if (res.success) {
        console.log('Email sent successfully');
      } else {
        console.error('Error sending email:', res.error);
      }

      setIsSent(true);
      setIsLoading(false);
    });
  };

  return (
    <section
      className='py-20 px-4 sm:px-20'
      id='contact'>
      <h2 className='text-3xl font-bold'>
        <span className='text-[#8b5cf6]'>#</span>contact
      </h2>

      <div className='max-w-4xl mx-auto p-12'>
        {!isSent && (
          <motion.form
            onSubmit={handleSubmit}
            className='max-w-md mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className='mb-6 relative'>
              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full bg-gray-700 text-white border-b-2 border-gray-500 p-2 focus:outline-none focus:border-black transition-colors peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='name'
                className={`absolute left-2 top-2 text-gray-400 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px] peer-focus:text-sm peer-focus:text-black ${
                  name ? 'top-[-20px] text-sm ' : ''
                }`}>
                Name
              </label>
            </div>
            <div className='mb-6 relative'>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-gray-700 text-white border-b-2 border-gray-500 p-2 focus:outline-none focus:border-black transition-colors peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='email'
                className={`absolute left-2 top-2 text-gray-400 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px] peer-focus:text-sm peer-focus:text-black ${
                  email ? 'top-[-20px] text-sm ' : ''
                }`}>
                Email
              </label>
            </div>
            <div className='mb-6 relative'>
              <textarea
                id='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full bg-gray-700 text-white border-b-2 border-gray-500 p-2 focus:outline-none focus:border-black transition-colors peer'
                rows={4}
                placeholder=' '
                required></textarea>
              <label
                htmlFor='message'
                className={`absolute left-2 top-2 text-gray-400 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px] peer-focus:text-sm peer-focus:text-black ${
                  message ? 'top-[-20px] text-sm ' : ''
                }`}>
                Message
              </label>
            </div>
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded hover:from-purple-600 hover:to-pink-600 transition-colors'>
              Send Message
            </button>
          </motion.form>
        )}

        {isSent && (
          <motion.div
            className='max-w-md mx-auto text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h3 className='text-lg font-bold text-green-500'>
              Message Sent Successfully!
            </h3>
            <p className='text-gray-400'>I will get back to you soon.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
