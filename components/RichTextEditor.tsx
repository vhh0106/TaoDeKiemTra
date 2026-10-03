import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (htmlContent: string) => void;
  onSave?: () => void;
  onReset?: () => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  title?: string;
}

/**
 * Detect if content is already HTML
 */
export const isHtmlContent = (str: string): boolean => {
  if (!str) return false;
  const s = str.trim();
  return (
    s.startsWith('<') &&
    (s.startsWith('<table') ||
      s.startsWith('<div') ||
      s.startsWith('<p') ||
      s.startsWith('<h1') ||
      s.startsWith('<h2') ||
      s.startsWith('<h3') ||
      s.startsWith('<ul') ||
      s.startsWith('<ol') ||
      s.includes('</table>') ||
      s.includes('</p>') ||
      s.includes('</div>'))
  );
};

/**
 * Convert standard markdown + tables into rich HTML so contentEditable can edit visually.
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  // If already HTML, return as-is
  if (isHtmlContent(markdown)) {
    return markdown;
  }

  const lines = markdown.split('\n');
  let html = '';
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    html += '<table style="border-collapse: collapse; width: 100%; margin: 16px 0; border: 1px solid #cbd5e1;">';

    tableRows.forEach((row, rIdx) => {
      // Skip markdown separator
      if (row.every(cell => /^[-:\s]+$/.test(cell))) return;

      if (rIdx === 0) {
        html += '<thead style="background-color: #f1f5f9;"><tr style="border-bottom: 2px solid #cbd5e1;">';
        row.forEach(cell => {
          html += `<th style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold;">${cell}</th>`;
        });
        html += '</tr></thead><tbody>';
      } else {
        html += '<tr style="border-bottom: 1px solid #e2e8f0;">';
        row.forEach(cell => {
          const formatted = cell
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          html += `<td style="padding: 10px 12px; border: 1px solid #cbd5e1; vertical-align: top;">${formatted}</td>`;
        });
        html += '</tr>';
      }
    });

    if (tableRows.length > 0) {
      html += '</tbody>';
    }
    html += '</table>';
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Table row detector
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    if (!line) {
      html += '<p><br></p>';
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      html += `<h3 style="font-size: 1.15rem; font-weight: bold; margin: 14px 0 6px 0; color: #1e3a8a;">${line.replace('### ', '')}</h3>`;
    } else if (line.startsWith('## ')) {
      html += `<h2 style="font-size: 1.35rem; font-weight: bold; margin: 18px 0 8px 0; color: #1e40af; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${line.replace('## ', '')}</h2>`;
    } else if (line.startsWith('# ')) {
      html += `<h1 style="font-size: 1.6rem; font-weight: bold; margin: 20px 0 10px 0; text-align: center; color: #1e3a8a;">${line.replace('# ', '')}</h1>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const itemText = line.replace(/^[-*]\s+/, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p style="margin: 4px 0 4px 18px;">• ${itemText}</p>`;
    } else if (/^(Câu|CÂU|Question|QUESTION)\s+\d+[:.]/i.test(line)) {
      html += `<p style="margin: 12px 0 4px 0; font-weight: bold; color: #1e3a8a;">${line}</p>`;
    } else if (/^[A-D]\.\s+/i.test(line)) {
      html += `<p style="margin: 3px 0 3px 20px;"><strong>${line.slice(0, 2)}</strong> ${line.slice(2)}</p>`;
    } else {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p style="margin: 6px 0; line-height: 1.6;">${formatted}</p>`;
    }
  }

  if (inTable) {
    flushTable();
  }

  return html;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent,
  onChange,
  onSave,
  onReset,
  placeholder = 'Nhập hoặc chỉnh sửa nội dung tại đây...',
  minHeight = '450px',
  className = '',
  title = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [fontFamily, setFontFamily] = useState("'Times New Roman', serif");
  const [fontSize, setFontSize] = useState('3'); // 3 = 12pt in browser execCommand
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('transparent');

  const updateStats = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    setCharCount(text.length);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, []);

  // Convert initial markdown/html into editor innerHTML on mount or when external initialContent changes
  useEffect(() => {
    if (editorRef.current && initialContent !== lastHtmlRef.current) {
      const html = markdownToHtml(initialContent);
      editorRef.current.innerHTML = html;
      lastHtmlRef.current = initialContent;
      updateStats();
    }
  }, [initialContent, updateStats]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtmlRef.current = html;
      onChange(html);
      updateStats();
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleFormatBlock = (tag: string) => {
    executeCommand('formatBlock', `<${tag}>`);
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    executeCommand('fontName', font);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    executeCommand('fontSize', size);
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  const handleHighlightChange = (color: string) => {
    setHighlightColor(color);
    executeCommand('hiliteColor', color);
  };

  // Insert Table feature
  const insertTable = (rows: number = 3, cols: number = 3) => {
    let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 12px 0; border: 1px solid #cbd5e1;">';
    tableHtml += '<thead style="background-color: #f1f5f9;"><tr>';
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8px 10px; font-weight: bold; text-align: left;">Tiêu đề ${c + 1}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += '<td style="border: 1px solid #cbd5e1; padding: 8px 10px; vertical-align: top;">Nội dung</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    executeCommand('insertHTML', tableHtml);
  };

  return (
    <div
      className={`border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-3 sm:inset-6 z-50 shadow-2xl flex flex-col' : ''
      } ${className}`}
    >
      {/* Top Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5 shrink-0 select-none">
        {title && (
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mr-1 hidden sm:block">
            {title}
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            ↩️
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            ↪️
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Heading Style Select */}
        <select
          onChange={(e) => handleFormatBlock(e.target.value)}
          className="text-xs font-semibold py-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          title="Định dạng đoạn văn bản"
        >
          <option value="p">Đoạn văn (Normal)</option>
          <option value="h1">Tiêu đề lớn (H1)</option>
          <option value="h2">Tiêu đề vừa (H2)</option>
          <option value="h3">Tiêu đề nhỏ (H3)</option>
          <option value="blockquote">Trích dẫn (Quote)</option>
        </select>

        {/* Font Family Select */}
        <select
          value={fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="text-xs font-semibold py-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs hidden md:block cursor-pointer"
          title="Phông chữ"
        >
          <option value="'Times New Roman', serif">Times New Roman (Chuẩn GD)</option>
          <option value="'Arial', sans-serif">Arial</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Courier New', monospace">Courier (Đơn cách)</option>
        </select>

        {/* Font Size Select */}
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="text-xs font-semibold py-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          title="Cỡ chữ"
        >
          <option value="2">Nhỏ (10pt)</option>
          <option value="3">Chuẩn (12pt)</option>
          <option value="4">Vừa (14pt)</option>
          <option value="5">Lớn (16pt)</option>
          <option value="6">Rất lớn (18pt)</option>
        </select>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Basic text formatting: Bold, Italic, Underline, Strike */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded font-black text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
            title="In đậm (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded italic font-serif text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
            title="In nghiêng (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded underline text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
            title="Gạch chân (Ctrl+U)"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded line-through text-xs text-slate-800 dark:text-slate-100 hidden sm:inline-block cursor-pointer"
            title="Gạch ngang"
          >
            S
          </button>
        </div>

        {/* Superscript / Subscript (Toán & Hóa học: x², H₂O) */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand('superscript')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 font-semibold cursor-pointer"
            title="Chỉ số trên (Toán: x²)"
          >
            x²
          </button>
          <button
            type="button"
            onClick={() => executeCommand('subscript')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 font-semibold cursor-pointer"
            title="Chỉ số dưới (Hóa: H₂O)"
          >
            x₂
          </button>
        </div>

        {/* Text Color / Highlight */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <label className="relative flex items-center px-1 cursor-pointer" title="Màu chữ">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mr-1">A</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="w-4 h-4 p-0 border-0 rounded cursor-pointer"
            />
          </label>
          <label className="relative flex items-center px-1 cursor-pointer" title="Màu nền Highlight">
            <span className="text-[10px] font-bold text-amber-500 mr-1">🖍️</span>
            <input
              type="color"
              value={highlightColor === 'transparent' ? '#ffff00' : highlightColor}
              onChange={(e) => handleHighlightChange(e.target.value)}
              className="w-4 h-4 p-0 border-0 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Alignment */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Căn trái"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Căn giữa"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /></svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Căn phải"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyFull')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 hidden sm:inline-block cursor-pointer"
            title="Căn đều 2 bên (Chuẩn văn bản GD)"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* Lists & Indents */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Danh sách gạch đầu dòng"
          >
            • Danh sách
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Danh sách thứ tự 1, 2, 3"
          >
            1. 2. 3.
          </button>
        </div>

        {/* Table & Tools */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => insertTable(3, 4)}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
            title="Chèn bảng mới (3 hàng x 4 cột)"
          >
            <span>📊</span>
            <span className="hidden lg:inline">Chèn bảng</span>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline-block cursor-pointer"
            title="Chèn đường phân cách"
          >
            ➖ Đường kẻ
          </button>
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 cursor-pointer"
            title="Xóa định dạng"
          >
            🧹
          </button>
        </div>

        {/* Action Buttons: onSave, onReset, Fullscreen */}
        <div className="ml-auto flex items-center gap-1.5">
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
              title="Lưu chỉnh sửa và xem trước"
            >
              <span>💾</span>
              <span>Lưu &amp; Xem trước</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
              title="Khôi phục nội dung gốc ban đầu"
            >
              Khôi phục gốc
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow-2xs transition active:scale-95 cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ lại' : 'Toàn màn hình để soạn thảo thoải mái'}
          >
            <span>{isFullscreen ? '🗗' : '🖥️'}</span>
            <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Canvas (A4 sheet styling) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-8 bg-slate-100/70 dark:bg-slate-950/70 flex justify-center">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight, fontFamily }}
          className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200/90 dark:border-slate-800 p-5 sm:p-12 text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Trình soạn thảo văn bản phong phú (WYSIWYG)
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden md:inline">Thầy/cô có thể sửa trực tiếp câu hỏi, đáp án, bảng ma trận...</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} từ</span>
          <span>•</span>
          <span>{charCount} ký tự</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
