// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MarksheetVerification
 * @notice Core smart contract for VERITAS - Blockchain-Based Academic Marksheet Verification System.
 * @dev Stores SHA-256 cryptographic digests of issued academic marksheets on-chain.
 *      Preserves student privacy by avoiding on-chain storage of actual documents or grades.
 */
contract MarksheetVerification {

    // Status of an academic marksheet record
    enum Status {
        Unregistered, // 0: Has not been issued by the institution
        Valid,        // 1: Genuine, currently active and valid
        Revoked       // 2: Was issued, but later officially revoked by the institution
    }

    // Marksheet metadata struct stored on-chain
    struct MarksheetRecord {
        bytes32 documentHash;      // SHA-256 hash of the marksheet PDF
        string studentRollNumber;  // Unique student roll or registration number
        string studentName;        // Full name of the student
        string course;             // Course / Degree program
        string academicYear;       // Academic session / year (e.g., "2022-2026")
        uint256 issueTimestamp;    // Timestamp when marksheet was registered on-chain
        address issuer;            // Address of the university admin that issued it
        Status status;             // Current status: Valid or Revoked
        string revocationReason;   // Documented rationale for revocation (if revoked)
        uint256 revokedTimestamp;  // Timestamp of revocation (0 if active)
    }

    // Address of the authorized university administrator
    address public universityAdmin;

    // Mapping from document SHA-256 hash to MarksheetRecord
    mapping(bytes32 => MarksheetRecord) private marksheets;

    // Array of all registered document hashes for enumeration
    bytes32[] private registeredHashes;

    // Running analytics counters
    uint256 public totalIssued;
    uint256 public totalRevoked;

    // Events
    event MarksheetRegistered(
        bytes32 indexed documentHash,
        string studentRollNumber,
        string studentName,
        address indexed issuer,
        uint256 timestamp
    );

    event MarksheetRevoked(
        bytes32 indexed documentHash,
        string reason,
        address indexed revokedBy,
        uint256 timestamp
    );

    event AdminTransferred(
        address indexed previousAdmin,
        address indexed newAdmin
    );

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == universityAdmin, "VERITAS: Caller is not the authorized university administrator");
        _;
    }

    /**
     * @notice Initializes the contract setting the deployer as the initial university administrator.
     */
    constructor() {
        universityAdmin = msg.sender;
        emit AdminTransferred(address(0), msg.sender);
    }

    /**
     * @notice Registers a new marksheet on the blockchain.
     * @dev Only the authorized university administrator can execute this transaction.
     *      Duplicate hashes are strictly rejected to prevent record overwriting.
     * @param _documentHash The 32-byte SHA-256 digest of the original marksheet PDF.
     * @param _studentRollNumber Student roll or registration number.
     * @param _studentName Student full name.
     * @param _course Degree program / course name.
     * @param _academicYear Academic year or session.
     */
    function registerMarksheet(
        bytes32 _documentHash,
        string calldata _studentRollNumber,
        string calldata _studentName,
        string calldata _course,
        string calldata _academicYear
    ) external onlyAdmin {
        require(_documentHash != bytes32(0), "VERITAS: Document hash cannot be empty");
        require(bytes(_studentRollNumber).length > 0, "VERITAS: Roll number cannot be empty");
        require(bytes(_studentName).length > 0, "VERITAS: Student name cannot be empty");
        require(
            marksheets[_documentHash].status == Status.Unregistered,
            "VERITAS: Marksheet with this hash already registered. Overwriting is strictly prohibited."
        );

        MarksheetRecord memory newRecord = MarksheetRecord({
            documentHash: _documentHash,
            studentRollNumber: _studentRollNumber,
            studentName: _studentName,
            course: _course,
            academicYear: _academicYear,
            issueTimestamp: block.timestamp,
            issuer: msg.sender,
            status: Status.Valid,
            revocationReason: "",
            revokedTimestamp: 0
        });

        marksheets[_documentHash] = newRecord;
        registeredHashes.push(_documentHash);
        totalIssued += 1;

        emit MarksheetRegistered(
            _documentHash,
            _studentRollNumber,
            _studentName,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Publicly verifies any marksheet hash.
     * @dev Free read-only view function callable by any verifier without gas fees.
     * @param _documentHash The SHA-256 hash of the marksheet PDF to check.
     */
    function verifyMarksheet(bytes32 _documentHash)
        external
        view
        returns (
            bool isAuthentic,
            Status status,
            string memory studentRollNumber,
            string memory studentName,
            string memory course,
            string memory academicYear,
            uint256 issueTimestamp,
            address issuer,
            string memory revocationReason,
            uint256 revokedTimestamp
        )
    {
        MarksheetRecord storage record = marksheets[_documentHash];

        if (record.status == Status.Unregistered) {
            return (false, Status.Unregistered, "", "", "", "", 0, address(0), "", 0);
        }

        bool authentic = (record.status == Status.Valid);

        return (
            authentic,
            record.status,
            record.studentRollNumber,
            record.studentName,
            record.course,
            record.academicYear,
            record.issueTimestamp,
            record.issuer,
            record.revocationReason,
            record.revokedTimestamp
        );
    }

    /**
     * @notice Officially revokes an existing marksheet.
     * @dev Only the authorized administrator can revoke. Cannot revoke an already revoked or unregistered marksheet.
     * @param _documentHash The SHA-256 hash of the marksheet to revoke.
     * @param _reason The institutional reason for revocation.
     */
    function revokeMarksheet(bytes32 _documentHash, string calldata _reason) external onlyAdmin {
        MarksheetRecord storage record = marksheets[_documentHash];
        require(record.status != Status.Unregistered, "VERITAS: Marksheet does not exist");
        require(record.status == Status.Valid, "VERITAS: Marksheet is already revoked");
        require(bytes(_reason).length > 0, "VERITAS: Revocation reason must be specified");

        record.status = Status.Revoked;
        record.revocationReason = _reason;
        record.revokedTimestamp = block.timestamp;
        totalRevoked += 1;

        emit MarksheetRevoked(_documentHash, _reason, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns the full list of all registered document hashes.
     * @dev Useful for administrative dashboards and indexing.
     */
    function getAllRegisteredHashes() external view returns (bytes32[] memory) {
        return registeredHashes;
    }

    /**
     * @notice Retrieves the full record for a given document hash.
     */
    function getMarksheet(bytes32 _documentHash) external view returns (MarksheetRecord memory) {
        require(marksheets[_documentHash].status != Status.Unregistered, "VERITAS: Record not found");
        return marksheets[_documentHash];
    }

    /**
     * @notice Returns total number of registered marksheets.
     */
    function getRegisteredCount() external view returns (uint256) {
        return registeredHashes.length;
    }

    /**
     * @notice Transfers admin authority to a new university address.
     * @param _newAdmin The address of the new administrator.
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "VERITAS: New admin cannot be zero address");
        address previousAdmin = universityAdmin;
        universityAdmin = _newAdmin;
        emit AdminTransferred(previousAdmin, _newAdmin);
    }
}
