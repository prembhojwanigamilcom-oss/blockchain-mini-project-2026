import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("----------------------------------------------------");
  console.log("VERITAS: Deploying MarksheetVerification Smart Contract...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account (University Admin): ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account Balance: ${ethers.formatEther(balance)} ETH`);

  const MarksheetVerificationFactory = await ethers.getContractFactory("MarksheetVerification");
  const marksheetVerification = await MarksheetVerificationFactory.deploy();
  await marksheetVerification.waitForDeployment();

  const contractAddress = await marksheetVerification.getAddress();
  console.log(`\n>>> MarksheetVerification successfully deployed to: ${contractAddress}`);

  // Retrieve ABI from Hardhat artifacts
  const artifactPath = path.join(__dirname, "../artifacts/contracts/MarksheetVerification.sol/MarksheetVerification.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  // Ensure frontend config directory exists
  const configDir = path.join(__dirname, "../src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Update contracts.ts
  const configPath = path.join(configDir, "contracts.ts");
  let contractsContent = fs.readFileSync(configPath, "utf-8");
  contractsContent = contractsContent.replace(
    /export const DEFAULT_CONTRACT_ADDRESS = "0x[0-9a-fA-F]+";/,
    `export const DEFAULT_CONTRACT_ADDRESS = "${contractAddress}";`
  );
  fs.writeFileSync(configPath, contractsContent, "utf-8");

  console.log(">>> Frontend config updated with new contract address: " + contractAddress);
  console.log("----------------------------------------------------\n");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
