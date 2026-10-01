import React, { useState, useEffect } from 'react';
import type { LessonPlanFormData } from '../types';
import { generateStudentTeachingSlides } from '../services/slideGeneratorService';
import { exportTeachingSlidesToPowerPoint } from '../services/pptExportService';
import WorksheetRubricModal from './WorksheetRubricModal';

interface LessonPlanDisplayProps {
  content: string;
  formData: LessonPlanFormData;
  onRegenerate: () => void;
  onEditParameters: () => void;
}

// Convert markdown text + tables into professional HTML for Word export (.doc)
const convertLessonPlanToWordHtml = (content: string, formData: LessonPlanFormData): string => {
  const lines = content.split('\n');
  let html = '';
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    html += '<table border="1" style="border-collapse: collapse; width: 100%; margin-top: 10px; margin-bottom: 15px; font-family: \'Times New Roman\', serif; font-size: 11pt;">';

    tableRows.forEach((row, rIdx) => {
      // Check if separator row (---)
      if (row.every((cell) => /^[-:\s]+$/.test(cell))) return;

      if (rIdx === 0) {
        html += '<tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">';
        row.forEach((cell, cIdx) => {
          const width = cIdx === 0 ? '55%' : '45%';
          html += `<th style="padding: 8px 10px; border: 1px solid #94a3b8; width: ${width}; vertical-align: top; text-align: left;">${cell.replace(/<br\s*\/?>/gi, '<br/>')}</th>`;
        });
        html += '</tr>';
      } else {
        html += '<tr>';
        row.forEach((cell, cIdx) => {
          const width = cIdx === 0 ? '55%' : '45%';
          const formatted = cell
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/<br\s*\/?>/gi, '<br/>');
          html += `<td style="padding: 8px 10px; border: 1px solid #cbd5e1; width: ${width}; vertical-align: top; text-align: left;">${formatted}</td>`;
        });
        html += '</tr>';
      }
    });

    html += '</table>';
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      tableRows.push(cells);
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    if (!line) {
      html += '<br/>';
      continue;
    }

    if (line.startsWith('# ')) {
      html += `<h1 style="color: #1e3a8a; font-size: 16pt; text-align: center; font-weight: bold; margin-top: 12px; margin-bottom: 6px;">${line.replace('# ', '')}</h1>`;
    } else if (line.startsWith('## ')) {
      html += `<h2 style="color: #1e40af; font-size: 13pt; font-weight: bold; margin-top: 14px; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">${line.replace('## ', '')}</h2>`;
    } else if (line.startsWith('### ')) {
      html += `<h3 style="color: #0f172a; font-size: 12pt; font-weight: bold; margin-top: 10px; margin-bottom: 4px;">${line.replace('### ', '')}</h3>`;
    } else if (line.startsWith('```')) {
      // code block boundaries, skip or format
      continue;
    } else {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p style="margin: 3px 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.45;">${formatted}</p>`;
    }
  }

  if (inTable) {
    flushTable();
  }

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>KHBD - ${formData.lessonName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.45; color: #000; }
        h1, h2, h3 { font-family: 'Times New Roman', serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
};

// Render on screen with interactive tables and formatting
const FormattedLessonPlanRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (keyPrefix: number) => {
    if (tableHeaders.length === 0 && tableRows.length === 0) return;
    elements.push(
      <div key={`table-${keyPrefix}`} className="my-5 overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          {tableHeaders.length > 0 && (
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                {tableHeaders.map((header, hIdx) => (
                  <th
                    key={hIdx}
                    className={`p-3 text-left font-bold text-slate-800 border-r last:border-r-0 border-slate-300 ${
                      hIdx === 0 ? 'w-[55%]' : 'w-[45%]'
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-200 bg-white">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`p-3 align-top text-slate-700 leading-relaxed border-r last:border-r-0 border-slate-200 ${
                      cIdx === 0 ? 'w-[55%]' : 'w-[45%]'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: cell
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/<br\s*\/?>/gi, '<br/>'),
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeaders = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      // Check if separator
      if (cells.every((c) => /^[-:\s]+$/.test(c))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    }

    if (inTable) {
      flushTable(i);
      inTable = false;
    }

    if (!line) {
      elements.push(<div key={`br-${i}`} className="h-2" />);
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-black text-indigo-900 text-center uppercase tracking-tight my-4">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-base sm:text-lg font-bold text-indigo-800 uppercase tracking-tight mt-6 mb-2 border-b border-indigo-100 pb-1 flex items-center gap-2">
          <span>{line.replace('## ', '')}</span>
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold text-slate-800 mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('```')) {
      // Ignore raw code fence
      continue;
    } else {
      const isBold = line.startsWith('**') && line.endsWith('**');
      const isHeaderBox = line.includes('KHBD') || line.includes('TUẦN') || line.includes('Ngày soạn');

      elements.push(
        <p
          key={`p-${i}`}
          className={`text-xs sm:text-sm text-slate-700 leading-relaxed my-1 ${
            isHeaderBox ? 'font-mono text-slate-800 font-semibold' : ''
          }`}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>'),
          }}
        />
      );
    }
  }

  if (inTable) {
    flushTable(lines.length);
  }

  return <div className="space-y-1">{elements}</div>;
};

const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({
  content,
  formData,
  onRegenerate,
  onEditParameters,
}) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPptExporting, setIsPptExporting] = useState<boolean>(false);
  const [pptStatusText, setPptStatusText] = useState<string>('');
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (copyStatus !== 'idle') {
      const timer = setTimeout(() => setCopyStatus('idle'), 2500);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(
      () => setCopyStatus('success'),
      () => setCopyStatus('error')
    );
  };

  const handleExportPowerPoint = async () => {
    setIsPptExporting(true);
    setPptStatusText('AI Gemini đang chuyển hóa giáo án thành Slide bài giảng trên lớp cho học sinh...');
    try {
      const slideData = await generateStudentTeachingSlides(formData, content);
      setPptStatusText('Đang kết xuất và đóng gói file PowerPoint (.pptx)...');
      await exportTeachingSlidesToPowerPoint(slideData, formData.lessonName);
    } catch (err: any) {
      console.error('Failed to export PowerPoint:', err);
      alert(err instanceof Error ? err.message : 'Không thể tạo file PowerPoint. Vui lòng thử lại!');
    } finally {
      setIsPptExporting(false);
      setPptStatusText('');
    }
  };

  const handleExportDoc = () => {
    const filename = `KHBD_${formData.subject.replace(/\s+/g, '_')}_${formData.grade.replace(/\s+/g, '_')}_${formData.lessonName.slice(0, 30).replace(/\s+/g, '_')}.doc`;
    const sourceHTML = convertLessonPlanToWordHtml(content, formData);

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = source;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-in">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 gap-4 bg-gradient-to-r from-slate-50 to-emerald-50/40">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              KẾ HOẠCH BÀI DẠY HOÀN CHỈNH
            </span>
            <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              Sách: Kết nối tri thức với cuộc sống
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Tích hợp NLS &amp; AI
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mt-1 truncate">
            {formData.lessonName} - {formData.subject} {formData.grade}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={onEditParameters}
            title="Chỉnh sửa thông số bài dạy"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Sửa thông số</span>
          </button>

          <button
            onClick={onRegenerate}
            title="Soạn lại giáo án này"
            className="p-2 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v.001" />
            </svg>
          </button>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition ${
              copyStatus === 'success'
                ? 'bg-emerald-600'
                : copyStatus === 'error'
                ? 'bg-red-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {copyStatus === 'success' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Sao chép</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPowerPoint}
            disabled={isPptExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition active:scale-95 disabled:opacity-50"
            title="Tự động tạo bộ Slide trình chiếu bài dạy mở bằng PowerPoint"
          >
            {isPptExporting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tạo Slide...</span>
              </>
            ) : (
              <>
                <span>📊</span>
                <span>Xuất Slide (.pptx)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsWorksheetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition active:scale-95"
            title="Xem và tải Phiếu học tập & Bảng tiêu chí đánh giá năng lực Rubric"
          >
            <span>📝</span>
            <span>Phiếu học tập & Rubric</span>
          </button>

          <button
            onClick={handleExportDoc}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Tải .Docx (Mẫu chuẩn)</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition"
            title="In kế hoạch bài dạy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Banner tiến trình chuyển hóa Slide bằng Gemini */}
      {isPptExporting && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-center gap-3 text-amber-900 text-xs sm:text-sm font-semibold animate-pulse">
          <svg className="animate-spin h-5 w-5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>✨ <strong>Gemini AI đang làm việc:</strong></span>
            <span>{pptStatusText || 'Đang chuyển hóa giáo án thành Slide bài giảng tương tác cho học sinh...'}</span>
          </div>
        </div>
      )}

      {/* Lesson Plan Content Sheet matching the user's PDF */}
      <div id="lesson-plan-print" className="p-6 sm:p-10 font-sans max-w-none text-slate-800 leading-relaxed overflow-x-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <FormattedLessonPlanRenderer content={content} />
        </div>

        <div className="mt-10 pt-6 border-t border-dashed border-slate-300 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Kế hoạch bài dạy chuẩn hóa theo mẫu văn bản thực tế Bộ GD&amp;ĐT • Bộ sách Kết nối tri thức với cuộc sống
          </p>
          <p className="mt-0.5">
            Tích hợp Khung năng lực số (Thông tư 02/2025/TT-BGDĐT, Công văn 3456/BGDĐT-GDPT) &amp; Tích hợp AI có gắn mã chuẩn
          </p>
        </div>
      </div>

      <WorksheetRubricModal
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
        formData={formData}
      />
    </div>
  );
};

export default LessonPlanDisplay;
