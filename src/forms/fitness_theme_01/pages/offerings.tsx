import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

import Hero from '../sections/hero';

function Offerings(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero page="Offerings" />,
        'Group Offerings': '',
        Cohort: '',
        'One to One': '',
        'Live Stream': '',
        Custom: ''
    };
    return Section[section || 'Hero'];
}

export default Offerings;
