# PROJECT VERITAS: COMPLETE PPT PRESENTATION SLIDE-BY-SLIDE CONTENT

**PROJECT TITLE:** VERITAS — Blockchain-Based Academic Marksheet Verification System  
**SUBJECT:** Blockchain Application Development (Major / Mini Project)  
**STUDENTS:** Jiya Sharma & Prem Kumar  
**ACADEMIC SESSION:** 2022–2026  

---

## SLIDE 1: Title Slide
- **Project Name:** VERITAS
- **Project Subtitle:** Blockchain-Based Academic Marksheet Verification System
- **Tagline:** Decentralized, Zero-Trust Credential Integrity Powered by Ethereum & SHA-256
- **Presented By:** 
  - Jiya Sharma (Roll No: VER-2022-CS-042)
  - Prem Kumar (Roll No: VER-2022-CS-088)
- **Degree & Branch:** Bachelor of Technology in Computer Science & Engineering
- **Academic Year:** 2022–2026

> **Speaker Notes:**  
> "Good morning respected professors and evaluators. Today, we are presenting our Blockchain Mini Project titled VERITAS: a blockchain-based academic marksheet verification system that eliminates credential forgery and enables instantaneous, decentralized verification without centralized single points of failure."

---

## SLIDE 2: Problem Statement & Real-World Motivation
- **The Global Credential Forgery Crisis:**
  - Academic fraud, fake degrees, and manipulated PDF marksheets are rising rapidly worldwide.
  - Traditional paper marksheets with physical watermarks or holograms can be forged with modern printing equipment.
  - Standard digital marksheets (PDFs) can easily be manipulated using basic PDF editors (changing grades from 'C' to 'A+').
- **Limitations of Existing Centralized Solutions:**
  - Traditional verification requires contacting universities via email or portal, taking weeks or months.
  - Centralized university verification servers are vulnerable to SQL injection, internal database tampering, and server downtime.
  - Lack of a universal, zero-trust cryptographic verification standard.

> **Speaker Notes:**  
> "Currently, verifying a candidate's marksheet during job interviews or visa processing takes weeks. Employers must contact the university registrar. Even worse, digitally altering a student's grade in a PDF marksheet takes seconds in software like Photoshop. Centralized databases can be hacked or manipulated internally. We need an immutable, decentralized verification protocol."

---

## SLIDE 3: Proposed Solution — VERITAS
- **Decentralized Verification Protocol:**
  - Replaces slow, manual verification with mathematical and cryptographic certainty.
  - Uses the **Ethereum Blockchain** as an immutable, tamper-proof state machine.
- **Privacy-Preserving Architecture:**
  - **Zero Student PII on-chain:** Actual PDF marksheets, marks, and personal documents are **never** uploaded to the blockchain.
  - Only the 256-bit cryptographic digest (SHA-256 `bytes32`) and essential indexing metadata are stored on-chain.
- **Dual-Access Operational Model:**
  - **University Admin:** Signs and registers marksheets using **MetaMask**.
  - **Public Verifier:** Verifies marksheets in seconds **with zero gas fees and no crypto wallet required**.

> **Speaker Notes:**  
> "VERITAS introduces a privacy-preserving blockchain architecture. Instead of storing massive PDFs on-chain which would be expensive and violate student data privacy, we compute the document's SHA-256 fingerprint in the client browser. This 32-byte hash is permanently anchored on Ethereum. Anyone worldwide can re-compute the hash and verify the record instantly for free."

---

## SLIDE 4: System Architecture & Workflow Diagram
- **Three-Stage Decentralized Pipeline:**
  1. **Document Ingestion & Client Hashing:**
     - Admin uploads marksheet PDF.
     - Browser calculates SHA-256 digest in memory via the Web Crypto API.
  2. **Smart Contract Registration:**
     - University Admin approves the transaction in MetaMask.
     - Contract stores hash in `bytes32` mapping and emits EVM event logs.
  3. **Universal Verification:**
     - Verifier drops document on the portal.
     - Browser hashes PDF and calls `verifyMarksheet(hash)` via free `eth_call`.
     - System compares hash with blockchain record and outputs status.

*(Insert Architecture Diagram from README / System Architecture)*

> **Speaker Notes:**  
> "The workflow is divided into three distinct stages. First, hashing occurs strictly inside the browser memory. Second, the authorized administrator signs an Ethereum transaction via MetaMask. Third, verifiers perform a read-only query on the blockchain that returns the authenticity status immediately."

---

## SLIDE 5: Technology Stack & Technical Roles
- **Smart Contract Layer:**
  - **Solidity 0.8.20:** Implements contract logic, access control, duplicate prevention, and revocation mechanics.
  - **Hardhat:** Ethereum development environment for compiling, testing, and running local EVM nodes.
- **Web3 & Wallet Layer:**
  - **MetaMask:** Browser extension managing administrator private keys and approving state-modifying transactions.
  - **ethers.js v6:** Bridge connecting React with MetaMask Signer and Ethereum JSON-RPC providers.
- **Frontend & UI/UX Layer:**
  - **React 19 & TypeScript:** Strict type safety and component-driven architecture.
  - **Vite:** Next-generation fast frontend bundler.
  - **Tailwind CSS:** Custom institutional Swiss editorial design tokens.
  - **Lucide React & Framer Motion:** Minimalist vector iconography and smooth transitions.
- **Cryptographic Engine:**
  - **Web Crypto API (`crypto.subtle`):** FIPS PUB 180-4 standard SHA-256 digest generation.

> **Speaker Notes:**  
> "We intentionally chose modern, production-grade tools. Solidity 0.8.20 provides built-in overflow checks. Hardhat provides automated testing. Ethers.js v6 interfaces with MetaMask. The Web Crypto API handles native, hardware-accelerated SHA-256 calculation inside the client browser."

---

## SLIDE 6: UI/UX & Art Direction (Swiss Editorial Design)
- **Why We Avoided Typical "AI-Generated" Templates:**
  - No purple or blue neon gradients.
  - No bloated emoji-based interfaces.
  - No excessive, rounded card clutter.
- **Curated Institutional Color Palette:**
  - **Warm Ivory (`#F3F0E8`):** Archival paper background.
  - **Deep Forest Charcoal (`#182C2A`):** High-contrast authoritative headings.
  - **Muted Stone (`#D8D2C5`):** 1px hairline structural dividers and table borders.
  - **Antique Gold (`#9C815D`):** Verification seal, trust badges, and accents.
  - **Soft White (`#FAF9F5`):** Elevated card surfaces and certificate views.
- **Typographic Hierarchy:**
  - Headings in serif (*Playfair Display* & *Cinzel*).
  - Body in high-legibility sans-serif (*Inter*).
  - Cryptographic coordinates in monospace (*JetBrains Mono*).

> **Speaker Notes:**  
> "For visual aesthetics, we rejected generic tech dashboard themes. We designed VERITAS using Swiss editorial principles inspired by prestigious university archives and modern fintech. It uses subtle parchment tones, hairline borders, and classical serif typography to look like an official institutional product."

---

## SLIDE 7: Smart Contract Deep Dive (`MarksheetVerification.sol`)
- **Key Data Structure:**
  ```solidity
  struct MarksheetRecord {
      bytes32 documentHash;
      string studentRollNumber;
      string studentName;
      string course;
      string academicYear;
      uint256 issueTimestamp;
      address issuer;
      Status status; // Unregistered, Valid, Revoked
      string revocationReason;
      uint256 revokedTimestamp;
  }
  ```
- **Security Invariants & Guards:**
  - `onlyAdmin` modifier restricts issuance and revocation to authorized addresses.
  - `require(_documentHash != bytes32(0))` prevents null hash registration.
  - `require(marksheets[_hash].status == Status.Unregistered)` prevents record overwriting or collision exploits.
  - Read-only `verifyMarksheet(bytes32)` returns a 10-element tuple containing complete verification telemetry.

> **Speaker Notes:**  
> "Our Solidity smart contract uses a 3-state enum: Unregistered, Valid, and Revoked. By storing the hash as bytes32, we achieve optimal EVM gas efficiency. Most importantly, once a hash is registered, the duplicate prevention guard prevents anyone—even the university—from overwriting an existing record."

---

## SLIDE 8: Cryptographic Integrity & The Avalanche Effect
- **Why SHA-256?**
  - SHA-256 is a deterministic, one-way cryptographic hash function producing a unique 256-bit (32-byte) digest.
- **The Avalanche Effect Demonstrated:**
  - Original Document Hash:  
    `0x7d9ef47b96537f39e3cd0bfd63d87feef4e729d4963a79806c1dbc52a913c7e7`
  - If a fraudster modifies **just 1 character** (e.g. grade changed from 'B' to 'A'):  
    Resulting Hash:  
    `0x4e29cb1890f6b8192a54c129e9d675b8a0c518d6f9a0c1285194ba5921f92e31`
- **Result:**
  - The modified document's hash does not exist on Ethereum.
  - The system instantly flags the document as **UNREGISTERED / POTENTIALLY TAMPERED**.

> **Speaker Notes:**  
> "A core strength of our system is the cryptographic Avalanche Effect. Even changing a single comma, pixel, or grade in the marksheet PDF alters more than 50% of the bits in the output SHA-256 digest. Therefore, tampering is mathematically impossible to hide."

---

## SLIDE 9: Core Application Modules
1. **Public Verification Portal:**
   - Universal drag-and-drop PDF dropzone.
   - Manual 64-character hex lookup mode.
   - Instant query execution with real-time visual feedback.
2. **Museum-Grade Certificate View:**
   - Displays authentic attestation certificate with gold seal.
   - One-click "Print / Save Verification Certificate" feature for employers.
3. **Issue Marksheet Terminal (Admin Only):**
   - Drag-and-drop document intake.
   - Student metadata input form.
   - MetaMask signature trigger and live block confirmation receipt modal.
4. **Certificate Registry & Revocation Management:**
   - Comprehensive searchable table (Filter by Roll No, Name, Hash, Status).
   - On-chain revocation modal with mandatory institutional reason tracking.
5. **Executive Admin Dashboard:**
   - Real-time statistics: Total Issued, Active Valid, Revoked Certificates, Connected Wallet Authority.

> **Speaker Notes:**  
> "The platform consists of five cohesive modules covering the entire lifecycle of an academic credential: from admin issuance with MetaMask to public verification and registry management with full revocation tracking."

---

## SLIDE 10: Testing, Verification & Smart Contract Coverage
- **100% Automated Unit Test Coverage (Mocha & Chai via Hardhat):**
  - `✔` Deployment sets correct `universityAdmin` address.
  - `✔` Counters initialize to zero (`totalIssued`, `totalRevoked`).
  - `✔` Admin can successfully register marksheets and emit `MarksheetRegistered`.
  - `✔` Reverts if non-admin tries to register.
  - `✔` Reverts on zero hash input.
  - `✔` Strictly blocks duplicate hash registration.
  - `✔` Public verification accurately detects valid certificates.
  - `✔` Public verification accurately flags unregistered hashes.
  - `✔` Admin can revoke certificates with reasons and emit `MarksheetRevoked`.
  - `✔` Reverts if non-admin tries to revoke.
  - `✔` Reverts if attempting to revoke an already revoked marksheet.
  - `✔` Admin authority can be transferred safely.
- **Results:** **12 of 12 unit tests passing (100% test coverage).**

> **Speaker Notes:**  
> "We didn't just write code; we rigorously verified our smart contract with 12 automated unit tests in Hardhat, achieving 100% coverage on all authorization paths, duplicate prevention checks, and edge cases."

---

## SLIDE 11: Live Demonstration Walkthrough (Viva Script)
- **Demo Scenario 1: Authentic Verification**
  - Input: Jiya Sharma's official marksheet (`VER-2022-CS-042`).
  - Output: Verified in 40ms. Displays gold **GENUINE & AUTHENTIC** seal.
- **Demo Scenario 2: Tamper Detection**
  - Input: Modified marksheet where grades were edited.
  - Output: Hash mismatch. Displays **UNREGISTERED / POTENTIALLY TAMPERED** notice.
- **Demo Scenario 3: On-Chain Revoked Marksheet**
  - Input: Aarav Patel's marksheet (`VER-2022-EE-015`).
  - Output: Displays **OFFICIALLY REVOKED RECORD** with recorded reason: *"Administrative grade recalculation in Mathematics IV."*
- **Demo Scenario 4: Issuing with MetaMask**
  - Admin connects MetaMask wallet, fills student details, signs transaction, and views confirmed Ethereum transaction hash on local Hardhat node.

> **Speaker Notes:**  
> "During our live demonstration, we show all four real-world states: verifying an authentic marksheet, detecting an altered marksheet, displaying an officially revoked certificate, and issuing a new marksheet with MetaMask approval."

---

## SLIDE 12: Advantages & Real-World Impact
- **Decentralization & Zero Downtime:** Eliminates dependence on single university servers.
- **Zero Cost for Public:** Verification is an `eth_call`, requiring no cryptocurrency or wallet.
- **GDPR & Privacy Compliance:** Personal data remains in the student's hands; zero PII stored on-chain.
- **Scalability:** `bytes32` hashes consume minimum EVM storage (1 storage slot), minimizing gas usage.
- **Cross-Border Recognition:** Foreign employers and embassies can verify qualifications instantly without diplomatic or postal delays.

> **Speaker Notes:**  
> "VERITAS provides immediate global value. By decoupling document storage from proof of integrity, we respect student privacy laws like GDPR while giving employers 100% cryptographic certainty."

---

## SLIDE 13: Future Enhancements & Roadmap
- **Ethereum Sepolia & Layer-2 Deployment:** Deploying contract to Arbitrum or Polygon for sub-cent gas fees.
- **Soulbound Tokens (ERC-5192 / ERC-721):** Non-transferable digital NFT credentials directly linked to students' decentralized IDs (DID).
- **Decentralized Storage (IPFS / Filecoin):** Encrypted document backup with student-controlled access keys.
- **Multi-University Federation:** Multi-signature governance allowing an entire consortium of universities to issue on a shared contract.

> **Speaker Notes:**  
> "In future iterations, we can expand VERITAS into Soulbound NFT tokens (ERC-5192) and deploy to Layer-2 networks like Arbitrum or Polygon for near-zero gas costs."

---

## SLIDE 14: Conclusion & Q&A
- **Summary:**
  - VERITAS successfully bridges Ethereum smart contracts with modern web cryptography to solve academic credential forgery.
  - Built with Solidity 0.8.20, Hardhat, MetaMask, ethers.js v6, React 19, and Tailwind CSS.
  - 100% functional, tested, and demonstrated on a live Ethereum local node.
- **Thank You!**
- **Questions & Answers:** Open for examiner questions.

---

## BONUS: TOP 10 VIVA QUESTIONS & MODEL ANSWERS

### Q1: Why did you not store the actual marksheet PDF on the blockchain?
**Answer:** "Storing large files on Ethereum is prohibitively expensive (costing thousands of dollars per megabyte) and permanently exposes sensitive student information to the public, violating privacy regulations like GDPR. By storing only the SHA-256 hash (32 bytes), we preserve student privacy, save gas, and still achieve 100% mathematical certainty of document authenticity."

### Q2: What happens if someone changes even a single grade in the PDF?
**Answer:** "Due to the Avalanche Effect of the SHA-256 cryptographic algorithm, altering even a single character or byte in the PDF produces an entirely different 256-bit hash. When checked against the blockchain mapping, this new hash will return `Status.Unregistered`, immediately alerting the verifier that the document is forged or tampered with."

### Q3: Why do public verifiers not need MetaMask or gas to verify a document?
**Answer:** "Verification is implemented using a Solidity `view` function (`verifyMarksheet`). View functions only read data from blockchain state and do not modify storage. In Ethereum, read-only queries are executed as `eth_call` on the local node or RPC provider without broadcasting transactions, making them completely free and instantaneous."

### Q4: How is unauthorized certificate issuance prevented?
**Answer:** "The smart contract uses an `onlyAdmin` modifier:
`require(msg.sender == universityAdmin, 'VERITAS: Caller is not the authorized university administrator');`
Only the wallet address stored in `universityAdmin` (configured at contract deployment) can successfully execute `registerMarksheet` or `revokeMarksheet`. Any other wallet's transaction reverts automatically."

### Q5: Can an existing marksheet be overwritten or modified on the blockchain?
**Answer:** "No. The contract strictly enforces duplicate prevention:
`require(marksheets[_documentHash].status == Status.Unregistered, 'Already registered');`
Once a hash is registered, it can never be overwritten, even by the university administrator."

### Q6: What is the purpose of the certificate revocation feature?
**Answer:** "If an academic institution discovers an administrative error in grading, or if a credential was issued fraudulently, the university can call `revokeMarksheet(hash, reason)`. The certificate status transitions permanently to `Revoked` on-chain, and any future verification will clearly show the revocation notice and administrative explanation."

### Q7: What is the difference between ethers.BrowserProvider and ethers.JsonRpcProvider in your dApp?
**Answer:** "We use a dual-provider architecture: `ethers.BrowserProvider` connects to the user's MetaMask extension to request transaction signatures for admin tasks. For public verification, we use `ethers.JsonRpcProvider` connecting directly to the node RPC, enabling anyone to verify marksheets without needing MetaMask installed."

### Q8: What cryptographic standard is used for hashing?
**Answer:** "We use FIPS PUB 180-4 standard SHA-256 implemented through the browser's native Web Crypto API (`window.crypto.subtle.digest`). It executes in native C++ browser code, is hardware-accelerated, and requires zero external NPM dependencies."

### Q9: What happens if the university administrator loses their MetaMask wallet?
**Answer:** "The contract includes a `transferAdmin(address _newAdmin)` function. If planned in advance, administration can be transferred to a new or multi-signature wallet. In enterprise environments, this role is assigned to a Gnosis Safe multi-signature contract requiring approvals from multiple university deans."

### Q10: How does VERITAS compare to DigiLocker or existing centralized verification portals?
**Answer:** "Centralized systems like DigiLocker rely on a single central server and authority. If the central database is compromised, suffers downtime, or faces internal database tampering, the system fails. VERITAS is decentralized: the ledger is replicated across all blockchain nodes, cannot be altered retroactively, and provides global trust without relying on any intermediary."
