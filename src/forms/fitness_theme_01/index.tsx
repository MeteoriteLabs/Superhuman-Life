import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import HomePageForm from './home';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { currentSelectedRoute } = changemakerWebsiteState;

    const Page = {
        '/': <HomePageForm />
    };
    return Page[currentSelectedRoute || '/'];
}

export default Index;
