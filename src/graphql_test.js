import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import React, { Component } from 'react';
import { ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


function LatestComment() {
  console.log("asdasd")

  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudF9pZCI6IjUxIiwiZ3JvdXBfaWQiOiIxMDAiLCJzZXJ2aWNlX2lkIjoiMTAwIiwiYWdlbnRfbmFtZSI6ItCi0LXRgdGC0LXRgNC-0LI0INCiLiDQoi4gIn0.Z9h-j-OytkaP_WtRjh0mBor6YxdEg3cBMhM4QsZkLkI"

  const wsLink = new WebSocketLink({
    uri: 'ws://192.168.108.153:18081/graphql_server/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: token
      }
    }
  });

  const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? token : "",
    }
  }
});

  const client = new ApolloClient({
    link: authLink.concat(wsLink),
    cache: new InMemoryCache()
  });

  const COMMENTS_SUBSCRIPTION = gql`
    subscription startMessageSubscription {
            startMessageSubscription {
              ...EventFields
            }
          }
          fragment EventFields on Event {
            type
          }
  `;

  const { loading, error, data } = useSubscription(
    COMMENTS_SUBSCRIPTION,
    {client: client}
  );
}


class Hello extends React.Component {
  render() {
  	return <div><button onClick={this.handleClick}>Test</button></div>;
  }

  handleClick() {
    console.log('The link was clicked.');
    LatestComment();
  }
}

export default LatestComment;
