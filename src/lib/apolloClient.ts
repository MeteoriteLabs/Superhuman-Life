import {  FetchPolicy, WatchQueryFetchPolicy, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

export  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_URL}/graphql`
  });


 export  const defaultOptions: {
    watchQuery: {
        fetchPolicy: WatchQueryFetchPolicy | undefined
    };
    query: {
        fetchPolicy: FetchPolicy | undefined
    };
  } = {
    watchQuery: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    }
  };

