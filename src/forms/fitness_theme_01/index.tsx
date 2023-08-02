import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import HomePageForm from './home';
import ClassesPageForm from './classes';
import AboutPageForm from './aboutUs';
import ContactPageForm from './contact';
import OfferingsPageForm from './offerings';

function Index(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    const { currentSelectedRoute } = changemakerWebsiteState;

    const Page = {
        '/': <HomePageForm />,
        '/classes': <ClassesPageForm />,
        '/aboutUs': <AboutPageForm />,
        '/contact': <ContactPageForm />,
        '/offerings': <OfferingsPageForm />
    };
    return Page[currentSelectedRoute || '/'];
}

export default Index;
