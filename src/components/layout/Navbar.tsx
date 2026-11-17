import React from 'react';
import { ShieldCheck, Wallet, ChevronDown, LogOut, Radio, AlertTriangle } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { formatAddress, getNetworkName } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentTab: 'verify' | 'issue' | 'records' | 'dashboard';
  setCurrentTab: (tab: 'verify' | 'issue' | 'records' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    account,
    chainId,
    isAdmin,
    isConnecting,
    isCorrectNetwork,
    hasMetaMask,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWeb3();

  return (
    <header className="bg-[#FAF9F5] border-b border-[#D8D2C5] sticky top-0 z-40 shadow-subtle">
      {/* Top Academic Banner */}
      <div className="bg-[#182C2A] text-[#D8D2C5] text-[11px] font-mono py-1 px-4 sm:px-8 flex items-center justify-between border-b border-[#2A4A46]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C815D] animate-pulse" />
          <span className="tracking-widest uppercase">
            VERITAS • Ethereum Cryptographic Marksheet Ledger
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-[#FAF9F5]/70">
            FIPS PUB 180-4 SHA-256 Compliant
          </span>
          <span className="text-[#9C815D] uppercase font-semibold">
            {getNetworkName(chainId)}
          </span>
        </div>
      </div>

      {/* Prominent Network Alert Banner when on wrong chain */}
      {!isCorrectNetwork && account && (
        <div className="bg-[#8B2635] text-[#FAF9F5] px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F3F0E8] shrink-0" />
            <span className="font-medium">
              MetaMask is currently on <strong>{getNetworkName(chainId)}</strong>. Please switch to <strong>Hardhat Localhost (Chain ID 31337)</strong> to use the administrator features and see your 10,000 test ETH.
            </span>
          </div>
          <button
            onClick={() => switchNetwork(31337)}
            className="px-3 py-1 bg-[#FAF9F5] text-[#8B2635] font-bold text-xs uppercase tracking-wider rounded-none hover:bg-[#F3F0E8] transition-colors shrink-0"
          >
            Switch to Hardhat (31337)
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => setCurrentTab('verify')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-[#182C2A] border border-[#9C815D] flex items-center justify-center text-[#9C815D] shadow-sm transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="w-6 h-6 text-[#9C815D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold tracking-widest text-[#182C2A]">
                  VERITAS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-[#9C815D]/15 text-[#735F43] border border-[#9C815D]/30">
                  On-Chain
                </span>
              </div>
              <p className="text-[11px] font-sans text-[#182C2A]/60 tracking-wider uppercase font-medium">
                Academic Marksheet Verification System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('verify')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
                currentTab === 'verify'
                  ? 'border-[#9C815D] text-[#182C2A] bg-[#F3F0E8]/70'
                  : 'border-transparent text-[#182C2A]/70 hover:text-[#182C2A] hover:bg-[#F3F0E8]/40'
              }`}
            >
              Public Verification
            </button>

            <button
              onClick={() => setCurrentTab('issue')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
                currentTab === 'issue'
                  ? 'border-[#9C815D] text-[#182C2A] bg-[#F3F0E8]/70'
                  : 'border-transparent text-[#182C2A]/70 hover:text-[#182C2A] hover:bg-[#F3F0E8]/40'
              }`}
            >
              Issue Marksheet
            </button>

            <button
              onClick={() => setCurrentTab('records')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
                currentTab === 'records'
                  ? 'border-[#9C815D] text-[#182C2A] bg-[#F3F0E8]/70'
                  : 'border-transparent text-[#182C2A]/70 hover:text-[#182C2A] hover:bg-[#F3F0E8]/40'
              }`}
            >
              Certificate Registry
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
                currentTab === 'dashboard'
                  ? 'border-[#9C815D] text-[#182C2A] bg-[#F3F0E8]/70'
                  : 'border-transparent text-[#182C2A]/70 hover:text-[#182C2A] hover:bg-[#F3F0E8]/40'
              }`}
            >
              Admin Dashboard
            </button>
          </nav>

          {/* MetaMask Wallet Connection Unit */}
          <div className="flex items-center gap-3">
            {!isCorrectNetwork && account && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchNetwork()}
                className="border-[#8B2635] text-[#8B2635] text-xs font-mono"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Switch to Hardhat/Sepolia
              </Button>
            )}

            {!account ? (
              <Button
                variant="primary"
                size="sm"
                onClick={connectWallet}
                isLoading={isConnecting}
                icon={<Wallet className="w-4 h-4 text-[#9C815D]" />}
                className="font-mono text-xs uppercase tracking-wider"
              >
                Connect MetaMask
              </Button>
            ) : (
              <div className="flex items-center gap-2 border border-[#D8D2C5] bg-[#F3F0E8] p-1.5 pl-3">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#235347]" />
                    <span className="font-mono text-xs font-semibold text-[#182C2A]">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {isAdmin ? (
                      <Badge variant="gold" dot={false} className="text-[9px] py-0 px-1">
                        University Admin
                      </Badge>
                    ) : (
                      <Badge variant="neutral" dot={false} className="text-[9px] py-0 px-1">
                        Observer Wallet
                      </Badge>
                    )}
                  </div>
                </div>

                <button
                  onClick={disconnectWallet}
                  title="Disconnect Wallet"
                  className="p-1.5 text-[#182C2A]/50 hover:text-[#8B2635] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#D8D2C5]">
          <button
            onClick={() => setCurrentTab('verify')}
            className={`text-[11px] font-mono uppercase tracking-wider py-1 ${
              currentTab === 'verify' ? 'text-[#9C815D] font-bold' : 'text-[#182C2A]/70'
            }`}
          >
            Verify
          </button>
          <button
            onClick={() => setCurrentTab('issue')}
            className={`text-[11px] font-mono uppercase tracking-wider py-1 ${
              currentTab === 'issue' ? 'text-[#9C815D] font-bold' : 'text-[#182C2A]/70'
            }`}
          >
            Issue
          </button>
          <button
            onClick={() => setCurrentTab('records')}
            className={`text-[11px] font-mono uppercase tracking-wider py-1 ${
              currentTab === 'records' ? 'text-[#9C815D] font-bold' : 'text-[#182C2A]/70'
            }`}
          >
            Records
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`text-[11px] font-mono uppercase tracking-wider py-1 ${
              currentTab === 'dashboard' ? 'text-[#9C815D] font-bold' : 'text-[#182C2A]/70'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
