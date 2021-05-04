import Routes from "./Routes";

function App() {
  const isAuthenticated: boolean = true;

  return <Routes isAuthenticated={isAuthenticated} />;
}

export default App;
