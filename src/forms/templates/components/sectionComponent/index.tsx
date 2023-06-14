import Cta from './home/cta';
import Features from './home/features';
import Hero from './home/hero';
import Pricing from './pricing';
import Testimonials from './testimonials';

function Index({ section }: { section: string }): JSX.Element {
  const Section = {
    'Home: Hero': <Hero />,
    'Home: Features': <Features />,
    'Home: Cta': <Cta />,
    'Home: Pricing': <Pricing />,
    'Home: Testimonials': <Testimonials />
  };
  return Section[section];
}

export default Index;
