import CallToAction from './home/CallToAction';
import Features from './home/features';
import Hero from './home/hero';
import Pricing from './home/pricing';
import Testimonials from './home/testimonials';

function Index({ section }: { section: string }): JSX.Element {
    const Section = {
        'Home: Hero': <Hero />,
        'Home: Features': <Features />,
        'Home: Cta': <CallToAction />,
        'Home: Pricing': <Pricing />,
        'Home: Testimonials': <Testimonials />
    };
    return Section[section];
}

export default Index;
