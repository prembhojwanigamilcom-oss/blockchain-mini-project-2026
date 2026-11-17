import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { CheckCircle2, ExternalLink, Copy, Check, Clock } from 'lucide-react';
import { formatAddress, formatHash } from '../../utils/formatters';

interface TransactionReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'success' | 'error';
  txHash: string | null;
  blockNumber?: number;
  title?: string;
  metadata?: {
    studentName?: string;
    studentRollNumber?: string;
    documentHash?: string;
    action?: string;
  };
  errorMessage?: string;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptProps> = ({
  isOpen,
  onClose,
  status,
  txHash,
  blockNumber,
  title = 'Ethereum Transaction Receipt',
  metadata,
  errorMessage,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Cryptographic proof and immutable ledger receipt"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Status Banner */}
        {status === 'pending' && (
          <div className="p-4 bg-[#F3F0E8] border border-[#D8D2C5] flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#9C815D] animate-spin" />
            <div>
              <p className="text-sm font-semibold text-[#182C2A]">
                Mining Block on Ethereum...
              </p>
              <p className="text-xs text-[#182C2A]/70">
                Awaiting node confirmation and cryptographic receipt. Please do not close this window.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-[#235347]/5 border border-[#235347]/20 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#235347] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#182C2A]">
                Transaction Confirmed & Recorded
              </p>
              <p className="text-xs text-[#182C2A]/70">
                The academic marksheet has been permanently etched into smart contract state.
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-[#8B2635]/10 border border-[#8B2635]/30">
            <p className="text-sm font-semibold text-[#8B2635]">
              Transaction Rejected or Reverted
            </p>
            <p className="text-xs text-[#182C2A]/80 mt-1">
              {errorMessage || 'The Ethereum transaction could not be completed.'}
            </p>
          </div>
        )}

        {/* Transaction Details Table */}
        {txHash && (
          <div className="border border-[#D8D2C5] bg-[#FAF9F5] divide-y divide-[#D8D2C5]/70 text-xs">
            <div className="p-3 flex items-center justify-between">
              <span className="text-[#182C2A]/60">Transaction Hash:</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[#182C2A]">{formatHash(txHash, 10)}</span>
                <button
                  onClick={handleCopy}
                  className="text-[#9C815D] hover:text-[#735F43] p-0.5"
                  title="Copy full transaction hash"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#235347]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {blockNumber && (
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#182C2A]/60">Block Number:</span>
                <span className="font-mono text-[#182C2A]">#{blockNumber}</span>
              </div>
            )}

            {metadata?.studentName && (
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#182C2A]/60">Student Name:</span>
                <span className="font-medium text-[#182C2A]">{metadata.studentName}</span>
              </div>
            )}

            {metadata?.studentRollNumber && (
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#182C2A]/60">Roll Number:</span>
                <span className="font-mono text-[#182C2A]">{metadata.studentRollNumber}</span>
              </div>
            )}

            {metadata?.documentHash && (
              <div className="p-3">
                <span className="text-[#182C2A]/60 block mb-1">On-Chain SHA-256 Digest:</span>
                <span className="font-mono text-[11px] text-[#182C2A] break-all bg-[#F3F0E8] p-1.5 block border border-[#D8D2C5]/60">
                  {metadata.documentHash}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
