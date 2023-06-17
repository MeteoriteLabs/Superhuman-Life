import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import AuthContext from './context/auth-context';
import Routes from './Routes';
// import Toaster from '../src/components/Toaster';
import ErrorBoundary from './components/ErrorBoundaries';
import { client } from './lib/apolloClient';
import ChangemakerWebsiteContextProvider from './context/changemakerWebsite-context';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [userid, setUserid] = useState<string | null>(localStorage.getItem('userid'));
  // const [errMsg, setErrMsg] = useState<string | null>();

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
      {/* {errMsg && <Toaster handleCallback={() => setErrMsg('')} type={'error'} msg={errMsg} />} */}
    </ErrorBoundary>
  );
};

export default App;
