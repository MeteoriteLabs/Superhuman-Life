import { useContext } from 'react';
import About from './about';
import Classes from './classes';
import Contact from './contact';
import Home from './home';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Offerings from './offerings';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { currentSelectedRoute } = changemakerWebsiteState;

    const Page = {
        '/': <Home />,
        '/classes': <Classes />,
        '/aboutUs': <About />,
        '/contact': <Contact />,
        '/offerings': <Offerings />
    };
    return Page[currentSelectedRoute || '/'];
}

export default Index;
