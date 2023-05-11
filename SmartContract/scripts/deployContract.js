const hre = require("hardhat");

async function main() {
  // Get the ContractFactory and Signer objects from the hardhat runtime environment
  const Blockchain = await hre.ethers.getContractFactory("Blockchain");
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying the contract with the account:",
    deployer.address
  );

  // Deploy the contract
  const blockchain = await Blockchain.deploy();

  await blockchain.deployed();

  console.log("Contract address:", blockchain.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

