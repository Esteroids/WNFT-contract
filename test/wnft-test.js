const { expect } = require("chai")
const { ethers, network, waffle } = require("hardhat")
const skipIf = require("mocha-skip-if")
const { deployMockContract } = waffle

const { TestUtils } = require("../test-utils/test-utils")
const { developmentChains } = require("../helper-hardhat-config")

const PublicResolver = require("../artifacts/@ensdomains/resolver/contracts/Resolver.sol/Resolver.json")
const ENSRegistry = require("../artifacts/@ensdomains/ens/contracts/ENS.sol/ENS.json")

skipIf.if(!developmentChains.includes(network.name)).describe("WNFT Contract", function () {
  const WNFTName = "Citadel"
  const WNFTSymbol = "CIT"

  let publicResolverContract
  let ensRegistryContract

  const ensNodeId = "0x18b7e70c27aa3a4fd844e78c153b49a03233f5588351c1fc26cff3486469b379"

  const price = ethers.BigNumber.from(140330173736)
  const priceInETH = (1 * 10 ** 8) / price
  const priceInWie = ethers.BigNumber.from((Math.ceil(priceInETH * 10 ** 18)).toString())
  const priceDecimals = 8

  let wnftContract
  let onchainTokenDataStringContract

  let mintingContract
  let WNFT
  let Minting
  let onchainTokenDataString
  let owner, addr1, addr2
  let MockV3Aggregator
  let mockPriceFeed

  before(async function () {
    // runs once before the first test in this block
    Minting = await ethers.getContractFactory("Minting")
    mintingContract = await Minting.deploy()
    await mintingContract.deployed()
    ;[owner, addr1, addr2] = await ethers.getSigners()
    publicResolverContract = await deployMockContract(owner, PublicResolver.abi)
    ensRegistryContract = await deployMockContract(owner, ENSRegistry.abi)

    onchainTokenDataString = await ethers.getContractFactory("onchainTokenDataString")

    MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator")
    mockPriceFeed = await MockV3Aggregator.deploy(priceDecimals, price)
    WNFT = await ethers.getContractFactory("WNFT")
  })

  beforeEach(async function () {
    wnftContract = await WNFT.deploy(
      WNFTName,
      WNFTSymbol,
      mintingContract.address,
      publicResolverContract.address,
      ensRegistryContract.address,
      ensNodeId,
      mockPriceFeed.address,
    )
    await wnftContract.deployed()
  })

  describe("Deployment", async function () {
    const expectedInitialSwitchContractFlag = ethers.utils.getAddress("0x0000000000000000000000000000000000000000")

    it("Should set the right owner", async function () {
      await TestUtils.WNFTContractOwner(wnftContract, owner)
    })

    it("Should set the 'contract switched' flag as disabled", async function () {
      const initContractSwitch = await wnftContract.contractSwitched()

      expect(initContractSwitch).to.equal(expectedInitialSwitchContractFlag)
    })

    it("Should set the 'minting contract'", async function () {
      const initMintingContract = await wnftContract.mintingContract()

      expect(initMintingContract).to.equal(mintingContract.address)
    })
  })

  describe("Minting", async function () {
    it("Allow minting", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2.address

      const mintTx = await wnftContract.mint(testMintTo, testTokenId, { value: priceInWie })
      await mintTx.wait()

      expect(await wnftContract.ownerOf(testTokenId)).to.be.equal(testMintTo)
    })

    it("Minting with Limited Amount contract example", async function () {
      const MintingLimitedAmount = await ethers.getContractFactory("MintingLimitedAmount")
      const mintingLimitedAmountContract = await MintingLimitedAmount.deploy()

      // set WNFT and max amount
      const setWNFT = await mintingLimitedAmountContract.setWNFT(wnftContract.address)
      setWNFT.wait()

      const setAmountMax = await mintingLimitedAmountContract.increaseMaxAmount(10)
      setAmountMax.wait()

      // set mining contract in WNFT
      await wnftContract.setMintingContract(mintingLimitedAmountContract.address)

      // test minting
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2.address
      const testTokenURI = "test://test.ckkjkj"

      await wnftContract.mintWithTokenURI(testMintTo, testTokenId, testTokenURI, { value: priceInWie })

      // test results
      expect(await mintingLimitedAmountContract.maxAmount()).to.be.equal(10)
      expect(await wnftContract.amount()).to.be.equal(1)
    })

    it("Changing minting contract", async function () {
      const newMintingContract = await Minting.deploy()
      await newMintingContract.deployed()

      const currentMintingContractAddress = await wnftContract.mintingContract()

      expect(currentMintingContractAddress).to.be.not.equal(newMintingContract.address)

      const setMintingContractTx = await wnftContract.setMintingContract(newMintingContract.address)
      await setMintingContractTx.wait()

      expect(await wnftContract.mintingContract()).to.be.equal(newMintingContract.address)
    })

    it("Fail if changing minting contract by no owner", async function () {
      const testNotOwnerAddress = addr1

      const newMintingContract = await Minting.deploy()
      await newMintingContract.deployed()

      const currentMintingContractAddress = await wnftContract.mintingContract()
      // validate 2 contracts not same owner
      expect(currentMintingContractAddress).to.be.not.equal(newMintingContract.address)
      // validate contract owner is not the address sent
      expect(await wnftContract.owner()).to.be.not.equal(testNotOwnerAddress.address)

      await expect(
        wnftContract.connect(testNotOwnerAddress).setMintingContract(newMintingContract.address),
      ).to.be.revertedWith("Ownable: caller is not the owner")

      expect(await wnftContract.mintingContract()).to.be.equal(currentMintingContractAddress)
    })

    it("Allow minting with token uri", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2.address
      const testTokenURI = "test://test.ckkjkj"

      const mintTx = await wnftContract.mintWithTokenURI(testMintTo, testTokenId, testTokenURI, { value: priceInWie })
      await mintTx.wait()

      // minting done and new owner
      expect(await wnftContract.ownerOf(testTokenId)).to.be.equal(testMintTo)

      // token uri is set after minting
      expect(await wnftContract.tokenURI(testTokenId)).to.be.equal(testTokenURI)
    })

    it("CanMint function is working", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2.address

      expect(await wnftContract.canMint(testMintTo, testTokenId)).to.equal(true)

      const mintTx = await wnftContract.mint(testMintTo, testTokenId, { value: priceInWie })
      await mintTx.wait()

      expect(await wnftContract.canMint(testMintTo, testTokenId)).to.equal(false)
    })
  })

  describe("ContractSwitch", async function () {
    it("Allow contract switched if owner", async function () {
      const testNewContractAddress = ethers.utils.getAddress("0xf6305c19e814d2a75429fd637d01f7ee0e77d615")
      const setContractSwitchedTx = await wnftContract.setContractSwitched(testNewContractAddress)
      await setContractSwitchedTx.wait()

      expect(await wnftContract.contractSwitched()).to.equal(testNewContractAddress)
    })

    it("Should fail Allow contract switched if not owner", async function () {
      const currentContractSwitchAddress = await wnftContract.contractSwitched()

      const testNewContractAddress = ethers.utils.getAddress("0xf6305c19e814d2a75429fd637d01f7ee0e77d615")

      await TestUtils.ContractsNotSame(currentContractSwitchAddress, testNewContractAddress)

      await expect(wnftContract.connect(addr1).setContractSwitched(testNewContractAddress)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      )

      expect(await wnftContract.contractSwitched()).to.equal(currentContractSwitchAddress)
    })
  })

  describe("Tokens", async function () {
    it("Should be able to change tokenUri if owner", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2
      const testTokenURI = "test://test.ckkjkj"

      const mintTx = await wnftContract.mint(testMintTo.address, testTokenId, { value: priceInWie })
      await mintTx.wait()

      expect(await wnftContract.ownerOf(testTokenId)).to.be.equal(testMintTo.address)

      const setTokenURITx = await wnftContract.connect(testMintTo).setTokenURI(testTokenId, testTokenURI)
      await setTokenURITx.wait()

      expect(await wnftContract.tokenURI(testTokenId)).to.be.equal(testTokenURI)
    })

    it("Change an existing set IPFS contenthash of a WNFT token ", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2
      const testTokenURI = "test://test.ckkjkj"

      const testNotTokenOwner = addr1

      // minting token
      const mintTx = await wnftContract.mint(testMintTo.address, testTokenId, { value: priceInWie })
      await mintTx.wait()

      const initialTokenURI = await wnftContract.tokenURI(testTokenId)

      console.log("initialTokenURI", initialTokenURI)

      await expect(wnftContract.connect(testNotTokenOwner).setTokenURI(testTokenId, testTokenURI)).to.be.revertedWith(
        "WNFT: Owner only",
      )

      expect(await wnftContract.tokenURI(testTokenId)).to.be.equal(initialTokenURI)
    })

    it("Test error messages for set, read and change IPFS contenthash", async function () {
      const testNoneExistingTokenId = ethers.BigNumber.from("5552")
      const testTokenURI = "test://test.ckkjkj"

      await expect(wnftContract.setTokenURI(testNoneExistingTokenId, testTokenURI)).to.be.revertedWith(
        "ERC721: operator query for nonexistent token",
      )
    })

    it("Fail is query from none existing token", async function () {
      const testNoneExistingTokenId = ethers.BigNumber.from("5552")

      await expect(wnftContract.tokenURI(testNoneExistingTokenId)).to.be.revertedWith(
        "ERC721URIStorage: URI query for nonexistent token",
      )
    })
  })

  describe("Exchange", function () {
    it("Transfer WNFT tokens", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2

      const mintTx = await wnftContract.mint(testMintTo.address, testTokenId, { value: priceInWie })
      await mintTx.wait()

      const setTokenURITx = await wnftContract.connect(testMintTo).transferFrom(testMintTo.address, addr1.address, testTokenId)
      await setTokenURITx.wait()

      expect(await wnftContract.ownerOf(testTokenId)).to.be.equal(addr1.address)
    })
  })

  describe("ENS", function () {
    it("Set ENS node", async function () {
      const newEnsNodeId = "0x18b7e70c27aa3a4fd844e78c153b49a03233f5588351c1fc26cff3486469b378"

      await wnftContract.setENSNodeID(newEnsNodeId)

      expect(await wnftContract.ENSNodeID()).to.be.equal(newEnsNodeId)
    })
  })


  describe("Collection onchain metadata", async function () {
    it("Add collection onchain metadata field", async function () {
      const testFieldName ="my field 1"

      const addCollectionOnchainMetadataFieldTx = await wnftContract.addCollectionOnchainMetadataField(testFieldName)
      await addCollectionOnchainMetadataFieldTx.wait()

    })

    it("Set collection onchain metadata value", async function () {
      const testFieldName ="my field 1"
      const testFieldValue ="i am value"

      const addCollectionOnchainMetadataFieldTx = await wnftContract.addCollectionOnchainMetadataField(testFieldName)
      await addCollectionOnchainMetadataFieldTx.wait()

      const setCollectionOnchainMetadataTx = await wnftContract.setCollectionOnchainMetadata(testFieldName, testFieldValue)
      await setCollectionOnchainMetadataTx.wait()

    })
  })

  
  describe("Token onchain metadata", async function () {
    beforeEach(async function () {
      onchainTokenDataStringContract = await onchainTokenDataString.deploy(wnftContract.address)
    })

    it("Add field", async function () {
      await wnftContract.addTokenOnchainMetadataField("0x661f2816", onchainTokenDataStringContract.address, "test")
    })

    it("Set field value", async function () {
      const testTokenId = ethers.BigNumber.from("42")
      const testMintTo = addr2
      const mintTx = await wnftContract.mint(testMintTo.address, testTokenId, { value: priceInWie })
      await mintTx.wait()

      await wnftContract.addTokenOnchainMetadataField("0x661f2816", onchainTokenDataStringContract.address, "test")
      const setTokenOnchainMetadata = await wnftContract
        .connect(testMintTo)
        .setTokenOnchainMetadataString(testTokenId, "test", "somevalue")
      await setTokenOnchainMetadata.wait()
    })
  })
})
