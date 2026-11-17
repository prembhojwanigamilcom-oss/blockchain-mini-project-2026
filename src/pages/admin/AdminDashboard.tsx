import React, { useState, useEffect } from 'react';
import { Award, ShieldAlert, CheckCircle2, FileUp, AlertTriangle, Radio, Wallet, ArrowUpRight, ShieldCheck, Database, Layers } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useWeb3 } from '../../context/Web3Context';
import { formatAddress, getNetworkName } from '../../utils/formatters';

interface AdminDashboardProps {
  onNavigate: (tab: 'verify' | 'issue' | 'records' | 'dashboard') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { account, chainId, isAdmin, adminAddress, isCorrectNetwork, connectWallet, getReadOnlyContract } = useWeb3();

  const [totalIssued, setTotalIssued] = useState<number>(0);
  const [totalRevoked, setTotalRevoked] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const contract = getReadOnlyContract();
        const [issued, revoked] = await Promise.all([
          contract.totalIssued(),
          contract.totalRevoked(),
        ]);
        setTotalIssued(Number(issued));
        setTotalRevoked(Number(revoked));
      } catch (err) {
        console.warn('Could not read stats from contract yet:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [getReadOnlyContract]);

  const activeValid = totalIssued - totalRevoked;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Header */}
      <div className="border-b border-[#D8D2C5] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9C815D]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#9C815D] font-semibold">
              Executive Console
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#182C2A] mt-1">
            University Admin Dashboard
          </h1>
          <p className="font-serif italic text-xs text-[#182C2A]/70 mt-1">
            Real-time ledger analytics and administrative authorization control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('records')}
          >
            Open Registry
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('issue')}
            icon={<FileUp className="w-4 h-4 text-[#9C815D]" />}
          >
            Issue Marksheet
          </Button>
        </div>
      </div>

      {/* Admin Wallet Authorization Status Banner */}
      <div className="bg-[#FAF9F5] border border-[#D8D2C5] p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 bg-[#182C2A] border border-[#9C815D] flex items-center justify-center text-[#9C815D] shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#182C2A]/60">
                  MetaMask Signer Status:
                </span>
                {account ? (
                  isAdmin ? (
                    <Badge variant="authentic">Administrator Verified</Badge>
                  ) : (
                    <Badge variant="neutral">Connected (Observer)</Badge>
                  )
                ) : (
                  <Badge variant="revoked">Disconnected</Badge>
                )}
              </div>
              <p className="font-mono text-xs font-semibold text-[#182C2A] mt-0.5">
                {account ? account : 'No wallet connected. Connect MetaMask to issue or revoke marksheets.'}
              </p>
            </div>
          </div>

          {!account ? (
            <Button variant="primary" size="sm" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <div className="text-xs text-right font-mono text-[#182C2A]/70">
              <span>Authorized Admin in Contract: </span>
              <span className="font-semibold text-[#182C2A]">
                {adminAddress ? formatAddress(adminAddress, 6) : 'Loading...'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stat Metric Cards (Swiss Editorial Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-[#182C2A]/60 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#182C2A]/60 block font-semibold">
              Total Issued Marksheets
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#182C2A]">
              {loading ? '—' : totalIssued}
            </div>
            <p className="text-[11px] font-mono text-[#9C815D]">
              Permanent on-chain records
            </p>
          </div>
        </Card>

        <Card className="hover:border-[#182C2A]/60 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#182C2A]/60 block font-semibold">
              Active Valid Marksheets
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#235347]">
              {loading ? '—' : activeValid}
            </div>
            <p className="text-[11px] font-mono text-[#235347]">
              Cryptographically verified
            </p>
          </div>
        </Card>

        <Card className="hover:border-[#182C2A]/60 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#182C2A]/60 block font-semibold">
              Revoked Marksheets
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#8B2635]">
              {loading ? '—' : totalRevoked}
            </div>
            <p className="text-[11px] font-mono text-[#8B2635]">
              Invalidated by university
            </p>
          </div>
        </Card>

        <Card className="hover:border-[#182C2A]/60 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#182C2A]/60 block font-semibold">
              Blockchain Consensus
            </span>
            <div className="font-serif text-2xl font-bold text-[#182C2A] truncate">
              {getNetworkName(chainId)}
            </div>
            <p className="text-[11px] font-mono text-[#9C815D]">
              Chain ID: {chainId || 31337}
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Action Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('issue')}
          className="bg-[#FAF9F5] border border-[#D8D2C5] p-6 hover:border-[#9C815D] cursor-pointer transition-all duration-200 group shadow-subtle"
        >
          <div className="w-10 h-10 bg-[#F3F0E8] border border-[#D8D2C5] flex items-center justify-center text-[#182C2A] group-hover:bg-[#182C2A] group-hover:text-[#FAF9F5] transition-colors mb-4">
            <FileUp className="w-5 h-5 text-[#9C815D]" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#182C2A]">
              Issue New Marksheet
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#9C815D] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-[#182C2A]/70 mt-1 leading-relaxed">
            Upload student marksheet PDF, compute cryptographic SHA-256 fingerprint, and register via MetaMask.
          </p>
        </div>

        <div
          onClick={() => onNavigate('records')}
          className="bg-[#FAF9F5] border border-[#D8D2C5] p-6 hover:border-[#9C815D] cursor-pointer transition-all duration-200 group shadow-subtle"
        >
          <div className="w-10 h-10 bg-[#F3F0E8] border border-[#D8D2C5] flex items-center justify-center text-[#182C2A] group-hover:bg-[#182C2A] group-hover:text-[#FAF9F5] transition-colors mb-4">
            <Layers className="w-5 h-5 text-[#9C815D]" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#182C2A]">
              Certificate Registry
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#9C815D] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-[#182C2A]/70 mt-1 leading-relaxed">
            Search, filter, inspect details, and execute on-chain revocation of compromised certificates.
          </p>
        </div>

        <div
          onClick={() => onNavigate('verify')}
          className="bg-[#FAF9F5] border border-[#D8D2C5] p-6 hover:border-[#9C815D] cursor-pointer transition-all duration-200 group shadow-subtle"
        >
          <div className="w-10 h-10 bg-[#F3F0E8] border border-[#D8D2C5] flex items-center justify-center text-[#182C2A] group-hover:bg-[#182C2A] group-hover:text-[#FAF9F5] transition-colors mb-4">
            <ShieldCheck className="w-5 h-5 text-[#9C815D]" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#182C2A]">
              Public Verification
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#9C815D] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-[#182C2A]/70 mt-1 leading-relaxed">
            Experience the zero-trust verification flow used by students, employers, and credential evaluators.
          </p>
        </div>
      </div>
    </div>
  );
};
