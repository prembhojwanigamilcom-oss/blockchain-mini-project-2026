# VERITAS: Blockchain-Based Academic Marksheet Verification System

> **A decentralized, zero-trust academic verification platform backed by the Ethereum blockchain and FIPS PUB 180-4 SHA-256 cryptographic proofs.**

**Project Team:** Jiya Sharma & Prem Kumar (Academic Session 2022–2026)  
**Subject:** Blockchain Application Development (Major Project)  

---

## 1. Executive Summary

Traditional paper marksheets and digital PDF transcripts are vulnerable to grade tampering, unauthorized signature forgery, and duplicate certificate manipulation. 

**VERITAS** solves this by establishing a **dual-access decentralized architecture**:
1. **University Administrator (Write Mode):** Uploads student marksheets in PDF format, computes a 32-byte cryptographic SHA-256 digest directly in browser memory, and permanently registers the hash on Ethereum using MetaMask.
2. **Public Verifier (Zero-Trust Read Mode):** Students, employers, and foreign universities can upload any marksheet PDF to the public portal. The document is hashed on the client and verified against the smart contract state via `eth_call` in milliseconds with **zero gas costs and no cryptocurrency wallet needed**.

---

## 2. Institutional Design Aesthetic (Swiss Editorial)

The UI was art-directed as a premium institutional product, avoiding generic AI gradients or neon colors:

- **Warm Ivory (`#F3F0E8`):** Background canvas simulating archival paper.
- **Deep Forest Charcoal (`#182C2A`):** Authoritative academic typography and primary buttons.
- **Muted Stone (`#D8D2C5`):** 1px hairline rules, borders, and structured ledger tables.
- **Antique Gold (`#9C815D`):** Verification stamps, institutional seal accents, and badges.
- **Soft White (`#FAF9F5`):** Elevated card surfaces and certificate views.
- **Typography:** *Playfair Display* & *Cinzel* for headings and seal accents; *Inter* for clean body; *JetBrains Mono* for hashes and addresses.

---

## 3. Technology Stack

- **Smart Contract:** Solidity `0.8.20` (`contracts/MarksheetVerification.sol`)
- **Ethereum Framework:** Hardhat, ethers.js v6
- **Wallet Provider:** MetaMask (Browser Extension for University Administrator)
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **Cryptography:** Native browser Web Crypto API (`crypto.subtle.digest("SHA-256", buffer)`)

---

## 4. Smart Contract Architecture

The core contract `MarksheetVerification.sol` implements strict security invariants:

```solidity
struct MarksheetRecord {
    bytes32 documentHash;      // 32-byte SHA-256 cryptographic fingerprint
    string studentRollNumber;  // Academic registration ID
    string studentName;        // Student full name
    string course;             // Degree / Branch
    string academicYear;       // Academic session (e.g. 2022-2026)
    uint256 issueTimestamp;    // Block timestamp of issuance
    address issuer;            // Authorized university administrator wallet
    Status status;             // Valid, Revoked, or Unregistered
    string revocationReason;   // Documented rationale for revocation
    uint256 revokedTimestamp;  // Timestamp of revocation
}
```

### Invariants Enforced:
1. **Duplicate Prevention:** Overwriting an existing document hash is strictly prohibited.
2. **Access Control:** Only `universityAdmin` can register or revoke marksheets.
3. **Public View:** `verifyMarksheet(bytes32)` is an open `view` function accessible to anyone worldwide.
4. **Permanent Audit Trail:** State transitions emit `MarksheetRegistered` and `MarksheetRevoked` event logs on the EVM.

---

## 5. Quick Start & Demonstration Guide

### Prerequisites
- Node.js (v18+)
- MetaMask Browser Extension

### Step 1: Start the Local Ethereum Blockchain
In terminal 1:
```bash
npx hardhat node
```
*Starts local JSON-RPC node on `http://127.0.0.1:8545/` (Chain ID `31337`).*

### Step 2: Deploy the Smart Contract
In terminal 2:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```
*Deploys `MarksheetVerification.sol` and automatically updates `src/config/contracts.ts`.*

### Step 3: Seed Sample Marksheets for College Viva
```bash
npx hardhat run scripts/seed-sample-records.ts --network localhost
```
*Populates the blockchain with 3 demo records:*
1. **Jiya Sharma** (`VER-2022-CS-042`) — Status: **AUTHENTIC & VALID**
2. **Prem Kumar** (`VER-2022-CS-088`) — Status: **AUTHENTIC & VALID**
3. **Aarav Patel** (`VER-2022-EE-015`) — Status: **OFFICIALLY REVOKED**

### Step 4: Start the Frontend Application
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 6. How to Connect MetaMask to Localhost

1. Open MetaMask and click the **Network Selector** (top-left).
2. Click **Add Network** → **Add a network manually**:
   - **Network Name:** Hardhat Localhost
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Import the University Administrator account:
   - Click Account profile icon → **Add account or hardware wallet** → **Import account**.
   - Paste Hardhat Account #0 private key:
     ```text
     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
     ```
4. Click **"Connect MetaMask"** on VERITAS. The dashboard will display **"Administrator Verified"**.

---

## 7. College Presentation & Viva Walkthrough

To demonstrate the full project during your college evaluation:

1. **Demonstrate Public Verification (Authentic Case):**
   - Go to **Public Verification**.
   - Click *Enter SHA-256 Digest Manually*.
   - Paste Jiya Sharma's hash: `0x7d9ef47b96537f39e3cd0bfd63d87feef4e729d4963a79806c1dbc52a913c7e7`.
   - Click *Query Blockchain*.
   - Show the museum-grade **Certificate of Academic Verification** with the golden badge, student metadata, issuer wallet, and print option.

2. **Demonstrate Tampering Detection:**
   - Change just one digit in the hash (e.g. change the last character to `8`).
   - Query again.
   - Show how VERITAS immediately flags the document as **UNREGISTERED / POTENTIALLY TAMPERED**.

3. **Demonstrate On-Chain Revocation:**
   - Query Aarav Patel's hash: `0x5836821192ac10dfb438e541a50ee5beb3b33a4c62990ecbe3f1ca1eecee603f`.
   - Show the **OFFICIALLY REVOKED RECORD** status along with the recorded administrative reason.

4. **Demonstrate Issuing a Marksheet with MetaMask:**
   - Connect MetaMask with the administrator account.
   - Go to **Issue Marksheet**.
   - Upload any PDF marksheet.
   - Enter student details and click **Register on Ethereum Blockchain**.
   - Show MetaMask prompt for transaction approval.
   - Show the transaction receipt with the confirmed block number and transaction hash.

---

## 8. Unit Testing & Verification Coverage

Run the automated test suite:
```bash
npx hardhat test
```
All **12 tests pass (100% coverage)** verifying access authorization, zero-hash rejection, duplicate prevention, public verification, revocation guards, and admin transfers.
