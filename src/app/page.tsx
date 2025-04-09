import { Metadata } from 'next';
import HomepageComponent from '@/components/homepage';

export const metadata: Metadata = {
  title: 'Huanme | Developer',
  description: 'Access to my projects, skills, and contact information.',
};

export default function Home() {
  return <HomepageComponent />;
}
