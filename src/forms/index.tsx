import Home from './home';
import About from './about';

function Index({ section, page }: { section: string; page: string }): JSX.Element {
    const Page = {
        Home: <Home section={section} />,
        About: <About section={section} />
    };
    return Page[page];
}

export default Index;
