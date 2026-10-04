import React, { useState, useEffect } from 'react';
import type { LessonPlanFormData } from '../types';
import { isEnglishSubject } from '../constants';
import WorksheetRubricModal from './WorksheetRubricModal';
import TeachingSlidesModal from './TeachingSlidesModal';
import RichTextEditor, { isHtmlContent } from './RichTextEditor';

interface LessonPlanDisplayProps {
  content: string;
  formData: LessonPlanFormData;
  onRegenerate: () => void;
  onEditParameters: () => void;
}

// Convert markdown text + tables into professional HTML for Word export (.doc)
const convertLessonPlanToWordHtml = (content: string, formData: LessonPlanFormData): string => {
  if (!content) return '';
  if (isHtmlContent(content)) {
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>KHBD - ${formData.lessonName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.45; color: #000; }
          h1, h2, h3 { font-family: 'Times New Roman', serif; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; margin-bottom: 15px; }
          th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
          th { background-color: #f1f5f9; font-weight: bold; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  }

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

    const isSectionHeading = line.startsWith('## ') ||
      /^[A-D]\.\s+[A-Z\s]+:?/i.test(line);

    const isSubHeading = line.startsWith('### ') ||
      /^[1-5]\.\s+(Knowledge|Competences|Attitudes|Qualities|Warm-up|Presentation|Practice|Production|Fun corner|Activity)/i.test(line);

    if (line.startsWith('# ')) {
      html += `<h1 style="color: #1e3a8a; font-size: 16pt; text-align: center; font-weight: bold; margin-top: 12px; margin-bottom: 6px;">${line.replace('# ', '')}</h1>`;
    } else if (isSectionHeading) {
      const headingText = line.replace(/^##\s*/, '');
      html += `<h2 style="color: #1e40af; font-size: 13pt; font-weight: bold; margin-top: 14px; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">${headingText}</h2>`;
    } else if (isSubHeading) {
      const headingText = line.replace(/^###\s*/, '');
      html += `<h3 style="color: #0f172a; font-size: 12pt; font-weight: bold; margin-top: 10px; margin-bottom: 4px;">${headingText}</h3>`;
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
  if (isHtmlContent(content)) {
    return (
      <div 
        className="font-serif text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed bg-white dark:bg-slate-900 select-text transition-colors p-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(NLS\s+[0-9a-zA-Z\.\-]+)/g, '<span class="inline-block bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">$1</span>')
      .replace(/(QĐ\s*2422(?:\/QĐ-BGDĐT)?(?::\s*Mã\s+[\d\.A-D\;\s]+)?)/g, '<span class="inline-block bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">$1</span>')
      .replace(/(Mã\s+\d+\.[A-D]\d+\.\d+(?:;\s*\d+\.[A-D]\d+\.\d+)*)/g, '<span class="inline-block bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">$1</span>')
      .replace(/(Thông tư\s*(?:số\s*)?08\/2024(?:\/TT-BGDĐT)?)/g, '<span class="inline-block bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-300 border border-red-300 dark:border-red-800 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">$1</span>')
      .replace(/(Lồng ghép GDQP&AN[^\.\:\;\*]*)/g, '<span class="inline-block bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-sans text-[11px] px-1.5 py-0.5 rounded font-semibold">$1</span>')
      .replace(/(QPAN\s+\d+\.\d+)/g, '<span class="inline-block bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">$1</span>');
  };

  const flushTable = (keyPrefix: number) => {
    if (tableHeaders.length === 0 && tableRows.length === 0) return;
    elements.push(
      <div key={`table-${keyPrefix}`} className="my-4 sm:my-6 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xs overflow-hidden">
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-slate-800 dark:to-slate-850 border-b border-slate-200 dark:border-slate-700 px-3 py-1.5 text-[11px] text-indigo-900 dark:text-indigo-300 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span>👉</span>
            <span>Vuốt ngang để xem đủ các cột tiến trình</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Bảng hoạt động</span>
        </div>

        <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
          <table className="min-w-[560px] sm:min-w-full border-collapse text-xs sm:text-sm">
            {tableHeaders.length > 0 && (
              <thead className="bg-slate-100/90 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700">
                <tr>
                  {tableHeaders.map((header, hIdx) => (
                    <th
                      key={hIdx}
                      className={`p-2.5 sm:p-3 text-left font-bold text-slate-800 dark:text-slate-200 border-r last:border-r-0 border-slate-300 dark:border-slate-700 ${
                        hIdx === 0 ? 'w-[52%]' : 'w-[48%]'
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-2.5 sm:p-3.5 align-top text-slate-700 dark:text-slate-300 leading-relaxed border-r last:border-r-0 border-slate-200 dark:border-slate-800 ${
                        cIdx === 0 ? 'w-[52%]' : 'w-[48%]'
                      }`}
                    >
                      <div
                        className="break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatText(cell).replace(/<br\s*\/?>/gi, '<br/>'),
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      elements.push(<div key={`br-${i}`} className="h-1.5" />);
      continue;
    }

    const isSectionHeading = line.startsWith('## ') ||
      /^[A-D]\.\s+[A-Z\s]+:?/i.test(line);

    const isSubHeading = line.startsWith('### ') ||
      /^[1-5]\.\s+(Knowledge|Competences|Attitudes|Qualities|Warm-up|Presentation|Practice|Production|Fun corner|Activity)/i.test(line);

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-lg sm:text-2xl font-black text-indigo-950 text-center uppercase tracking-tight my-3 sm:my-4 break-words">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (isSectionHeading) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-sm sm:text-lg font-bold text-indigo-900 uppercase tracking-tight mt-5 mb-2 border-b border-indigo-100 pb-1 flex items-center gap-2 break-words">
          <span>{line.replace(/^##\s*/, '')}</span>
        </h2>
      );
    } else if (isSubHeading) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xs sm:text-base font-bold text-slate-800 mt-3 mb-1 break-words">
          <span>{line.replace(/^###\s*/, '')}</span>
        </h3>
      );
    } else if (line.startsWith('```')) {
      // Ignore raw code fence
      continue;
    } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
      // List items with nice indentation
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 pl-1.5 sm:pl-3 py-0.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
          <span
            className="break-words"
            dangerouslySetInnerHTML={{
              __html: formatText(line.substring(2)),
            }}
          />
        </div>
      );
    } else {
      const isHeaderBox = line.includes('KHBD') || line.includes('TUẦN') || line.includes('Ngày soạn') || line.includes('Lesson plan') || line.includes('Preparing date:') || line.includes('Teaching date:') || line.startsWith('***');

      elements.push(
        <p
          key={`p-${i}`}
          className={`text-xs sm:text-sm text-slate-700 leading-relaxed my-1 break-words ${
            isHeaderBox ? 'font-mono text-slate-800 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-200' : ''
          }`}
          dangerouslySetInnerHTML={{
            __html: formatText(line),
          }}
        />
      );
    }
  }

  if (inTable) {
    flushTable(lines.length);
  }

  return <div className="space-y-0.5">{elements}</div>;
};

const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({
  content,
  formData,
  onRegenerate,
  onEditParameters,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(content);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSlidesModalOpen, setIsSlidesModalOpen] = useState<boolean>(false);
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  useEffect(() => {
    if (copyStatus !== 'idle') {
      const timer = setTimeout(() => setCopyStatus('idle'), 2500);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const handleCopy = () => {
    let textToCopy = editedContent;
    if (isHtmlContent(editedContent)) {
      const tmp = document.createElement('div');
      tmp.innerHTML = editedContent
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/tr>/gi, '\n')
        .replace(/<\/li>/gi, '\n');
      textToCopy = tmp.innerText || tmp.textContent || '';
    }
    navigator.clipboard.writeText(textToCopy).then(
      () => setCopyStatus('success'),
      () => setCopyStatus('error')
    );
  };

  const handleExportDoc = () => {
    const filename = `KHBD_${formData.subject.replace(/\s+/g, '_')}_${formData.grade.replace(/\s+/g, '_')}_${formData.lessonName.slice(0, 30).replace(/\s+/g, '_')}.doc`;
    const sourceHTML = convertLessonPlanToWordHtml(editedContent, formData);

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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in transition-colors">
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-6 py-3 sm:py-4 gap-3 bg-gradient-to-r from-slate-50 via-emerald-50/20 to-slate-50 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850">
        <div className="min-w-0 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {isEnglishSubject(formData.subject) ? (
              <>
                <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[10px] sm:text-xs font-bold rounded-full">
                  LESSON PLAN - ENGLISH
                </span>
                <span className="text-[10px] sm:text-xs text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                  Global Success
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                  Kết nối tri thức
                </span>
                <span className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                  GDPT 2018
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[10px] sm:text-xs font-bold rounded-full">
                  KẾ HOẠCH BÀI DẠY
                </span>
                <span className="text-[10px] sm:text-xs text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                  Kết nối tri thức
                </span>
                {formData.integrateDigitalCompetence && (formData.digitalDomains || []).length > 0 && (
                  <span className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                    NLS TT 02/2025
                  </span>
                )}
                {formData.integrateDigitalCompetence && (formData.integrateAi2422 ?? true) && (
                  <span className="text-[10px] sm:text-xs text-purple-700 dark:text-purple-300 font-semibold bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-md">
                    AI QĐ 2422
                  </span>
                )}
                {formData.integrateDigitalCompetence && formData.integrateQpan08 !== false && (formData.qpanThemes || []).length > 0 && (
                  <span className="text-[10px] sm:text-xs text-rose-700 dark:text-rose-300 font-semibold bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-md">
                    GDQP-AN TT 08/2024
                  </span>
                )}
              </>
            )}
          </div>
          <h2 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
            {formData.lessonName} - {formData.subject} {formData.grade}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto justify-start lg:justify-end">
          {/* Nút Chuyển chế độ Soạn thảo / Xem trước */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition shadow-xs font-bold text-xs sm:text-sm active:scale-95 cursor-pointer ${
              isEditing
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            title={isEditing ? 'Lưu và xem trước kế hoạch bài dạy' : 'Mở trình soạn thảo Rich Text để chỉnh sửa giáo án trực tiếp'}
          >
            <span>{isEditing ? '👁️' : '✏️'}</span>
            <span className="hidden sm:inline">{isEditing ? 'Xem trước' : 'Soạn thảo (Rich Text)'}</span>
            <span className="sm:hidden">{isEditing ? 'Xem' : 'Sửa'}</span>
          </button>

          <button
            onClick={() => setIsSlidesModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            title="Gemini AI chuyển hóa thành Slide bài giảng trên lớp cho học sinh kèm file PowerPoint (.pptx)"
          >
            <span>📊</span>
            <span>Xuất Slide (.pptx)</span>
          </button>

          <button
            onClick={handleExportDoc}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            title="Tải kế hoạch bài dạy chuẩn Word"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Tải Word (.docx)</span>
            <span className="sm:hidden">Word</span>
          </button>

          <button
            onClick={() => setIsWorksheetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
            title="Xem và tải Phiếu học tập & Bảng tiêu chí đánh giá năng lực Rubric"
          >
            <span>📝</span>
            <span className="hidden sm:inline">Phiếu học tập</span>
            <span className="sm:hidden">Phiếu</span>
          </button>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition active:scale-95 cursor-pointer ${
              copyStatus === 'success'
                ? 'bg-emerald-600 text-white'
                : copyStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {copyStatus === 'success' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Đã chép!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span className="hidden sm:inline">Sao chép</span>
              </>
            )}
          </button>

          <button
            onClick={onEditParameters}
            title="Chỉnh sửa thông số bài dạy"
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span className="hidden sm:inline">Sửa</span>
          </button>

          <button
            onClick={onRegenerate}
            title="Soạn lại giáo án này"
            className="p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v.001" />
            </svg>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
            title="In kế hoạch bài dạy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="p-3 sm:p-5 bg-slate-50 dark:bg-slate-950">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold">
                ✏️ Đang soạn thảo: {formData.lessonName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                (Thầy/cô có thể định dạng bảng, chữ đậm/nghiêng, chèn mục hoạt động trước khi xuất Word)
              </span>
            </div>
            {editedContent !== content && (
              <button
                onClick={() => {
                  if (window.confirm('Khôi phục lại kế hoạch bài dạy ban đầu do AI tạo?')) {
                    setEditedContent(content);
                  }
                }}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                🔄 Khôi phục giáo án gốc
              </button>
            )}
          </div>
          <RichTextEditor
            initialContent={editedContent}
            onChange={setEditedContent}
            onSave={() => setIsEditing(false)}
            onReset={editedContent !== content ? () => setEditedContent(content) : undefined}
            title="Soạn thảo KHBD"
            minHeight="600px"
            placeholder="Soạn thảo hoặc chỉnh sửa kế hoạch bài dạy tại đây..."
          />
        </div>
      ) : (
        /* Lesson Plan Content Sheet matching the user's PDF */
        <div id="lesson-plan-print" className="p-3.5 sm:p-8 font-sans max-w-none text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-4">
            <FormattedLessonPlanRenderer content={editedContent} />
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Kế hoạch bài dạy chuẩn hóa theo mẫu văn bản thực tế Bộ GD&amp;ĐT • Bộ sách Kết nối tri thức với cuộc sống
            </p>
            <p className="mt-0.5">
              Tích hợp Khung năng lực số (Thông tư 02/2025/TT-BGDĐT, Công văn 3456/BGDĐT-GDPT) &amp; Tích hợp AI có gắn mã chuẩn
            </p>
          </div>
        </div>
      )}

      <WorksheetRubricModal
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
        formData={formData}
      />

      <TeachingSlidesModal
        isOpen={isSlidesModalOpen}
        onClose={() => setIsSlidesModalOpen(false)}
        formData={formData}
        lessonPlanContent={editedContent}
      />
    </div>
  );
};

export default LessonPlanDisplay;
