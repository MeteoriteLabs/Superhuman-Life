import { useState } from "react";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import AuthContext from "./context/auth-context";
import Routes from "./Routes";

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const isAuthenticated: boolean = false;
  const [token, setToken] = useState<any>(localStorage.getItem("token"));
  const [username, setUsername] = useState<any>(localStorage.getItem("username"));

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          token: token,
          username: username,
          login: (token: any, username: any) => {
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            setToken(token);
            setUsername(username);
          },
          logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
          },
        }}
      >
        <Routes isAuthenticated={isAuthenticated} />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
