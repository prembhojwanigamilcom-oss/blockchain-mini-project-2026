// VERITAS Smart Contract Configuration
// Automatically configured for Local Hardhat Node and Sepolia Testnet

export const DEFAULT_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Default Hardhat 1st deployed contract address

export const NETWORKS = {
  HARDHAT: {
    chainId: 31337,
    hexChainId: "0x7a69",
    name: "Hardhat Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    currency: "ETH",
  },
  SEPOLIA: {
    chainId: 11155111,
    hexChainId: "0xaa36a7",
    name: "Sepolia Testnet",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    currency: "ETH",
    blockExplorer: "https://sepolia.etherscan.io",
  },
};

export const CONTRACT_CONFIG = {
  address: (import.meta.env.VITE_CONTRACT_ADDRESS as string) || DEFAULT_CONTRACT_ADDRESS,
  defaultNetwork: NETWORKS.HARDHAT,
};

// ABI for MarksheetVerification contract
export const MARKSHEET_VERIFICATION_ABI = [
  "function universityAdmin() external view returns (address)",
  "function totalIssued() external view returns (uint256)",
  "function totalRevoked() external view returns (uint256)",
  "function getRegisteredCount() external view returns (uint256)",
  "function getAllRegisteredHashes() external view returns (bytes32[])",
  "function registerMarksheet(bytes32 _documentHash, string calldata _studentRollNumber, string calldata _studentName, string calldata _course, string calldata _academicYear) external",
  "function verifyMarksheet(bytes32 _documentHash) external view returns (bool isAuthentic, uint8 status, string memory studentRollNumber, string memory studentName, string memory course, string memory academicYear, uint256 issueTimestamp, address issuer, string memory revocationReason, uint256 revokedTimestamp)",
  "function revokeMarksheet(bytes32 _documentHash, string calldata _reason) external",
  "function getMarksheet(bytes32 _documentHash) external view returns (tuple(bytes32 documentHash, string studentRollNumber, string studentName, string course, string academicYear, uint256 issueTimestamp, address issuer, uint8 status, string revocationReason, uint256 revokedTimestamp))",
  "function transferAdmin(address _newAdmin) external",
  "event MarksheetRegistered(bytes32 indexed documentHash, string studentRollNumber, string studentName, address indexed issuer, uint256 timestamp)",
  "event MarksheetRevoked(bytes32 indexed documentHash, string reason, address indexed revokedBy, uint256 timestamp)",
  "event AdminTransferred(address indexed previousAdmin, address indexed newAdmin)"
];
