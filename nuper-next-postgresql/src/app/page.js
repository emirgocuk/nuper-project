import { SpeedInsights } from "@vercel/speed-insights/react";
import SpaceHero from '@/components/SpaceHero';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Projects from '@/components/Projects';
import Events from '@/components/Events';
import Bulletins from '@/components/Bulletins';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <SpeedInsights />
      <SpaceHero />
      <About />
      <div className="container px-4 py-16 mx-auto">
        <Projects />
        <Events />
        <Bulletins />
      </div>
      <HowItWorks />
    </div>
  );
}