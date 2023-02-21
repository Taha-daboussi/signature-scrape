import {OpenSeaSDK, Network} from 'opensea-js'
import web3 from 'web3'
(async () => {
    // This example provider won't let you make transactions, only read-only calls:
    const provider = new web3.providers.HttpProvider('https://eth-mainnet.alchemyapi.io/v2/zoDbXJwM6lJs4oApL5-Sd-32jjAGIXxq')

    const openseaSDK = new OpenSeaSDK(provider, {
        networkName: Network.Main,
        apiKey: '3182fc3a382042ae975f8ffa1698c803'
    })
    // Expire this auction one day from now.
    // Note that we convert from the JavaScript timestamp (milliseconds):
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)

    const listing = await openseaSDK.createSellOrder({
        asset: {
            tokenId : '882',
            tokenAddress : '0x2f35783908cbda09e715608824d097fe2b50a4df',
        },
        accountAddress : '0x752f434abCaE0021Ee9e069224B183EDe5634A87',
        startAmount: 3,
        // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
        endAmount: 0.1,
        expirationTime
    })
})()