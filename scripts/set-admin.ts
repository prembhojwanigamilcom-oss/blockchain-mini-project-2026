import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const userAddress = "0xfe44b2d68200799c85465ed9a373da6ce59d38f6";

  console.log("---------------------------------------------------------");
  console.log(`Setting University Admin to User's MetaMask Wallet: ${userAddress}`);
  console.log("---------------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log(`Current Admin (Deployer): ${deployer.address}`);

  // 1. Read deployed contract address
  const configPath = path.join(__dirname, "../src/config/contracts.ts");
  const configText = fs.readFileSync(configPath, "utf-8");
  const match = configText.match(/export const DEFAULT_CONTRACT_ADDRESS = "(0x[0-9a-fA-F]+)";/);
  const contractAddress = match ? match[1] : "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const MarksheetVerificationFactory = await ethers.getContractFactory("MarksheetVerification");
  const contract = MarksheetVerificationFactory.attach(contractAddress) as any;

  // 2. Fund user's wallet with 50 ETH on the local node so they never run out of gas!
  console.log(`Funding user wallet with 50 ETH for local transactions...`);
  const fundTx = await deployer.sendTransaction({
    to: userAddress,
    value: ethers.parseEther("50.0"),
  });
  await fundTx.wait();
  console.log(`Funded successfully!`);

  // 3. Transfer Admin authority to user's wallet
  console.log(`Transferring smart contract admin rights to: ${userAddress}...`);
  const transferTx = await contract.transferAdmin(userAddress);
  await transferTx.wait();

  const newAdmin = await contract.universityAdmin();
  console.log(`\n>>> Success! Smart Contract University Admin is now: ${newAdmin}`);
  console.log("---------------------------------------------------------");
}

main().catch((err) => {
  console.error("Error setting admin:", err);
  process.exitCode = 1;
});
