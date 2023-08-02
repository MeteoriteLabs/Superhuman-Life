import { useContext, useEffect } from 'react';
import About from './about';
import Classes from './classes';
import Contact from './contact';
import Home from './home';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { currentSelectedRoute } = changemakerWebsiteState;
    useEffect(() => {
        console.log('yo', changemakerWebsiteState);
    }, [changemakerWebsiteState]);
    const Page = {
        '/': <Home />,
        '/classes': <Classes />,
        '/aboutUs': <About />,
        '/contact': <Contact />
    };
    return Page[currentSelectedRoute || '/'];
}

export default Index;
