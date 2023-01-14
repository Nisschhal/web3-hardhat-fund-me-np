// import externally

const { network } = require("hardhat");

// import internally
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

// create a deploy anonymous function and exports
// 1. required: deploy, log (deployments)
// 2. deployer(getNamedAccounts)
// check if the network is local or testnet
// if the network is local then deploy("mockv3aggregator")
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  if (developmentChains.includes(network.name)) {
    console.log("Local network detected!, Deploying Mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    console.log("Mock Deployed!!");
    console.log("---------------------------------");
  }
};

// add tags if only mock is to be deployed
module.exports.tags = ["all", "mocks"];
