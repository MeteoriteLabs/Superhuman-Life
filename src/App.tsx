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
  const [token, setToken] = useState<any>(localStorage.getItem("token"));
  const [username, setUsername] = useState<any>(localStorage.getItem("username"));
  const [userid, setUserid] = useState<any>(localStorage.getItem("userid"));
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          token: token,
          username: username,
          userid: userid,
          login: (token: any, username: any,userid: any) => {
            console.log(userid);
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("userid", userid);
            setToken(token);
            setUsername(username);
            setUserid(userid);
          },
          logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userid");
          },
        }}
      >
        <Routes token={token} />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;