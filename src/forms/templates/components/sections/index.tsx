import About from './about';
import Classes from './classes';
import Contact from './contact';
import Home from './home';

function Index({ page }: { page: string }): JSX.Element {
  const Page = {
    home: <Home />,
    classes: <Classes />,
    about: <About />,
    contact: <Contact />
  };
  return Page[page];
}

export default Index;
