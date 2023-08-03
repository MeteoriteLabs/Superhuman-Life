import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { useContext } from 'react';

import FitnessTheme01 from './fitness_theme_01';

const Index = (): JSX.Element => {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { selectedTemplate } = changemakerWebsiteState;

    const Page = {
        'Fitness Theme 01': <FitnessTheme01 />
    };

    return Page[selectedTemplate || ''];
};

export default Index;
