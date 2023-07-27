import { useContext } from 'react';
import FitnessTemplate_01 from './templates/fitnessTemplate_01';
import { ChangeMakerWebsiteContext } from '../context/changemakerWebsite-context';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const selectedTemplate = changemakerWebsiteState.selectedTemplate;
    const templates = {
        '': <FitnessTemplate_01 />
    };

    return templates[selectedTemplate || ''];
}

export default Index;
