import About from '@/components/homepage/about';
import Contact from '@/components/homepage/contact';
import Hero from '@/components/homepage/hero';
import SkillsSection from '@/components/homepage/hero/skills-section';
import Projects from '@/components/homepage/projects';

export default function HomepageComponent() {
  return (
    <main className='min-h-screen'>
      <Hero />
      <Projects />
      <SkillsSection />
      <About />
      <Contact />
    </main>
  );
}
