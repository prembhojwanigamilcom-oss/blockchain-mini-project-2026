import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, RefreshCw, FileText, ExternalLink, XCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useWeb3 } from '../../context/Web3Context';
import { formatAddress, formatHash, formatTimestamp } from '../../utils/formatters';

interface MarksheetRecordItem {
  documentHash: string;
  studentRollNumber: string;
  studentName: string;
  course: string;
  academicYear: string;
  issueTimestamp: number;
  issuer: string;
  status: number; // 1 = Valid, 2 = Revoked
  revocationReason: string;
  revokedTimestamp: number;
}

export const CertificateRecords: React.FC = () => {
  const { getReadOnlyContract, getSignerContract, account, isAdmin } = useWeb3();

  const [records, setRecords] = useState<MarksheetRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'revoked'>('all');

  // Revocation State
  const [selectedRecordForRevoke, setSelectedRecordForRevoke] = useState<MarksheetRecordItem | null>(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);

  // Detail Modal State
  const [selectedRecordForView, setSelectedRecordForView] = useState<MarksheetRecordItem | null>(null);

  /**
   * Loads all registered certificates from the smart contract
   */
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const contract = getReadOnlyContract();

      // Retrieve all registered hashes from the contract
      const hashes: string[] = await contract.getAllRegisteredHashes();

      const items: MarksheetRecordItem[] = [];

      // Query verification data for each hash
      for (const hash of hashes) {
        try {
          const res = await contract.verifyMarksheet(hash);
          items.push({
            documentHash: hash,
            studentRollNumber: res.studentRollNumber,
            studentName: res.studentName,
            course: res.course,
            academicYear: res.academicYear,
            issueTimestamp: Number(res.issueTimestamp),
            issuer: res.issuer,
            status: Number(res.status),
            revocationReason: res.revocationReason,
            revokedTimestamp: Number(res.revokedTimestamp),
          });
        } catch (innerErr) {
          console.warn(`Error loading record for hash ${hash}:`, innerErr);
        }
      }

      setRecords(items.reverse()); // Show newest first
    } catch (err) {
      console.error('Failed to load certificates from blockchain:', err);
    } finally {
      setLoading(false);
    }
  }, [getReadOnlyContract]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  /**
   * Executes certificate revocation via MetaMask transaction
   */
  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForRevoke || !revocationReason.trim()) return;

    try {
      setIsRevoking(true);
      const signerContract = await getSignerContract();

      const tx = await signerContract.revokeMarksheet(
        selectedRecordForRevoke.documentHash,
        revocationReason.trim()
      );

      await tx.wait(); // Wait for mining

      // Refresh records
      await loadRecords();
      setSelectedRecordForRevoke(null);
      setRevocationReason('');
      alert('Certificate was successfully revoked on the Ethereum blockchain.');
    } catch (err: any) {
      console.error('Revocation transaction failed:', err);
      alert(err.reason || err.message || 'Revocation transaction failed.');
    } finally {
      setIsRevoking(false);
    }
  };

  // Filtered records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.studentRollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.documentHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.course.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'valid' && rec.status === 1) ||
      (statusFilter === 'revoked' && rec.status === 2);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D8D2C5] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#182C2A]">
            Certificate Registry
          </h1>
          <p className="font-serif italic text-xs text-[#182C2A]/70 mt-1">
            Official immutable register of all academic marksheets etched into the blockchain.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadRecords}
          isLoading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Ledger
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF9F5] p-4 border border-[#D8D2C5]">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#182C2A]/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or SHA-256 hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-[#D8D2C5] pl-9 pr-4 py-2 text-xs text-[#182C2A] placeholder:text-[#182C2A]/40 focus:outline-none focus:ring-1 focus:ring-[#9C815D]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 border transition-all ${
              statusFilter === 'all'
                ? 'bg-[#182C2A] text-[#FAF9F5] border-[#182C2A]'
                : 'bg-transparent text-[#182C2A]/70 border-[#D8D2C5] hover:bg-[#D8D2C5]/30'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('valid')}
            className={`px-3 py-1.5 border transition-all ${
              statusFilter === 'valid'
                ? 'bg-[#182C2A] text-[#FAF9F5] border-[#182C2A]'
                : 'bg-transparent text-[#182C2A]/70 border-[#D8D2C5] hover:bg-[#D8D2C5]/30'
            }`}
          >
            Valid ({records.filter((r) => r.status === 1).length})
          </button>
          <button
            onClick={() => setStatusFilter('revoked')}
            className={`px-3 py-1.5 border transition-all ${
              statusFilter === 'revoked'
                ? 'bg-[#182C2A] text-[#FAF9F5] border-[#182C2A]'
                : 'bg-transparent text-[#182C2A]/70 border-[#D8D2C5] hover:bg-[#D8D2C5]/30'
            }`}
          >
            Revoked ({records.filter((r) => r.status === 2).length})
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-[#FAF9F5] border border-[#D8D2C5] overflow-x-auto shadow-subtle">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F3F0E8] border-b border-[#D8D2C5] text-[#182C2A]/70 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Roll Number</th>
              <th className="py-3.5 px-4">Course</th>
              <th className="py-3.5 px-4">Document SHA-256</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D2C5]/70">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#182C2A]/60">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#9C815D] mb-2" />
                  <span>Loading records from Ethereum smart contract...</span>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#182C2A]/60 font-serif italic text-sm">
                  No academic marksheets found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.documentHash} className="hover:bg-[#F3F0E8]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    {rec.status === 1 ? (
                      <Badge variant="authentic">Valid</Badge>
                    ) : (
                      <Badge variant="revoked">Revoked</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-semibold text-sm text-[#182C2A]">
                    {rec.studentName}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#182C2A]">
                    {rec.studentRollNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[#182C2A]/80 max-w-[200px] truncate">
                    {rec.course} ({rec.academicYear})
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#182C2A]/80">
                    {formatHash(rec.documentHash, 6)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#182C2A]/70">
                    {formatTimestamp(rec.issueTimestamp)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedRecordForView(rec)}
                      className="text-xs text-[#9C815D] hover:underline font-mono"
                    >
                      Inspect
                    </button>

                    {rec.status === 1 && (
                      <button
                        onClick={() => setSelectedRecordForRevoke(rec)}
                        className="text-xs text-[#8B2635] hover:underline font-mono"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Revocation Modal */}
      <Modal
        isOpen={Boolean(selectedRecordForRevoke)}
        onClose={() => setSelectedRecordForRevoke(null)}
        title="Revoke Academic Marksheet"
        subtitle="Permanent on-chain invalidation with reason"
      >
        {selectedRecordForRevoke && (
          <form onSubmit={handleRevokeSubmit} className="space-y-4">
            <div className="p-3 bg-[#8B2635]/10 border border-[#8B2635]/30 text-xs text-[#8B2635] leading-relaxed">
              <strong>Warning:</strong> Revoking is an irreversible smart contract operation. Once confirmed by MetaMask, this marksheet will permanently register as <em>REVOKED</em> on the public verification portal.
            </div>

            <div className="text-xs space-y-1 font-mono text-[#182C2A]">
              <p>
                <strong>Student:</strong> {selectedRecordForRevoke.studentName} (
                {selectedRecordForRevoke.studentRollNumber})
              </p>
              <p>
                <strong>Hash:</strong> {formatHash(selectedRecordForRevoke.documentHash, 10)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#182C2A]/70 mb-1.5 font-semibold">
                Reason for Revocation *
              </label>
              <textarea
                required
                rows={3}
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                placeholder="e.g. Administrative error in semester marks. Revised marksheet re-issued."
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] p-3 text-xs text-[#182C2A] focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecordForRevoke(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                isLoading={isRevoking}
              >
                Confirm On-Chain Revocation
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Inspect Detail Modal */}
      <Modal
        isOpen={Boolean(selectedRecordForView)}
        onClose={() => setSelectedRecordForView(null)}
        title="On-Chain Certificate Details"
        subtitle="Cryptographic coordinates and verification metadata"
      >
        {selectedRecordForView && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#D8D2C5] pb-3">
              <span className="font-mono text-[#182C2A]/60 uppercase">Current Status:</span>
              {selectedRecordForView.status === 1 ? (
                <Badge variant="authentic">Valid & Active</Badge>
              ) : (
                <Badge variant="revoked">Revoked</Badge>
              )}
            </div>

            <div className="space-y-2 border-b border-[#D8D2C5] pb-3">
              <div className="flex justify-between">
                <span className="text-[#182C2A]/60">Student Name:</span>
                <span className="font-semibold text-[#182C2A]">{selectedRecordForView.studentName}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#182C2A]/60">Roll Number:</span>
                <span className="text-[#182C2A]">{selectedRecordForView.studentRollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#182C2A]/60">Course / Degree:</span>
                <span className="text-[#182C2A]">{selectedRecordForView.course}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#182C2A]/60">Academic Year:</span>
                <span className="text-[#182C2A]">{selectedRecordForView.academicYear}</span>
              </div>
            </div>

            <div className="space-y-2 border-b border-[#D8D2C5] pb-3">
              <span className="text-[#182C2A]/60 block font-mono">SHA-256 Document Digest:</span>
              <p className="font-mono text-[11px] text-[#182C2A] break-all bg-[#F3F0E8] p-2 border border-[#D8D2C5]">
                {selectedRecordForView.documentHash}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[#182C2A]/60">Issuing Admin Wallet:</span>
                <span className="text-[#182C2A]">{selectedRecordForView.issuer}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[#182C2A]/60">Registered At:</span>
                <span className="text-[#182C2A]">{formatTimestamp(selectedRecordForView.issueTimestamp)}</span>
              </div>

              {selectedRecordForView.status === 2 && (
                <div className="mt-2 p-2.5 bg-[#8B2635]/10 border border-[#8B2635]/20">
                  <span className="text-[#8B2635] font-semibold block mb-1">Revocation Reason:</span>
                  <p className="italic text-[#182C2A]">{selectedRecordForView.revocationReason}</p>
                  <p className="text-[10px] font-mono text-[#182C2A]/60 mt-1">
                    Revoked on: {formatTimestamp(selectedRecordForView.revokedTimestamp)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedRecordForView(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
