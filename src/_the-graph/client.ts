import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const GRAPH_API_KEY = process.env['GRAPH_API_KEY']!

const GRAPH_URL = "https://gateway-arbitrum.network.thegraph.com/api/"

export const base721 = GRAPH_URL + GRAPH_API_KEY + '/subgraphs/id/D4ab55j22wJLqdkmepiMVcSxQ44S2DTdh5aRQ5f5EqJF'
export const base1155QueryUrl = "https://gateway-arbitrum.network.thegraph.com/api/"+GRAPH_API_KEY+"/subgraphs/id/9LyYqhj7LqDaivsifyeYF7ERqtmisnzXWm2799qo7Xfq"

export const eth721Graph = "https://gateway-arbitrum.network.thegraph.com/api/"+ GRAPH_API_KEY +"/subgraphs/id/CBf1FtUKFnipwKVm36mHyeMtkuhjmh4KHzY3uWNNq5ow"
export const eth1155Graph = "https://gateway-arbitrum.network.thegraph.com/api/"+GRAPH_API_KEY+"/subgraphs/id/5C6JRVzKcE9AVbT7S71EycV8eEGcfkJB9gGsyTbHMVmN"

export const client = new ApolloClient({
  uri: base721,
  cache: new InMemoryCache(),
});


export const GetUsersQuery = `
query GetLatestUsers {
  users(orderDirection: desc, orderBy: firstInteractionDate) {
    id
    firstInteractionDate
  }
}
`

export const GetUsersGQL = gql`
query GetLatestUsers {
  users(orderDirection: desc, orderBy: firstInteractionDate) {
    id
    firstInteractionDate
  }
}
`

export default client;
