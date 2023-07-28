import Features from './features';
import Hero from './hero';

function Index({ section }: { section: string }): JSX.Element {
    const Section = {
        'About: Hero': <Hero />,
        'About: Team': <Features />
    };
    return Section[section];
}

export default Index;
