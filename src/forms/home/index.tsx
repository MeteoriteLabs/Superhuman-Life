import CallToAction from './CallToAction';
import Features from './features';
import Hero from './hero';
import Pricing from './pricing';
import Testimonials from './testimonials';

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
