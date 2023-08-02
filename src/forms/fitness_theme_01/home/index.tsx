import { useContext } from 'react';
import CallToAction from './CallToAction';
import Features from './features';
import Hero from './hero';
import Pricing from './pricing';
import Testimonials from './testimonials';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero />,
        Features: <Features />,
        Cta: <CallToAction />,
        Pricing: <Pricing />,
        Testimonials: <Testimonials />
    };
    return Section[section || 'Hero'];
}

export default Index;
