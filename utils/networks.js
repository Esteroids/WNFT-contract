const dotenv = require("dotenv")
const result = dotenv.config()
if (result.error) {
  console.error('Couldnt load ".env" file makes sure its created and contains the necessary values (see https://github.com/Esteroids/WNFT-contract#setting-environment-variables for details)')
  process.exit(1)
}

const getAlchemyUrlFromApiKey = (networkAlchemyKey, networkName) =>
  "https://eth-" + networkName.toLowerCase() + ".alchemyapi.io/v2/" + networkAlchemyKey

const getRpcUrl = (networkName) => {
  if (networkName) {
    const networkRpcUrl = process.env[networkName.toUpperCase() + "_RPC_URL"]
    if (networkRpcUrl && networkRpcUrl !== "") {
      return networkRpcUrl
    }

    // Go to https://www.alchemyapi.io, sign up, create
    // a new App in its dashboard, and replace "KEY" with its key

    // Replace this private key with your Ropsten account private key
    // To export your private key from Metamask, open Metamask and
    // go to Account Details > Export Private Key
    // Be aware of NEVER putting real Ether into testing accounts

    const networkAlchemyKey = process.env["ALCHEMY_" + networkName.toUpperCase() + "_API_KEY"]
    if (networkAlchemyKey && networkAlchemyKey !== "") {
      return getAlchemyUrlFromApiKey(networkAlchemyKey, networkName)
    }
  }
  return ""
}

const getAccounts = (networkName) => {
  if (networkName) {
    const networkPrivateKey = process.env[networkName.toUpperCase() + "_PRIVATE_KEY"]
    if (networkPrivateKey && networkPrivateKey !== "") {
      return [networkPrivateKey]
    }

    const privateKey = process.env.PRIVATE_KEY
    if (privateKey && privateKey !== "") {
      return [privateKey]
    }
  }
  return ""
}

module.exports = {
  getRpcUrl,
  getAccounts,
}
