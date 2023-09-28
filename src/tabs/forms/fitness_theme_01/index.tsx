import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import HomePageForm from './pages/home';
import ClassesPageForm from './pages/classes';
import AboutPageForm from './pages/aboutUs';
import ContactPageForm from './pages/contact';
import OfferingsPageForm from './pages/offerings';
import extractPageRoute from 'lib/extractPageRoute';

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
    return Page[extractPageRoute(currentSelectedRoute) || '/'];
}

export default Index;
