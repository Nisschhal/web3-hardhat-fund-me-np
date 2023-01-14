// // import externally

// const { run } = require("hardhat");

// // verify function args: contractAddress, args: priceFeedAddress

// async function verify(contractAddress, args) {
//   console.log("Verifying Contract.....");
//   try {
//     await run("verify:verify", {
//       address: contractAddress,
//       constructorArguments: args,
//     });
//   } catch (e) {
//     if (e.message.toLowerCase().includes("already verified")) {
//       console.log("Already Verified!!");
//     } else {
//       console.log(e.message);
//     }
//   }
// }

// module.exports = { verify };

const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

module.exports = { verify };
