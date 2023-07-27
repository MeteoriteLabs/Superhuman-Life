import About from './about';
import Classes from './classes';
import Contact from './contact';
import Home from './home';

function Index({ page }: { page: string }): JSX.Element {
    const Page = {
        Navbar: <></>,
        Footer: <></>,
        Home: <Home />,
        Classes: <Classes />,
        About: <About />,
        Contact: <Contact />
    };
    return Page[page];
}

export default Index;
