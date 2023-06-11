import Home from './home';

function Index({ page }: { page: string }): JSX.Element {
  const Page = {
    home: <Home />
  };
  return Page[page];
}

export default Index;
