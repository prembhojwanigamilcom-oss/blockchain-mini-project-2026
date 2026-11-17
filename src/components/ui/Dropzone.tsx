import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, CheckCircle2, Copy, Check, RefreshCw } from 'lucide-react';
import { calculatePdfHash } from '../../utils/crypto';
import { Badge } from './Badge';

interface DropzoneProps {
  onFileHashed: (data: { file: File; hash: string; rawHash: string }) => void;
  onReset?: () => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileHashed,
  onReset,
  label = 'Academic Marksheet PDF',
  helperText = 'Select or drop an official academic marksheet in PDF format',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [fileData, setFileData] = useState<{
    file: File;
    hash: string;
    rawHash: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload an authentic marksheet in PDF format (.pdf).');
      return;
    }

    try {
      setIsHashing(true);
      const { hash, rawHash } = await calculatePdfHash(file);
      const data = { file, hash, rawHash };
      setFileData(data);
      onFileHashed(data);
    } catch (err) {
      console.error('Error computing SHA-256 hash:', err);
      alert('Failed to compute cryptographic hash from document.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const handleCopyHash = () => {
    if (fileData?.hash) {
      navigator.clipboard.writeText(fileData.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onReset) onReset();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileInput}
        disabled={disabled}
      />

      {!fileData ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-[#9C815D] bg-[#FAF9F5] scale-[0.99]'
              : 'border-[#D8D2C5] bg-[#FAF9F5]/70 hover:border-[#182C2A]/60 hover:bg-[#FAF9F5]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#F3F0E8] border border-[#D8D2C5] flex items-center justify-center text-[#182C2A] mb-4">
              {isHashing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#9C815D]" />
              ) : (
                <UploadCloud className="w-6 h-6 text-[#9C815D]" />
              )}
            </div>

            <h4 className="font-serif text-lg font-semibold text-[#182C2A]">
              {isHashing ? 'Computing Cryptographic SHA-256 Hash…' : label}
            </h4>

            <p className="text-xs text-[#182C2A]/60 mt-1 max-w-sm">
              {isHashing
                ? 'Processing document binary buffer in browser memory using Web Crypto API.'
                : helperText}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#182C2A]/5 border border-[#182C2A]/10 text-[#182C2A]/80">
                PDF Documents Only
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#9C815D]/10 border border-[#9C815D]/30 text-[#735F43]">
                Client-Side Hashing
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF9F5] border border-[#D8D2C5] p-5 shadow-subtle">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-[#182C2A]/5 border border-[#182C2A]/15 flex items-center justify-center text-[#182C2A] shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-[#9C815D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold text-sm text-[#182C2A] break-all">
                    {fileData.file.name}
                  </h5>
                  <Badge variant="authentic" dot={true}>
                    PDF Parsed
                  </Badge>
                </div>
                <p className="text-xs text-[#182C2A]/60 mt-0.5 font-mono">
                  {formatFileSize(fileData.file.size)} • Last modified:{' '}
                  {new Date(fileData.file.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#182C2A]/60 hover:text-[#8B2635] flex items-center gap-1 shrink-0 p-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          </div>

          {/* Cryptographic SHA-256 Digest Box */}
          <div className="mt-4 pt-4 border-t border-[#D8D2C5]/70 bg-[#F3F0E8]/40 p-3 border border-[#D8D2C5]/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#182C2A]/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#235347]" />
                Cryptographic SHA-256 Digest (32 Bytes):
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[11px] font-mono flex items-center gap-1 text-[#9C815D] hover:text-[#735F43] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#235347]" />
                    <span className="text-[#235347]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-[#182C2A] break-all bg-[#FAF9F5] p-2 border border-[#D8D2C5]/80 select-all">
              {fileData.hash}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
