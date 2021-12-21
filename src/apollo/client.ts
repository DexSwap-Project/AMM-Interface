import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from 'dexswap-sdk'

export const defaultSubgraphClient = new ApolloClient({
  uri: '',
  cache: new InMemoryCache()
})

export const subgraphClients: { [chainId in ChainId]?: ApolloClient<NormalizedCacheObject> | undefined } = {
  [ChainId.MAINNET]: defaultSubgraphClient,
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/agin-dropdisco/gin-rinkeby-data',
    cache: new InMemoryCache()
  }),
  [ChainId.HARMONY]: new ApolloClient({
    uri: 'https://graph.t.hmny.io/subgraphs/name/agin-dropdisco/harmony_agin',
    cache: new InMemoryCache()
  }),
  [ChainId.HARMONY_TESTNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/agin-dropdisco/dexswap-rinkeby-gin',
    cache: new InMemoryCache()
  })
}
