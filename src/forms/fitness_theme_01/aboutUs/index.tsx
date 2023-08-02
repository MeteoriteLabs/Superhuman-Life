import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Team from './team';
import Hero from './hero';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero />,
        Team: <Team />
    };
    return Section[section || 'Hero'];
}

export default Index;
