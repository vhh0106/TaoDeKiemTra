import React, { useState, useRef } from 'react';
import { extractTextFromFile } from '../services/fileParserService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyText: (text: string) => void;
  targetFieldTitle?: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyText,
  targetFieldTitle = 'Nội dung kiến thức',
}) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      if (!text.trim()) {
        setError('File không có nội dung văn bản.');
      } else {
        setExtractedText(text.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đọc file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleApply = () => {
    if (extractedText) {
      onApplyText(extractedText);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📎</span>
            <h3 className="font-bold text-base sm:text-lg">
              Tải Lên File Tài Liệu (Word .docx / Text)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Tải lên giáo án, đề cương, bài đọc hoặc tài liệu tham khảo. Hệ thống sẽ tự động trích xuất văn bản nạp vào ô <strong>{targetFieldTitle}</strong>.
          </p>

          {/* Vùng kéo thả file */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50/80 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.md,.json,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">
              📂
            </div>
            <div>
              <p className="font-bold text-indigo-950 text-sm">
                Nhấp để chọn file hoặc kéo thả file vào đây
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Hỗ trợ định dạng: Word (.docx), Văn bản (.txt, .md)
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-indigo-600 text-sm py-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang đọc và trích xuất nội dung từ file...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {extractedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Văn bản trích xuất từ: <strong>{fileName}</strong></span>
                <span className="text-emerald-600">✓ Đã đọc {extractedText.length} ký tự</span>
              </div>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={6}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs bg-slate-50 font-mono leading-relaxed"
              />
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleApply}
            disabled={!extractedText}
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition"
          >
            ✓ Áp dụng vào {targetFieldTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
