import React from 'react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import * as storage from '../utils/storage';

const httpLink = createHttpLink({
  uri: window.RUNTIME_APP_GRAPHQL_URI
    ? window.RUNTIME_APP_GRAPHQL_URI
    : process.env.REACT_APP_GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = storage.get('token_id');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

class ApolloApp extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
    );
  }
}

export default ApolloApp;
