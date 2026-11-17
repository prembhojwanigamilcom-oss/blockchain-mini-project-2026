import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("---------------------------------------------------------");
  console.log("VERITAS: Seeding Sample Marksheets for College Demo/Viva");
  console.log("---------------------------------------------------------");

  const [admin] = await ethers.getSigners();
  console.log(`Executing with University Admin: ${admin.address}`);

  // Read current contract address from contracts.ts
  const configPath = path.join(__dirname, "../src/config/contracts.ts");
  const configText = fs.readFileSync(configPath, "utf-8");
  const match = configText.match(/export const DEFAULT_CONTRACT_ADDRESS = "(0x[0-9a-fA-F]+)";/);
  const contractAddress = match ? match[1] : "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  console.log(`Target Contract Address: ${contractAddress}`);

  const MarksheetVerificationFactory = await ethers.getContractFactory("MarksheetVerification");
  const contract = MarksheetVerificationFactory.attach(contractAddress) as any;

  // Deterministic sample hashes
  const hash1 = ethers.keccak256(ethers.toUtf8Bytes("VERITAS_SAMPLE_MARKSHEET_JIYA_SHARMA_ROLL_VER2022CS042"));
  const hash2 = ethers.keccak256(ethers.toUtf8Bytes("VERITAS_SAMPLE_MARKSHEET_PREM_KUMAR_ROLL_VER2022CS088"));
  const hash3 = ethers.keccak256(ethers.toUtf8Bytes("VERITAS_SAMPLE_MARKSHEET_AARAV_PATEL_ROLL_VER2022EE015"));

  console.log("\n1. Registering Marksheet #1: Jiya Sharma (Valid Record)...");
  let tx1 = await contract.registerMarksheet(
    hash1,
    "VER-2022-CS-042",
    "Jiya Sharma",
    "B.Tech Computer Science & Engineering",
    "2022–2026"
  );
  await tx1.wait();
  console.log(`   Registered! Hash: ${hash1}`);

  console.log("\n2. Registering Marksheet #2: Prem Kumar (Valid Record)...");
  let tx2 = await contract.registerMarksheet(
    hash2,
    "VER-2022-CS-088",
    "Prem Kumar",
    "B.Tech Computer Science & Engineering",
    "2022–2026"
  );
  await tx2.wait();
  console.log(`   Registered! Hash: ${hash2}`);

  console.log("\n3. Registering Marksheet #3: Aarav Patel (Will be Revoked)...");
  let tx3 = await contract.registerMarksheet(
    hash3,
    "VER-2022-EE-015",
    "Aarav Patel",
    "B.Tech Electrical Engineering",
    "2022–2026"
  );
  await tx3.wait();
  console.log(`   Registered! Hash: ${hash3}`);

  console.log("\n4. Revoking Marksheet #3 to demonstrate on-chain revocation state...");
  let txRevoke = await contract.revokeMarksheet(
    hash3,
    "Administrative grade recalculation in Mathematics IV. Revised marksheet issued."
  );
  await txRevoke.wait();
  console.log(`   Revoked! Hash: ${hash3}`);

  console.log("\n---------------------------------------------------------");
  console.log("Seeding complete! You now have:");
  console.log(" - 2 Active Valid Marksheets (Jiya Sharma, Prem Kumar)");
  console.log(" - 1 Officially Revoked Marksheet (Aarav Patel)");
  console.log(" - Any other uploaded PDF will show as UNREGISTERED / TAMPERED");
  console.log("---------------------------------------------------------\n");
}

main().catch((error) => {
  console.error("Seeding error:", error);
  process.exitCode = 1;
});
