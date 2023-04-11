import React, { useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AuthContext from "./context/auth-context";
import Routes from "./Routes";
import Toaster from "../src/components/Toaster";

const App: React.FC = () => {
  const [token, setToken] = useState<any>(localStorage.getItem("token"));
  const [username, setUsername] = useState<any>(
    localStorage.getItem("username")
  );
  const [userid, setUserid] = useState<any>(localStorage.getItem("userid"));
  const [errMsg, setErrMsg] = useState<string | null>();

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
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
  };

  const errorHandler = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        // eslint-disable-next-line no-restricted-syntax
        for (const err of graphQLErrors) {
          setErrMsg(err.message);
          return forward(operation);
        }
      }
      if (networkError) {
        return forward(operation);
      }

      return forward(operation);
    }
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorHandler, authLink.concat(httpLink)]),

    defaultOptions: defaultOptions,
  });

  return (
    <>
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          token: token,
          username: username,
          userid: userid,
          login: (token: any, username: any,userid: any) => {

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
            // redirect to login page
            window.location.assign('/login');
          },
        }}
      >
        <Routes token={token} />
      </AuthContext.Provider>
    </ApolloProvider>
    {errMsg && <Toaster handleCallback={ () => setErrMsg('') } type={'error'} msg={errMsg} />}
    </>
  );
}

export default App;
