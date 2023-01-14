// import externally
const { network } = require("hardhat");
require("dotenv").config();

// import internally
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

/*
1. required variables: deployer(getNamedAccounts), deploy(deployments), chainId(network.config.chaingId)
2. check the network before deploy
    if network is local or hardhat then deploy mockv3aggregator and get it address
    else: get the ethUsdPriceFeedAddress from the chainId
3. deploy the contract, also check the network:
    if not local network then verify the contract
4. after deploy verify the contract
*/

//create a anonymous deploy function
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;
  // if the network is local: hardhat or localhost then get the mock v3 aggregator address
  // else get the ethUsdPriceFeed based on the network chainId
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  // arguments for the Fundme contract: priceFeedAddress
  const args = [ethUsdPriceFeedAddress];
  // deploying the contract with the constructor argument of priceFeedAddress

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify the fundme address which takes priceFeedAddress as argument
    log("Verifying Contract....");
    await verify(fundMe.address, args);
  }
  console.log(`Fund Me deployed!! at ${fundMe.address}`);
  log("---------------------------");
};

// tags if only fundeMe contract needs to be deployed
module.exports.tags = ["all", "fundme"];
