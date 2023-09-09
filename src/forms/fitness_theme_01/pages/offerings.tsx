import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

import Hero from '../sections/hero';
import Offering from '../sections/offering';

function Offerings(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { section } = changemakerWebsiteState;

    const Section = {
        Hero: <Hero page="Offerings" />,
        'Group Offerings': <Offering type="Group" />,
        Cohort: <Offering type="Cohort" />,
        'One to One': <Offering type="One to One" />,
        'Live Stream': <Offering type="Live" />,
        Custom: <Offering type="Custom" />
    };
    return Section[section || 'Hero'];
}

export default Offerings;
