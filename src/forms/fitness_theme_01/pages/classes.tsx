import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Scheduler from '../sections/scheduler';
import Features from '../sections/features';
import Hero from '../sections/hero';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero page="Classes" />,
        Features: <Features page="Classes" />,
        Scheduler: <Scheduler page="Classes" />
    };
    return Section[section || 'Hero'];
}

export default Index;
