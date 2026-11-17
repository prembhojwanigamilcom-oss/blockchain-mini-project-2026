import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { MarksheetVerification } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("MarksheetVerification Contract", function () {
  let marksheetVerification: MarksheetVerification;
  let admin: HardhatEthersSigner;
  let unauthorizedUser: HardhatEthersSigner;
  let newAdmin: HardhatEthersSigner;

  const sampleHash1 = ethers.keccak256(ethers.toUtf8Bytes("Marksheet_PDF_Student_101"));
  const sampleHash2 = ethers.keccak256(ethers.toUtf8Bytes("Marksheet_PDF_Student_102"));
  const studentRoll1 = "VER-2022-CS-042";
  const studentName1 = "Jiya Sharma";
  const course1 = "B.Tech Computer Science & Engineering";
  const academicYear1 = "2022-2026";

  beforeEach(async function () {
    [admin, unauthorizedUser, newAdmin] = await ethers.getSigners();
    const MarksheetFactory = await ethers.getContractFactory("MarksheetVerification");
    marksheetVerification = (await MarksheetFactory.deploy()) as unknown as MarksheetVerification;
    await marksheetVerification.waitForDeployment();
  });

  describe("Deployment & Authorization", function () {
    it("Should set the deployer as the initial universityAdmin", async function () {
      expect(await marksheetVerification.universityAdmin()).to.equal(admin.address);
    });

    it("Should initialize counters to zero", async function () {
      expect(await marksheetVerification.totalIssued()).to.equal(0);
      expect(await marksheetVerification.totalRevoked()).to.equal(0);
      expect(await marksheetVerification.getRegisteredCount()).to.equal(0);
    });
  });

  describe("Marksheet Registration", function () {
    it("Should allow university administrator to register a marksheet", async function () {
      const tx = await marksheetVerification.registerMarksheet(
        sampleHash1,
        studentRoll1,
        studentName1,
        course1,
        academicYear1
      );

      await expect(tx)
        .to.emit(marksheetVerification, "MarksheetRegistered")
        .withArgs(sampleHash1, studentRoll1, studentName1, admin.address, (await ethers.provider.getBlock("latest"))!.timestamp);

      expect(await marksheetVerification.totalIssued()).to.equal(1);
      const hashes = await marksheetVerification.getAllRegisteredHashes();
      expect(hashes.length).to.equal(1);
      expect(hashes[0]).to.equal(sampleHash1);
    });

    it("Should revert if an unauthorized user attempts to register", async function () {
      await expect(
        marksheetVerification
          .connect(unauthorizedUser)
          .registerMarksheet(sampleHash1, studentRoll1, studentName1, course1, academicYear1)
      ).to.be.revertedWith("VERITAS: Caller is not the authorized university administrator");
    });

    it("Should revert if document hash is zero", async function () {
      await expect(
        marksheetVerification.registerMarksheet(
          ethers.ZeroHash,
          studentRoll1,
          studentName1,
          course1,
          academicYear1
        )
      ).to.be.revertedWith("VERITAS: Document hash cannot be empty");
    });

    it("Should prevent duplicate registration of the same document hash", async function () {
      await marksheetVerification.registerMarksheet(
        sampleHash1,
        studentRoll1,
        studentName1,
        course1,
        academicYear1
      );

      await expect(
        marksheetVerification.registerMarksheet(
          sampleHash1,
          studentRoll1,
          studentName1,
          course1,
          academicYear1
        )
      ).to.be.revertedWith(
        "VERITAS: Marksheet with this hash already registered. Overwriting is strictly prohibited."
      );
    });
  });

  describe("Public Verification", function () {
    beforeEach(async function () {
      await marksheetVerification.registerMarksheet(
        sampleHash1,
        studentRoll1,
        studentName1,
        course1,
        academicYear1
      );
    });

    it("Should accurately verify an authentic registered marksheet", async function () {
      const result = await marksheetVerification.verifyMarksheet(sampleHash1);
      expect(result.isAuthentic).to.be.true;
      expect(result.status).to.equal(1); // Status.Valid
      expect(result.studentRollNumber).to.equal(studentRoll1);
      expect(result.studentName).to.equal(studentName1);
      expect(result.course).to.equal(course1);
      expect(result.academicYear).to.equal(academicYear1);
      expect(result.issuer).to.equal(admin.address);
    });

    it("Should return Unregistered status for a non-existent document hash", async function () {
      const result = await marksheetVerification.verifyMarksheet(sampleHash2);
      expect(result.isAuthentic).to.be.false;
      expect(result.status).to.equal(0); // Status.Unregistered
      expect(result.studentRollNumber).to.equal("");
    });
  });

  describe("Certificate Revocation", function () {
    beforeEach(async function () {
      await marksheetVerification.registerMarksheet(
        sampleHash1,
        studentRoll1,
        studentName1,
        course1,
        academicYear1
      );
    });

    it("Should allow admin to revoke a valid marksheet", async function () {
      const reason = "Administrative error in grade calculation. Revised marksheet issued.";
      const tx = await marksheetVerification.revokeMarksheet(sampleHash1, reason);

      await expect(tx)
        .to.emit(marksheetVerification, "MarksheetRevoked")
        .withArgs(sampleHash1, reason, admin.address, (await ethers.provider.getBlock("latest"))!.timestamp);

      expect(await marksheetVerification.totalRevoked()).to.equal(1);

      const result = await marksheetVerification.verifyMarksheet(sampleHash1);
      expect(result.isAuthentic).to.be.false;
      expect(result.status).to.equal(2); // Status.Revoked
      expect(result.revocationReason).to.equal(reason);
    });

    it("Should revert if unauthorized user attempts to revoke", async function () {
      await expect(
        marksheetVerification
          .connect(unauthorizedUser)
          .revokeMarksheet(sampleHash1, "Fraudulent attempt")
      ).to.be.revertedWith("VERITAS: Caller is not the authorized university administrator");
    });

    it("Should revert if trying to revoke an already revoked marksheet", async function () {
      await marksheetVerification.revokeMarksheet(sampleHash1, "First revocation");
      await expect(
        marksheetVerification.revokeMarksheet(sampleHash1, "Second revocation attempt")
      ).to.be.revertedWith("VERITAS: Marksheet is already revoked");
    });
  });

  describe("Admin Transfer", function () {
    it("Should allow admin to transfer administrative authority", async function () {
      await marksheetVerification.transferAdmin(newAdmin.address);
      expect(await marksheetVerification.universityAdmin()).to.equal(newAdmin.address);

      // Now newAdmin can register
      await marksheetVerification
        .connect(newAdmin)
        .registerMarksheet(sampleHash2, "VER-2022-CS-099", "Prem Kumar", course1, academicYear1);

      expect(await marksheetVerification.totalIssued()).to.equal(1);
    });
  });
});
