import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactSection() {
  return (
    <section className='py-20 px-4 sm:px-20'>
      <h2 className='text-3xl font-bold'>
        <span className='text-[#8b5cf6]'>#</span>about
      </h2>
      <form className='max-w-md mx-auto space-y-4'>
        <Input
          type='text'
          placeholder='Your Name'
        />
        <Input
          type='email'
          placeholder='Your Email'
        />
        <Textarea placeholder='Your Message' />
        <Button
          type='submit'
          className='w-full'>
          Send Message
        </Button>
      </form>
    </section>
  );
}
