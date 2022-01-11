const { expect } = require("chai")

const notWNFTContractOwner = async (wnftContract, addr) => {
  expect(await wnftContract.owner()).to.be.not.equal(addr.address)
}

const WNFTContractOwner = async (wnftContract, addr) => {
  expect(await wnftContract.owner()).to.be.equal(addr.address)
}

const ContractsNotSame = async (contract1, contract2) => {
  expect(contract1).to.be.not.equal(contract2)
}

const TestUtils = {
  ContractsNotSame: ContractsNotSame,
  WNFTContractOwner: WNFTContractOwner,
  notWNFTContractOwner: notWNFTContractOwner,
}

module.exports = { TestUtils }
