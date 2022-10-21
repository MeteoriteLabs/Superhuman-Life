import { useState } from "react";  
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, ApolloLink, from } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
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

const defaultOptions: any = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onError: (err) => console.log(err)
  },
  mutate: {
    errorPolicy: 'all',
    onError: (err) => console.log(err)
  }

}
// error handler
const errorHandler = onError(({
  graphQLErrors, networkError, operation, forward,
}) => {
  // handle graphQL errors
  // if (graphQLErrors) {
  //   // eslint-disable-next-line no-restricted-syntax
  //   for (const err of graphQLErrors) {
  //     // eslint-disable-next-line no-console
  //     console.log('[graphQLErrors]', err.message);
  //     // toaster({ type: 'error', msg: err.message });
      

  //     // return the error to the caller for local handling of the error
  //     return forward(operation);
  //   }
  // }
  // if (networkError) {
  
  //   // eslint-disable-next-line no-console
  //   console.log(`[Network error]: ${networkError}`);
  //   return forward(operation);
  //   // if you would also like to retry automatically on
  //   // network errors, we recommend that you use
  //   // apollo-link-retry
  // }

  // return forward(operation);
  debugger;
  console.log(graphQLErrors, networkError, operation, forward)
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  // link : from([
  //   authLink.concat(httpLink),
  //   errorHandler
  //   ]),
  // link: ApolloLink.from([
  //   authLink.concat(httpLink),
  //   httpLink,
  //   errorHandler
    
  // ]),
  
  
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
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
          login: (token: any, username: any, userid: any) => {

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