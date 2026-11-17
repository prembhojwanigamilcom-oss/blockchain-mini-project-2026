import React, { useState } from 'react';
import { ShieldCheck, Search, FileText, CheckCircle2, AlertOctagon, Sparkles, ExternalLink } from 'lucide-react';
import { Dropzone } from '../components/ui/Dropzone';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { VerificationCertificate, VerificationData } from '../components/verification/VerificationCertificate';
import { useWeb3 } from '../context/Web3Context';
import { calculateBufferHash, isValidBytes32 } from '../utils/crypto';

export const VerificationPortal: React.FC = () => {
  const { getReadOnlyContract, contractAddress } = useWeb3();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationData | null>(null);
  const [manualHash, setManualHash] = useState('');
  const [activeMode, setActiveMode] = useState<'upload' | 'manual'>('upload');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  /**
   * Queries the blockchain smart contract for a given 32-byte document hash
   */
  const executeVerification = async (hashToVerify: string, fileName?: string) => {
    try {
      setIsVerifying(true);
      setErrorNotice(null);

      const contract = getReadOnlyContract();
      // Call public view function verifyMarksheet(bytes32)
      const result = await contract.verifyMarksheet(hashToVerify);

      const data: VerificationData = {
        isAuthentic: result.isAuthentic,
        status: Number(result.status), // 0 = Unregistered, 1 = Valid, 2 = Revoked
        studentRollNumber: result.studentRollNumber,
        studentName: result.studentName,
        course: result.course,
        academicYear: result.academicYear,
        issueTimestamp: Number(result.issueTimestamp),
        issuer: result.issuer,
        revocationReason: result.revocationReason,
        revokedTimestamp: Number(result.revokedTimestamp),
        calculatedHash: hashToVerify,
        fileName: fileName,
      };

      setVerificationResult(data);
    } catch (err: any) {
      console.error('Verification error:', err);
      // If contract is not yet deployed or local node is not running, show informative note
      setErrorNotice(
        'Unable to reach the smart contract node. Ensure your local Hardhat node is running (npx hardhat node) or contract is deployed.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handles dropzone file hashing completion
   */
  const handleFileHashed = async (data: { file: File; hash: string }) => {
    await executeVerification(data.hash, data.file.name);
  };

  /**
   * Handles manual hash input submission
   */
  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHash = manualHash.trim();
    if (!isValidBytes32(cleanHash)) {
      alert('Please enter a valid 64-character hex string starting with 0x (bytes32).');
      return;
    }
    await executeVerification(cleanHash, 'Manual SHA-256 Digest Query');
  };

  /**
   * Demo Helpers: Preload sample test cases so the examiner/user can demo instantly
   */
  const handleDemoAuthentic = async () => {
    // Generate deterministic demo hash for "VERITAS_SAMPLE_STUDENT_AUTHENTIC_2026"
    const encoder = new TextEncoder();
    const buffer = encoder.encode("VERITAS_SAMPLE_MARKSHEET_JIYA_SHARMA_ROLL_VER2022CS042").buffer;
    const { hash } = await calculateBufferHash(buffer);
    await executeVerification(hash, "Sample_Academic_Marksheet_Jiya_Sharma.pdf");
  };

  const handleDemoTampered = async () => {
    // Generate deterministic demo hash for an unregistered/modified document
    const encoder = new TextEncoder();
    const buffer = encoder.encode("VERITAS_SAMPLE_TAMPERED_MODIFIED_DOCUMENT_GRADE_FORGERY").buffer;
    const { hash } = await calculateBufferHash(buffer);
    await executeVerification(hash, "Modified_Tampered_Marksheet_Copy.pdf");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#182C2A]/5 border border-[#182C2A]/15 text-[#182C2A] text-xs font-mono uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#9C815D]" />
          Zero-Trust Verification Engine
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#182C2A]">
          Verify Academic Marksheet
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-[#182C2A]/70 leading-relaxed">
          Upload an official academic marksheet in PDF format to evaluate its cryptographic proof against the
          Ethereum blockchain. No wallet required.
        </p>
      </div>

      {/* Verification Container or Certificate Display */}
      {!verificationResult ? (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Mode Switcher */}
          <div className="flex border-b border-[#D8D2C5]">
            <button
              onClick={() => setActiveMode('upload')}
              className={`py-3 px-6 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all ${
                activeMode === 'upload'
                  ? 'border-[#9C815D] text-[#182C2A] bg-[#FAF9F5]'
                  : 'border-transparent text-[#182C2A]/60 hover:text-[#182C2A]'
              }`}
            >
              Upload PDF Marksheet
            </button>
            <button
              onClick={() => setActiveMode('manual')}
              className={`py-3 px-6 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all ${
                activeMode === 'manual'
                  ? 'border-[#9C815D] text-[#182C2A] bg-[#FAF9F5]'
                  : 'border-transparent text-[#182C2A]/60 hover:text-[#182C2A]'
              }`}
            >
              Enter SHA-256 Digest Manually
            </button>
          </div>

          {/* Mode 1: PDF Dropzone */}
          {activeMode === 'upload' && (
            <div className="space-y-4">
              <Dropzone
                onFileHashed={handleFileHashed}
                label="Drop Academic Marksheet PDF"
                helperText="Drag & drop marksheet PDF or click to browse. The SHA-256 digest is generated instantly in browser memory."
                disabled={isVerifying}
              />
            </div>
          )}

          {/* Mode 2: Manual Hash Input */}
          {activeMode === 'manual' && (
            <Card
              title="Manual Digest Lookup"
              subtitle="Query contract records using an existing 32-byte document hash (hex)"
            >
              <form onSubmit={handleManualVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#182C2A]/70 mb-1.5 font-semibold">
                    Document Hash (0x...)
                  </label>
                  <input
                    type="text"
                    value={manualHash}
                    onChange={(e) => setManualHash(e.target.value)}
                    placeholder="0x7b58a12c... (64 hex characters)"
                    className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-4 py-2.5 font-mono text-xs text-[#182C2A] focus:outline-none focus:ring-1 focus:ring-[#9C815D] focus:border-[#9C815D]"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isVerifying}
                    icon={<Search className="w-4 h-4 text-[#9C815D]" />}
                  >
                    Query Blockchain
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Error Notice if contract unreachable */}
          {errorNotice && (
            <div className="p-4 bg-[#8B2635]/10 border border-[#8B2635]/30 text-xs text-[#8B2635]">
              <p className="font-semibold">{errorNotice}</p>
            </div>
          )}

          {/* Institutional Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#D8D2C5]">
            <div className="p-4 bg-[#FAF9F5] border border-[#D8D2C5]/80 space-y-1">
              <span className="font-mono text-[11px] text-[#9C815D] uppercase tracking-wider font-semibold">
                01. Client-Side Hash
              </span>
              <p className="text-xs text-[#182C2A]/70">
                Your PDF document is never uploaded to any server. Hashing occurs 100% locally.
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] border border-[#D8D2C5]/80 space-y-1">
              <span className="font-mono text-[11px] text-[#9C815D] uppercase tracking-wider font-semibold">
                02. Zero Gas Cost
              </span>
              <p className="text-xs text-[#182C2A]/70">
                Public verification executes as an Ethereum <code className="font-mono">eth_call</code> — completely free.
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] border border-[#D8D2C5]/80 space-y-1">
              <span className="font-mono text-[11px] text-[#9C815D] uppercase tracking-wider font-semibold">
                03. Avalanche Effect
              </span>
              <p className="text-xs text-[#182C2A]/70">
                Altering even a single grade or pixel creates an entirely distinct SHA-256 fingerprint.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Render Verified Certificate Result */
        <VerificationCertificate
          data={verificationResult}
          onVerifyAnother={() => setVerificationResult(null)}
        />
      )}
    </div>
  );
};
