import React from 'react';
import { ShieldCheck, ExternalLink, Lock, CheckCircle2, Copy, Check } from 'lucide-react';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { formatAddress } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_CONFIG.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#182C2A] text-[#FAF9F5] border-t-2 border-[#9C815D] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Project Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#9C815D] bg-[#0F1E1C] flex items-center justify-center text-[#9C815D]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-bold tracking-widest text-[#FAF9F5]">
                VERITAS
              </span>
            </div>
            <p className="text-sm text-[#D8D2C5]/80 font-serif leading-relaxed max-w-sm">
              An institutional-grade decentralized framework ensuring the perpetual cryptographic
              integrity and verifiability of academic marksheets.
            </p>
            <div className="pt-2 text-xs text-[#9C815D] font-mono uppercase tracking-wider">
              College Blockchain Application Development • Mini Project (2022–2026)
            </div>
          </div>

          {/* Cryptographic Architecture Invariants */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#9C815D] font-semibold">
              Security Invariants
            </h4>
            <ul className="space-y-2 text-xs text-[#D8D2C5]/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9C815D] shrink-0 mt-0.5" />
                <span>Zero on-chain PDF storage — absolute student privacy preservation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9C815D] shrink-0 mt-0.5" />
                <span>FIPS PUB 180-4 SHA-256 client-side cryptographic hashing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9C815D] shrink-0 mt-0.5" />
                <span>Non-repudiable university administrator signature via MetaMask.</span>
              </li>
            </ul>
          </div>

          {/* Smart Contract On-Chain Coordinates */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#9C815D] font-semibold">
              Contract Coordinates
            </h4>
            <div className="bg-[#0F1E1C] border border-[#2A4A46] p-3 text-xs">
              <span className="text-[10px] font-mono text-[#D8D2C5]/60 block mb-1">
                MarksheetVerification.sol (EVM)
              </span>
              <div className="flex items-center justify-between font-mono text-[11px] text-[#FAF9F5]">
                <span>{formatAddress(CONTRACT_CONFIG.address, 6)}</span>
                <button
                  onClick={handleCopy}
                  className="text-[#9C815D] hover:text-[#FAF9F5] transition-colors p-1"
                  title="Copy contract address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#235347]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="text-[11px] text-[#D8D2C5]/60">
              Target Networks: Local Hardhat (31337) & Sepolia (11155111)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2A4A46] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8D2C5]/50 gap-4">
          <p>© {new Date().getFullYear()} VERITAS. Developed by Jiya & Prem. All rights reserved.</p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Solidity 0.8.20</span>
            <span>•</span>
            <span>MetaMask Web3</span>
            <span>•</span>
            <span>ethers.js v6</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
