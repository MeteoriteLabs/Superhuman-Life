import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Team from '../sections/team';
import Hero from '../sections/hero';

function AboutUs(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero page="About" />,
        Team: <Team page="About" />
    };
    return Section[section || 'Hero'];
}

export default AboutUs;
