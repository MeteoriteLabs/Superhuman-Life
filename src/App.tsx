import React, { useState } from 'react';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { authLink, defaultOptions, httpLink } from './lib/apolloClient';
import AuthContext from './context/auth-context';
import Routes from './Routes';
import Toaster from '../src/components/Toaster';
import ErrorBoundary from './components/ErrorBoundaries';
import ChangemakerWebsiteContextProvider from './context/changemakerWebsite-context';
import { onError } from '@apollo/client/link/error';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [userid, setUserid] = useState<string | null>(localStorage.getItem('userid'));
  const [errMsg, setErrMsg] = useState<string | null>();

  const errorHandler = onError(({ graphQLErrors, networkError, operation, forward }) => {
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
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorHandler, authLink.concat(httpLink)]),
    defaultOptions: defaultOptions
  });
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthContext.Provider
          value={{
            token: token,
            username: username,
            userid: userid,
            login: (token: string, username: string, userid: string) => {
              localStorage.setItem('token', token);
              localStorage.setItem('username', username);
              localStorage.setItem('userid', userid);
              setToken(token);
              setUsername(username);
              setUserid(userid);
            },
            logout: () => {
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              localStorage.removeItem('userid');
              // redirect to login page
              window.location.assign('/login');
            }
          }}>
          <ChangemakerWebsiteContextProvider>
            <Routes token={token ? token : ''} />
          </ChangemakerWebsiteContextProvider>
        </AuthContext.Provider>
      </ApolloProvider>
      {errMsg && <Toaster handleCallback={() => setErrMsg('')} type={'error'} msg={errMsg} />}
    </ErrorBoundary>
  );
};

export default App;
