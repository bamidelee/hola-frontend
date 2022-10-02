import ReactDOM from 'react-dom'
import App from './App.js'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { 
  ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client' 
import { getMainDefinition } from '@apollo/client/utilities'



const authLink = setContext((_, { headers }) => {
  const token =  localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'https://hola-728z.onrender.com' })
const wsLink = new GraphQLWsLink(createClient({
  url: `wss://hola-728z.onrender.com/graphql`,
  options: {
    reconnect: true
  }
}))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link:splitLink,
  
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)