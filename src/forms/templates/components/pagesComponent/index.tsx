import About from './about';
import Classes from './classes';
import Contact from './contact';
import Home from './home';

function Index({
    page,
    section,
    setSection
}: {
    page: string;
    section: string;
    setSection: (param: string) => void;
}): JSX.Element {
    const Page = {
        home: <Home section={section} setSection={setSection} />,
        classes: <Classes section={section} setSection={setSection} />,
        about: <About section={section} setSection={setSection} />,
        contact: <Contact section={section} setSection={setSection} />
    };
    return Page[page];
}

export default Index;
