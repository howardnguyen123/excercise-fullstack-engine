import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: import.meta.env.VITE_ENDPOINT_API,
});

export default client;
