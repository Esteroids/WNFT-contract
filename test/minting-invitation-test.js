const { expect } = require("chai")
const { ethers, network, waffle } = require("hardhat")
const skipIf = require("mocha-skip-if")
const { deployMockContract } = waffle

const { TestUtils } = require("../test-utils/test-utils")
const { developmentChains } = require("../helper-hardhat-config")

const PublicResolver = require("../artifacts/@ensdomains/resolver/contracts/Resolver.sol/Resolver.json")
const ENSRegistry = require("../artifacts/@ensdomains/ens/contracts/ENS.sol/ENS.json")

skipIf.if(!developmentChains.includes(network.name)).describe("MintingInvitationBased", function () {

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
    let inviteTokenContract
    let mintingContract
    let WNFT

    let owner, addr1, addr2
    let MockV3Aggregator
    let mockPriceFeed

    before(async function () {
        // runs once before the first test in this block

        ;[owner, addr1, addr2] = await ethers.getSigners()
        
       

        
        publicResolverContract = await deployMockContract(owner, PublicResolver.abi)
        ensRegistryContract = await deployMockContract(owner, ENSRegistry.abi)

    
        MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator")
        mockPriceFeed = await MockV3Aggregator.deploy(priceDecimals, price)
        WNFT = await ethers.getContractFactory("WNFT")

        
    })
    
    beforeEach(async function () {

        const inviteTokenFactory = await ethers.getContractFactory("InviteToken")
        inviteTokenContract = await inviteTokenFactory.deploy("Test InviteToken", "IVT", 100)
        await inviteTokenContract.deployed()


        mintingFactory = await ethers.getContractFactory("MintingInvitationBased")
        mintingContract = await mintingFactory.deploy(inviteTokenContract.address)
        await mintingContract.deployed()

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
    
    describe("Minting", async function () {
        it("Allow minting", async function () {
          const testTokenId = ethers.BigNumber.from("42")
          const testMintTo = addr2.address

          const transferTx = await inviteTokenContract.transfer(addr2.address, 1)
          await transferTx.wait()

         
          const mintTx = await wnftContract.connect(addr2).mint(testMintTo, testTokenId, { value: priceInWie })
          await mintTx.wait()
    
          expect(await wnftContract.ownerOf(testTokenId)).to.be.equal(testMintTo)
        })

    
        it("Allow minting with token uri", async function () {
          const testTokenId = ethers.BigNumber.from("43")
          const testMintTo = addr2.address
          const testTokenURI = "test://test.ckkjkj"
          const transferTx = await inviteTokenContract.transfer(addr2.address, 1)
          await transferTx.wait()

    
          const mintTx = await wnftContract.connect(addr2).mintWithTokenURI(testMintTo, testTokenId, testTokenURI, { value: priceInWie })
          await mintTx.wait()
    
          // minting done and new owner
          expect(await wnftContract.ownerOf(testTokenId)).to.be.equal(testMintTo)
    
          // token uri is set after minting
          expect(await wnftContract.tokenURI(testTokenId)).to.be.equal(testTokenURI)
        })
    
        it("CanMint function is working", async function () {
          const testTokenId = ethers.BigNumber.from("44")
          const testMintTo = addr2.address

          const transferTx = await inviteTokenContract.transfer(addr2.address, 1)
          await transferTx.wait()
    
          expect(await wnftContract.connect(addr2).canMint(testMintTo, testTokenId)).to.equal(true)
    
          const mintTx = await wnftContract.connect(addr2).mint(testMintTo, testTokenId, { value: priceInWie })
          await mintTx.wait()
    
        })

        it("AfterMint is burning the invite", async function () {
            const testTokenId = ethers.BigNumber.from("44")
            const testMintTo = addr2.address
  
            const transferTx = await inviteTokenContract.transfer(addr2.address, 1)
            await transferTx.wait()
      
            expect(await wnftContract.connect(addr2).canMint(testMintTo, testTokenId)).to.equal(true)
      
            const mintTx = await wnftContract.connect(addr2).mint(testMintTo, testTokenId, { value: priceInWie })
            await mintTx.wait()

            expect( await inviteTokenContract.balanceOf(addr2.address)).to.equal(0);

            expect(await wnftContract.connect(addr2).canMint(testMintTo, testTokenId)).to.equal(false)
      
        })


        it("No mint without invitation token", async function () {
            const testTokenId = ethers.BigNumber.from("44")
            const testMintTo = addr1.address
  
            expect(await wnftContract.connect(addr1).canMint(testMintTo, testTokenId)).to.equal(false)
      
            await expect(
                 wnftContract.connect(addr1).mint(testMintTo, testTokenId, { value: priceInWie })
               ).to.be.revertedWith("WNFT: Not allowed")

      
        })
    })
})
