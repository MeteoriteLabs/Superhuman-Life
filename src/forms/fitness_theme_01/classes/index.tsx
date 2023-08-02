import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Scheduler from './scheduler';
import Features from './features';
import Hero from './hero';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero />,
        Features: <Features />,
        Scheduler: <Scheduler />
    };
    return Section[section || 'Hero'];
}

export default Index;
