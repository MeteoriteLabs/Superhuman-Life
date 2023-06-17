import { ApolloClient, ApolloLink, FetchPolicy, InMemoryCache, WatchQueryFetchPolicy, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_URL}/graphql`
  });

const errorHandler = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      // eslint-disable-next-line no-restricted-syntax
      for (const err of graphQLErrors) {
        console.log(err);
        return forward(operation);
      }
    }
    if (networkError) {
      return forward(operation);
    }

    return forward(operation);
  });


  const defaultOptions: {
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

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorHandler, authLink.concat(httpLink)]),
    defaultOptions: defaultOptions
  });