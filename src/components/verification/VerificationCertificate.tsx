import React from 'react';
import { ShieldCheck, AlertOctagon, AlertTriangle, CheckCircle2, Copy, Check, Printer, Calendar, User, BookOpen, Hash, Award } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatAddress, formatHash, formatTimestamp } from '../../utils/formatters';

export interface VerificationData {
  isAuthentic: boolean;
  status: number; // 0 = Unregistered, 1 = Valid, 2 = Revoked
  studentRollNumber: string;
  studentName: string;
  course: string;
  academicYear: string;
  issueTimestamp: number;
  issuer: string;
  revocationReason: string;
  revokedTimestamp: number;
  calculatedHash: string;
  fileName?: string;
}

interface VerificationCertificateProps {
  data: VerificationData;
  onVerifyAnother: () => void;
}

export const VerificationCertificate: React.FC<VerificationCertificateProps> = ({
  data,
  onVerifyAnother,
}) => {
  const [copiedHash, setCopiedHash] = React.useState(false);
  const [copiedIssuer, setCopiedIssuer] = React.useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(data.calculatedHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyIssuer = () => {
    navigator.clipboard.writeText(data.issuer);
    setCopiedIssuer(true);
    setTimeout(() => setCopiedIssuer(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isValid = data.status === 1;
  const isRevoked = data.status === 2;
  const isUnregistered = data.status === 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Editorial Certificate Container */}
      <div className="bg-[#FAF9F5] border-2 border-[#D8D2C5] shadow-elevated relative overflow-hidden p-8 sm:p-12 print:border-none print:shadow-none">
        {/* Subtle Decorative Guilloche Border simulation */}
        <div className="absolute inset-2 border border-[#D8D2C5]/50 pointer-events-none" />
        <div className="absolute inset-3 border border-[#9C815D]/20 pointer-events-none" />

        {/* Top Header of the Certificate */}
        <div className="text-center relative z-10 pb-8 border-b border-[#D8D2C5]/80">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#182C2A] border-2 border-[#9C815D] flex items-center justify-center text-[#9C815D] shadow-sm">
            {isValid && <ShieldCheck className="w-9 h-9" />}
            {isRevoked && <AlertTriangle className="w-9 h-9 text-[#8B2635]" />}
            {isUnregistered && <AlertOctagon className="w-9 h-9 text-[#735F43]" />}
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-widest text-[#182C2A] uppercase">
            Certificate of Academic Verification
          </h2>
          <p className="font-serif italic text-sm text-[#182C2A]/70 mt-1">
            Issued under cryptographic consensus via the Ethereum Blockchain
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            {isValid && (
              <Badge variant="authentic" className="px-4 py-1 text-xs">
                GENUINE & AUTHENTIC RECORD
              </Badge>
            )}
            {isRevoked && (
              <Badge variant="revoked" className="px-4 py-1 text-xs">
                OFFICIALLY REVOKED RECORD
              </Badge>
            )}
            {isUnregistered && (
              <Badge variant="unregistered" className="px-4 py-1 text-xs">
                UNREGISTERED / POTENTIALLY TAMPERED
              </Badge>
            )}
          </div>
        </div>

        {/* Certificate Content Body */}
        {isValid && (
          <div className="py-8 space-y-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase font-mono tracking-widest text-[#9C815D] font-semibold">
                Official Validation Attestation
              </p>
              <p className="text-base sm:text-lg text-[#182C2A] font-serif leading-relaxed mt-2">
                This certifies that the marksheet document corresponding to{' '}
                <span className="font-semibold underline decoration-[#9C815D]">{data.studentName}</span> has
                been verified against the Ethereum distributed ledger with matching 256-bit cryptographic digest.
              </p>
            </div>

            {/* Academic Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F3F0E8]/50 p-6 border border-[#D8D2C5]">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#9C815D] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#182C2A]/60 block">
                    Student Full Name
                  </span>
                  <span className="text-base font-serif font-bold text-[#182C2A]">
                    {data.studentName}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-[#9C815D] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#182C2A]/60 block">
                    Registration / Roll Number
                  </span>
                  <span className="text-base font-mono font-semibold text-[#182C2A]">
                    {data.studentRollNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#9C815D] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#182C2A]/60 block">
                    Program / Degree
                  </span>
                  <span className="text-sm font-medium text-[#182C2A]">
                    {data.course}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#9C815D] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#182C2A]/60 block">
                    Academic Session / Year
                  </span>
                  <span className="text-sm font-mono font-medium text-[#182C2A]">
                    {data.academicYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#182C2A]/70 font-semibold">
                Cryptographic Consensus Coordinates
              </h4>

              <div className="border border-[#D8D2C5] divide-y divide-[#D8D2C5]/70 text-xs bg-[#FAF9F5]">
                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#182C2A]/60 font-mono text-[11px] uppercase">
                    Computed Document SHA-256:
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#182C2A]">
                    <span className="break-all">{data.calculatedHash}</span>
                    <button
                      onClick={handleCopyHash}
                      className="text-[#9C815D] hover:text-[#735F43] p-1 shrink-0"
                      title="Copy full hash"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-[#235347]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#182C2A]/60 font-mono text-[11px] uppercase">
                    Issuing Authority Wallet:
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#182C2A]">
                    <span>{data.issuer}</span>
                    <button
                      onClick={handleCopyIssuer}
                      className="text-[#9C815D] hover:text-[#735F43] p-1 shrink-0"
                      title="Copy issuer address"
                    >
                      {copiedIssuer ? <Check className="w-3.5 h-3.5 text-[#235347]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-[#182C2A]/60 font-mono text-[11px] uppercase">
                    On-Chain Registration Timestamp:
                  </span>
                  <span className="font-mono text-[11px] text-[#182C2A]">
                    {formatTimestamp(data.issueTimestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revoked State */}
        {isRevoked && (
          <div className="py-8 space-y-6 relative z-10">
            <div className="p-5 bg-[#8B2635]/10 border border-[#8B2635]/30">
              <h4 className="text-sm font-semibold text-[#8B2635] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                This Marksheet Has Been Officially Revoked
              </h4>
              <p className="text-xs text-[#182C2A]/80 mt-2 leading-relaxed">
                Although this document was originally registered by the authorized university wallet, it has been
                subsequently invalidated by the institution and carries no legal or academic validity.
              </p>
              <div className="mt-4 pt-3 border-t border-[#8B2635]/20 text-xs">
                <span className="font-semibold text-[#8B2635]">Institutional Reason: </span>
                <span className="italic text-[#182C2A]">{data.revocationReason || 'Administrative invalidation.'}</span>
              </div>
              <div className="mt-1 text-xs text-[#182C2A]/60 font-mono">
                Revoked On: {formatTimestamp(data.revokedTimestamp)}
              </div>
            </div>

            <div className="bg-[#F3F0E8]/50 p-4 border border-[#D8D2C5] text-xs">
              <span className="text-[#182C2A]/60 block font-mono uppercase text-[11px] mb-1">
                Revoked Student Profile:
              </span>
              <p className="font-serif text-sm font-bold text-[#182C2A]">
                {data.studentName} ({data.studentRollNumber}) — {data.course}
              </p>
            </div>
          </div>
        )}

        {/* Unregistered / Tampered State */}
        {isUnregistered && (
          <div className="py-8 space-y-6 relative z-10">
            <div className="p-6 bg-[#FAF9F5] border-2 border-dashed border-[#B8B0A0] text-center max-w-xl mx-auto">
              <AlertOctagon className="w-10 h-10 text-[#735F43] mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-[#182C2A]">
                No Verification Record Found
              </h4>
              <p className="text-xs text-[#182C2A]/70 mt-2 leading-relaxed">
                The computed SHA-256 cryptographic digest does not match any official academic marksheet registered on
                the Ethereum blockchain.
              </p>
              <div className="mt-5 p-3 bg-[#F3F0E8] border border-[#D8D2C5] text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#182C2A]/60 block mb-1">
                  Computed SHA-256 Digest of Uploaded PDF:
                </span>
                <span className="font-mono text-xs text-[#182C2A] break-all block">
                  {data.calculatedHash}
                </span>
              </div>
            </div>

            {/* Why did this happen educational box */}
            <div className="p-4 bg-[#F3F0E8]/60 border border-[#D8D2C5] text-xs space-y-2">
              <p className="font-semibold text-[#182C2A] uppercase tracking-wider font-mono text-[11px]">
                Potential Reasons:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#182C2A]/70">
                <li>The document has been digitally altered or forged (grades, name, or metadata edited).</li>
                <li>The document was re-exported, compressed, or re-saved, altering its binary hash.</li>
                <li>The marksheet was never registered on the blockchain by an authorized institution.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Certificate Footer / Seal Stamp */}
        <div className="pt-8 mt-6 border-t border-[#D8D2C5]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#182C2A]/60 gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#9C815D]" />
            <span className="font-mono text-[11px]">VERITAS Cryptographic Attestation Protocol</span>
          </div>

          <div className="font-mono text-[11px]">
            Verified at: {new Date().toUTCString()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button variant="outline" size="md" onClick={onVerifyAnother}>
          Verify Another Marksheet
        </Button>

        {isValid && (
          <Button variant="primary" size="md" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print Verification Certificate
          </Button>
        )}
      </div>
    </div>
  );
};
