import { useContext } from 'react';
import CallToAction from '../sections/CallToAction';
import Features from '../sections/features';
import Hero from '../sections/hero';
import Pricing from '../sections/pricing';
import Testimonials from '../sections/testimonials';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

function Home(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero page="Home" />,
        Features: <Features page="Home" />,
        Cta: <CallToAction page="Home" />,
        Pricing: <Pricing page="Home" />,
        Testimonials: <Testimonials page="Home" />
    };
    return Section[section || 'Hero'];
}

export default Home;
