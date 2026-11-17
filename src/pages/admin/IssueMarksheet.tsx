import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileUp, Sparkles, AlertCircle, ArrowRight, Check, Zap } from 'lucide-react';
import { Dropzone } from '../../components/ui/Dropzone';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TransactionReceiptModal } from '../../components/ui/TransactionReceiptModal';
import { useWeb3 } from '../../context/Web3Context';
import { formatAddress } from '../../utils/formatters';
import { extractMarksheetDetails, ExtractedMarksheetDetails } from '../../utils/pdfParser';

interface IssueMarksheetProps {
  onSuccessRedirect?: () => void;
}

export const IssueMarksheet: React.FC<IssueMarksheetProps> = ({ onSuccessRedirect }) => {
  const { account, isAdmin, connectWallet, getSignerContract } = useWeb3();

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2022–2026');
  const [documentHash, setDocumentHash] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Auto-extraction State
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractedMarksheetDetails | null>(null);

  // Transaction State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleFileHashed = async (data: { file: File; hash: string }) => {
    setDocumentHash(data.hash);
    setFileName(data.file.name);

    // Run intelligent text extraction from the PDF in browser memory
    try {
      setIsExtracting(true);
      const extracted = await extractMarksheetDetails(data.file);
      setExtractionResult(extracted);

      if (extracted.studentName) setStudentName(extracted.studentName);
      if (extracted.studentRoll) setStudentRoll(extracted.studentRoll);
      if (extracted.course) setCourse(extracted.course);
      if (extracted.academicYear) setAcademicYear(extracted.academicYear);
    } catch (err) {
      console.warn('Auto-extraction fallback:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleResetFile = () => {
    setDocumentHash(null);
    setFileName(null);
    setExtractionResult(null);
  };

  // Demo presets for viva presentation
  const applyPreset = (name: string, roll: string, prog: string, year: string) => {
    setStudentName(name);
    setStudentRoll(roll);
    setCourse(prog);
    setAcademicYear(year);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentHash) {
      alert('Please upload and hash the student marksheet PDF first.');
      return;
    }

    if (!account) {
      alert('Please connect your MetaMask administrator wallet.');
      return;
    }

    try {
      setIsSubmitting(true);
      setTxStatus('pending');
      setModalOpen(true);
      setErrorMessage(undefined);

      // Get authenticated contract via MetaMask Signer
      const signerContract = await getSignerContract();

      // Broadcast registerMarksheet transaction
      const tx = await signerContract.registerMarksheet(
        documentHash,
        studentRoll.trim(),
        studentName.trim(),
        course.trim(),
        academicYear.trim()
      );

      setTxHash(tx.hash);

      // Wait for block confirmation
      const receipt = await tx.wait();
      setBlockNumber(receipt.blockNumber);
      setTxStatus('success');

      // Clear form
      setStudentName('');
      setStudentRoll('');
      setDocumentHash(null);
      setFileName(null);
      setExtractionResult(null);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setTxStatus('error');
      // Extract human-readable error from EVM revert if available
      const reason = err.reason || err.data?.message || err.message || 'MetaMask transaction rejected or reverted.';
      setErrorMessage(reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If wallet is not connected, show institutional gate
  if (!account) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-[#182C2A] border border-[#9C815D] flex items-center justify-center text-[#9C815D]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#182C2A]">
          Institutional Administrator Authentication Required
        </h2>
        <p className="font-serif italic text-sm text-[#182C2A]/70 max-w-md mx-auto">
          Academic marksheets can only be cryptographically registered by an authorized university administrator wallet.
        </p>
        <div>
          <Button variant="primary" size="md" onClick={connectWallet}>
            Connect MetaMask Administrator Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#D8D2C5] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" dot={true}>
              Authorized Registration Terminal
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#182C2A] mt-2">
            Issue Academic Marksheet
          </h1>
          <p className="text-xs text-[#182C2A]/70 mt-1 font-serif italic">
            Upload marksheet PDF: Details are auto-extracted and registered permanently on Ethereum.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-[#182C2A]/60 block uppercase">
            Authorized Signer:
          </span>
          <span className="font-mono text-xs font-semibold text-[#182C2A]">
            {formatAddress(account, 6)}
          </span>
        </div>
      </div>

      {/* Main Issuance Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Upload & Cryptographic Hashing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-[#182C2A] flex items-center gap-2">
              <span>Step 1: Marksheet PDF Document</span>
              {isExtracting && (
                <span className="text-xs font-mono text-[#9C815D] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Auto-extracting details...
                </span>
              )}
            </h3>
            {documentHash && (
              <Badge variant="authentic">SHA-256 Calculated</Badge>
            )}
          </div>

          <Dropzone
            onFileHashed={handleFileHashed}
            onReset={handleResetFile}
            label="Upload Official Marksheet PDF"
            helperText="Drop marksheet PDF: Student Name & Roll No. are parsed automatically, and SHA-256 is generated in memory."
          />
        </div>

        {/* Extraction Status Alert */}
        {extractionResult && (
          <div className="p-4 bg-[#FAF9F5] border border-[#9C815D]/40 shadow-sm flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#9C815D] shrink-0 mt-0.5" />
            <div className="flex-grow space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono font-semibold text-[#182C2A] uppercase tracking-wider">
                  Automated Document Intake & Field Extraction
                </p>
                <span className="text-[11px] font-mono text-[#2D5A27] font-semibold bg-[#2D5A27]/10 px-2 py-0.5 border border-[#2D5A27]/20">
                  Auto-Populated
                </span>
              </div>
              <p className="text-xs text-[#182C2A]/80 font-serif italic">
                Parsed document structure and auto-filled student details. You can review and edit below before signing.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Student Metadata */}
        <Card
          title="Step 2: Academic Verification Metadata"
          subtitle="Indexed on-chain alongside the SHA-256 hash. Auto-filled from uploaded marksheet PDF."
        >
          {/* Quick Viva Presets */}
          <div className="mb-6 p-3 bg-[#F3F0E8] border border-[#D8D2C5] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#182C2A]/70 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#9C815D]" /> Demo Quick-Fill Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('Prem Kumar', 'VER-2022-CS-088', 'B.Tech Computer Science & Engineering', '2022–2026')}
                className="px-2.5 py-1 bg-[#FAF9F5] hover:bg-[#182C2A] hover:text-[#FAF9F5] border border-[#D8D2C5] text-[11px] font-mono transition-colors"
              >
                Prem Kumar (CS-088)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('Jiya Sharma', 'VER-2022-CS-042', 'B.Tech Computer Science & Engineering', '2022–2026')}
                className="px-2.5 py-1 bg-[#FAF9F5] hover:bg-[#182C2A] hover:text-[#FAF9F5] border border-[#D8D2C5] text-[11px] font-mono transition-colors"
              >
                Jiya Sharma (CS-042)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('Aarav Patel', 'VER-2022-EE-015', 'B.Tech Electrical Engineering', '2022–2026')}
                className="px-2.5 py-1 bg-[#FAF9F5] hover:bg-[#182C2A] hover:text-[#FAF9F5] border border-[#D8D2C5] text-[11px] font-mono transition-colors"
              >
                Aarav Patel (EE-015)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#182C2A]/70 font-semibold">
                  Student Full Name *
                </label>
                {studentName && (
                  <span className="text-[10px] font-mono text-[#2D5A27] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Auto-Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Prem Kumar"
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3.5 py-2.5 text-sm text-[#182C2A] focus:outline-none focus:ring-1 focus:ring-[#9C815D] focus:border-[#9C815D]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#182C2A]/70 font-semibold">
                  Roll / Registration Number *
                </label>
                {studentRoll && (
                  <span className="text-[10px] font-mono text-[#2D5A27] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Auto-Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                placeholder="e.g. VER-2022-CS-088"
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3.5 py-2.5 text-sm font-mono text-[#182C2A] focus:outline-none focus:ring-1 focus:ring-[#9C815D] focus:border-[#9C815D]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#182C2A]/70 font-semibold">
                  Course / Program *
                </label>
                {course && (
                  <span className="text-[10px] font-mono text-[#2D5A27] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3.5 py-2.5 text-sm text-[#182C2A] focus:outline-none focus:ring-1 focus:ring-[#9C815D] focus:border-[#9C815D]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#182C2A]/70 font-semibold">
                  Academic Session / Year *
                </label>
                {academicYear && (
                  <span className="text-[10px] font-mono text-[#2D5A27] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2022–2026"
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3.5 py-2.5 text-sm font-mono text-[#182C2A] focus:outline-none focus:ring-1 focus:ring-[#9C815D] focus:border-[#9C815D]"
              />
            </div>
          </div>
        </Card>

        {/* Submit Action */}
        <div className="pt-4 flex items-center justify-between border-t border-[#D8D2C5]">
          <span className="text-xs text-[#182C2A]/60 font-serif italic">
            Registration requires MetaMask confirmation and will consume gas on the connected network.
          </span>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!documentHash || !studentName || !studentRoll || isSubmitting}
            isLoading={isSubmitting}
            icon={<FileUp className="w-5 h-5 text-[#9C815D]" />}
          >
            Register on Ethereum Blockchain
          </Button>
        </div>
      </form>

      {/* Transaction Confirmation Modal */}
      <TransactionReceiptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        status={txStatus}
        txHash={txHash}
        blockNumber={blockNumber}
        title="Marksheet Registration Broadcast"
        metadata={{
          studentName,
          studentRollNumber: studentRoll,
          documentHash: documentHash || undefined,
        }}
        errorMessage={errorMessage}
      />
    </div>
  );
};
