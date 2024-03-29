<h1 align="center">WNFT Contract</h1> <br>
<p align="center">
    <img alt="WNFT Contracts" title="WNFT Contract" src="https://raw.githubusercontent.com/Esteroids/WNFT-contract/master/docs/wnft-readme-logo.jpg" width="150">
</p>

<p align="center">
  Website NFT
</p>
<br/>

## Table of contents
* [What is WNFT](#what-is-wnft)
* [Requirements](#requirements)
* [Setting Environment Variables](#setting-environment-variables)
* [Deploy](#deploy)
* [Test](#test)
* [Gas Cost](#gas-cost)
* [Getting help](#getting-help)
* [Getting involved](#getting-involved)
* [License](#license)
* [Credits and references](#credits-and-references)

## What is WNFT
A WNFT is a concept of a website, where some areas of the website are controlled by an NFT. 

Before WNFT, We always thought of websites as "one object", with all the pages belonging to one person (or one company), and each webpage is seen as one object.

However, in WNFT we look at websites as a *collection of independent objects*, each object is owned by a different person. In WNFT, not only that each webpage is a separate object, but even each *area* in a webpage is an object.

In our implementation of WNFT, we represent each area in each webpage by an NFT token. The person who owns this token controls what is shown in this area. To create harmony in the website, all the holders of the tokens will govern the website together. 

The main thing the WNFT contract does is handle the creation and management of the token and website.

Find more information about WNFT in this [article](https://medium.com/p/7ec00099c77d/edit).


## Requirements

- [Yarn](https://yarnpkg.com/)


## Setting Environment Variables
You can set the environment variables in the`.env` file if you're unfamiliar with how environmentvariables work. Check out our [.env example](https://github.com/Esteroids/WNFT-contract/blob/main/.env.example). If you wish to use this method to set these variables, update the values in the .env.example file, and then rename it to '.env'

 **WARNING** 

Do not commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them.

`.env` example:
```
# only needed for the specific networks you intend to deploy on
KOVAN_RPC_URL='https://kovan.infura.io/v3/1231234567890'
GOERLI_RPC_URL='https://eth-goerli.alchemyapi.io/v2/your-api-key'
RINKEBY_RPC_URL='https://eth-rinkeby.alchemyapi.io/v2/your-api-key'
PRIVATE_KEY='abcdefg'
# Optional wil show gas cost
# COINMARKETCAP_API_KEY=[MY_GAS_COST]
```

Then you can install all the dependencies

```bash
yarn
```


## Deploy

The deployment script is in the [deploy](https://github.com/Esteroids/WNFT-contract/tree/main/deploy) directory. If required, edit the desired environment specific variables or constructor parameters in the script.

This will deploy to a local hardhat network
```bash
npx hardhat deploy
```

To deploy to localhost:

1. Start a local node
```bash
npx hardhat node
```
2. Open a new terminal and deploy the smart contract in the localhost network
```bash
npx hardhat --network localhost deploy
```

To deploy to a network:
```bash
npx hardhat --network <your-network> deploy
```

## Test
Tests are located in the test directory. Test should only be run on local environments.

To run tests:

```bash
npx hardhat test
```

## Gas Cost
To display gas cost you must add to the .env file your Coinmarketcap api key, can be found [here](https://coinmarketcap.com/api/pricing/).
```
COINMARKETCAP_API_KEY=[MY_GAS_COST]
```

## Getting help
If you have questions, concerns, bug reports, etc, please open an issue in this repository's Issue Tracker, send us an email to contact@esteroids.xyz or come to our [Discord](https://discord.gg/9c2EWzjFzY).

## Getting involved
We encourage you to be involved. You can either contact us in email [contact@esteroids.xyz](mailto:contact@esteroids.xyz), [Twitter](https://twitter.com/e_steroids) or [Discord](https://discord.gg/9c2EWzjFzY), or simply from the project, add features, and do a PR for us to look at it.

----

## License
The code in this repository is published under MIT license. The content in this repository is published under CC-BY-SA 3.0 license.

----

## Credits and references

WNFT was created by [Tomer Leicht](https://github.com/tomlightning) and [Eyal Ron](https://github.com/eyalron33).
