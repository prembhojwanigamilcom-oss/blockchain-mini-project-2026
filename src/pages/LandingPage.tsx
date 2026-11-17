import React from 'react';
import { ShieldCheck, Award, Lock, FileSearch, ArrowRight, CheckCircle2, Database, Key, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CONTRACT_CONFIG } from '../config/contracts';
import { formatAddress } from '../utils/formatters';

interface LandingPageProps {
  onStartVerify: () => void;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartVerify, onGoToDashboard }) => {
  return (
    <div className="space-y-24 py-8">
      {/* Editorial Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#182C2A]/5 border border-[#182C2A]/15 text-[#182C2A] text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C815D]" />
              Ethereum Smart Contract Ledger
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#182C2A] leading-[1.1]">
              Cryptographic Truth for Academic Credentials.
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-[#182C2A]/75 leading-relaxed max-w-xl">
              An institutional verification protocol eliminating academic credential fraud through SHA-256 hashing and
              immutable Ethereum consensus.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartVerify}
                icon={<ShieldCheck className="w-5 h-5 text-[#9C815D]" />}
              >
                Verify Marksheet Document
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onGoToDashboard}
              >
                University Portal
              </Button>
            </div>

            <div className="pt-8 border-t border-[#D8D2C5] flex items-center gap-8 text-xs font-mono text-[#182C2A]/70">
              <div>
                <span className="block font-bold text-sm text-[#182C2A]">FIPS 180-4</span>
                <span>SHA-256 Standard</span>
              </div>
              <div className="w-px h-8 bg-[#D8D2C5]" />
              <div>
                <span className="block font-bold text-sm text-[#182C2A]">Zero Gas</span>
                <span>For Public Verifiers</span>
              </div>
              <div className="w-px h-8 bg-[#D8D2C5]" />
              <div>
                <span className="block font-bold text-sm text-[#182C2A]">Privacy-First</span>
                <span>Zero On-Chain PII</span>
              </div>
            </div>
          </div>

          {/* Right Editorial Stamp Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF9F5] border-2 border-[#D8D2C5] p-8 shadow-elevated relative">
              <div className="absolute top-4 right-4">
                <Badge variant="gold">Institutional Specimen</Badge>
              </div>

              <div className="w-14 h-14 bg-[#182C2A] border border-[#9C815D] flex items-center justify-center text-[#9C815D] mb-6">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-widest text-[#9C815D] font-semibold block">
                Verification Protocol Invariant
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#182C2A] mt-1">
                Deterministic Integrity
              </h3>

              <p className="text-xs text-[#182C2A]/75 mt-3 leading-relaxed font-serif">
                A marksheet’s SHA-256 fingerprint represents its exact binary sequence. Altering a student's marks from
                'B' to 'A' or forging an administrative signature changes every byte of the resulting 32-byte digest,
                making fraudulent documents impossible to validate.
              </p>

              <div className="mt-6 pt-6 border-t border-[#D8D2C5] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-[#182C2A]/60">
                  <span>Smart Contract:</span>
                  <span className="text-[#182C2A] font-semibold">{formatAddress(CONTRACT_CONFIG.address, 4)}</span>
                </div>
                <div className="flex justify-between text-[#182C2A]/60">
                  <span>Target Chain:</span>
                  <span className="text-[#182C2A]">Hardhat Local / Sepolia</span>
                </div>
                <div className="flex justify-between text-[#182C2A]/60">
                  <span>Access Control:</span>
                  <span className="text-[#235347] font-semibold">MetaMask Admin Authority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section (Swiss Editorial Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-y border-[#D8D2C5] bg-[#FAF9F5]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <Badge variant="neutral">Architecture Sequence</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#182C2A]">
            How VERITAS Guarantees Authenticity
          </h2>
          <p className="font-serif italic text-sm text-[#182C2A]/70">
            A three-step decentralized pipeline uniting client-side cryptography with Ethereum execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F3F0E8]/50 border border-[#D8D2C5] p-6 space-y-4">
            <span className="font-mono text-2xl font-bold text-[#9C815D]">01.</span>
            <h3 className="font-serif text-lg font-bold text-[#182C2A]">
              Client-Side Fingerprint Generation
            </h3>
            <p className="text-xs text-[#182C2A]/70 leading-relaxed">
              When an administrator issues a marksheet, the client calculates a 256-bit SHA-256 digest in browser memory.
              No document ever leaves the user’s computer.
            </p>
          </div>

          <div className="bg-[#F3F0E8]/50 border border-[#D8D2C5] p-6 space-y-4">
            <span className="font-mono text-2xl font-bold text-[#9C815D]">02.</span>
            <h3 className="font-serif text-lg font-bold text-[#182C2A]">
              MetaMask On-Chain Registration
            </h3>
            <p className="text-xs text-[#182C2A]/70 leading-relaxed">
              The university administrator authorizes the registration transaction via MetaMask. The hash and student
              metadata are irrevocably written to Ethereum smart contract state.
            </p>
          </div>

          <div className="bg-[#F3F0E8]/50 border border-[#D8D2C5] p-6 space-y-4">
            <span className="font-mono text-2xl font-bold text-[#9C815D]">03.</span>
            <h3 className="font-serif text-lg font-bold text-[#182C2A]">
              Instant Public Verification
            </h3>
            <p className="text-xs text-[#182C2A]/70 leading-relaxed">
              Anyone drops the marksheet PDF into the public portal. The app re-computes the hash and queries the smart
              contract. Matches confirm authenticity in milliseconds with zero gas fees.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Invariants Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="gold">Security Architecture</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#182C2A]">
              Engineered Against Credential Tampering
            </h2>
            <p className="font-serif italic text-sm text-[#182C2A]/70 leading-relaxed">
              Traditional paper credentials and basic digital PDFs are susceptible to Photoshop alteration, metadata
              forging, and unauthorized issuance. VERITAS renders tampering mathematically impossible.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#235347] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#182C2A]">Duplicate Prevention Guard</h4>
                  <p className="text-[#182C2A]/70 mt-0.5">
                    The smart contract strictly prohibits registering duplicate hashes. An issued marksheet cannot be
                    overwritten or manipulated by anyone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#235347] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#182C2A]">Official On-Chain Revocation</h4>
                  <p className="text-[#182C2A]/70 mt-0.5">
                    Universities can invalidate credentials due to administrative corrections, marking the status as
                    REVOKED on-chain with a permanent reason.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#235347] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#182C2A]">Zero Wallet Prerequisite for Verifiers</h4>
                  <p className="text-[#182C2A]/70 mt-0.5">
                    Employers, universities, and students verify documents globally without installing MetaMask or
                    holding cryptocurrency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#182C2A] text-[#FAF9F5] p-8 border border-[#9C815D] space-y-6">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#9C815D]" />
              <h3 className="font-serif text-xl font-bold tracking-wide">
                Solidity 0.8.20 Invariants
              </h3>
            </div>

            <pre className="font-mono text-xs text-[#D8D2C5] bg-[#0F1E1C] p-4 border border-[#2A4A46] overflow-x-auto leading-relaxed">
{`// MarksheetVerification.sol
require(_documentHash != bytes32(0));
require(
  marksheets[_documentHash].status == Status.Unregistered,
  "Already registered"
);
require(msg.sender == universityAdmin);`}
            </pre>

            <p className="text-xs text-[#D8D2C5]/70 leading-relaxed font-serif italic">
              All state transitions emit immutable EVM event logs: MarksheetRegistered and MarksheetRevoked.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center py-12">
        <div className="bg-[#FAF9F5] border border-[#D8D2C5] p-10 sm:p-14 space-y-6 shadow-subtle">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#182C2A]">
            Verify or Issue Marksheets Now
          </h2>
          <p className="font-serif italic text-sm text-[#182C2A]/70 max-w-lg mx-auto">
            Experience the verified transparency of decentralized academic credentials.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" size="lg" onClick={onStartVerify}>
              Go to Public Verifier
            </Button>
            <Button variant="outline" size="lg" onClick={onGoToDashboard}>
              Open Admin Console
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
