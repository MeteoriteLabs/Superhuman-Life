import Routes from "./Routes";

function App() {
  const isAuthenticated: boolean = false;

  return <Routes isAuthenticated={isAuthenticated} />;
}

export default App;
