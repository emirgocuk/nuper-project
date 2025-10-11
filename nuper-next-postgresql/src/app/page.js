import SpaceHero from '@/components/SpaceHero';
import Projects from '@/components/Projects';
import Events from '@/components/Events';
import Bulletins from '@/components/Bulletins';

export default function HomePage() {
  return (
    <div>
      <SpaceHero />
      <div className="container px-4 mx-auto">
        <Projects />
        <Events />
        <Bulletins />
      </div>
    </div>
  );
}