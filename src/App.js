import Routes from "./Routes";

function App() {
  const isAuthenticated = true;

  return <Routes isAuthenticated={isAuthenticated} />;
}

export default App;
