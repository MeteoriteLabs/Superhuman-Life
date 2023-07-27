import Home from './home';

function Index({ section, page }: { section: string; page: string }): JSX.Element {
    const Page = {
        Home: <Home section={section} />
        // About: <About />
    };
    return Page[page];
}

export default Index;
