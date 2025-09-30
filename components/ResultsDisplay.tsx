
import React, { useState, useEffect } from 'react';
import type { ExamResult } from '../types';

declare const JSZip: any;

interface ResultsDisplayProps {
    result: ExamResult;
    onRegenerate: () => void;
}

type Tab = 'matrix' | 'specification' | 'exam' | 'answerKey';

const tabConfig: { id: Tab; label: string }[] = [
    { id: 'matrix', label: 'Ma trận đề' },
    { id: 'specification', label: 'Bản đặc tả' },
    { id: 'exam', label: 'Đề kiểm tra' },
    { id: 'answerKey', label: 'Đáp án & Hướng dẫn chấm' },
];

interface ParsedTable {
    headers: string[];
    rows: string[][];
}

const parseMarkdownTable = (content: string): ParsedTable | null => {
    if (!content) return null;
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const tableLines = lines.filter(line => line.trim().startsWith('|') && line.trim().endsWith('|'));
    if (tableLines.length < 2) { return null; }

    const tableData = tableLines.map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
    const separatorIndex = tableData.findIndex(cells => cells.every(cell => /^-+$/.test(cell.replace(/:/g, ''))));
    let headers: string[] = [];
    let rows: string[][] = [];

    if (separatorIndex > 0) {
        headers = tableData[separatorIndex - 1];
        rows = tableData.slice(separatorIndex + 1);
    } else if (tableData.length > 0) {
        headers = tableData[0];
        rows = tableData.slice(1);
    }

    if (headers.length === 0) { return null; }
    rows = rows.filter(row => !row.every(cell => /^-+$/.test(cell.replace(/:/g, ''))) && row.some(cell => cell.trim() !== ''));
    return { headers, rows };
};


const convertContentToHtml = (content: string): string => {
    const parsedTable = parseMarkdownTable(content);
    if (!parsedTable) {
        return `<div style="white-space: pre-wrap; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5;">${content.replace(/\n/g, '<br>')}</div>`;
    }
    const { headers, rows } = parsedTable;
    let html = '<table border="1" style="border-collapse: collapse; width: 100%; font-family: Times New Roman, serif; font-size: 12pt;">';
    if (headers.length > 0) {
        html += '<thead><tr style="background-color: #f2f2f2; font-weight: bold;">';
        headers.forEach(cell => { html += `<th style="padding: 8px; text-align: left; vertical-align: top; border: 1px solid #ccc;">${cell}</th>`; });
        html += '</tr></thead>';
    }
    if (rows.length > 0) {
        html += '<tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => { html += `<td style="padding: 8px; text-align: left; vertical-align: top; border: 1px solid #ccc;">${cell.replace(/\n/g, '<br>')}</td>`; });
            if (row.length < headers.length) {
                for (let i = 0; i < headers.length - row.length; i++) {
                    html += `<td style="padding: 8px; text-align: left; vertical-align: top; border: 1px solid #ccc;"></td>`;
                }
            }
            html += '</tr>';
        });
        html += '</tbody>';
    }
    html += '</table>';
    return html;
};


const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const parsedTable = parseMarkdownTable(content);
    if (!parsedTable) {
        return <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700">{content}</pre>;
    }
    const { headers, rows } = parsedTable;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm md:text-base border-separate border-spacing-0">
                <thead className="bg-slate-100/80 sticky top-0">
                    <tr>
                        {headers.map((cell, cellIndex) => (
                            <th key={cellIndex} scope="col" className="p-3 text-left font-semibold text-slate-800 border-b-2 border-slate-300 align-top">
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                         <tr key={rowIndex} className="even:bg-white odd:bg-slate-50/70 hover:bg-indigo-50 transition-colors">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-3 border-t border-slate-200 align-top whitespace-pre-wrap text-slate-700">
                                    {cell}
                                </td>
                            ))}
                            {row.length < headers.length && Array.from({ length: headers.length - row.length }).map((_, i) => 
                                <td key={`pad-${rowIndex}-${i}`} className="p-3 border-t border-slate-200 align-top"></td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onRegenerate }) => {
    const [activeTab, setActiveTab] = useState<Tab>('matrix');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isZipping, setIsZipping] = useState<boolean>(false);

    const contentToDisplay = result[activeTab];

    useEffect(() => {
        if (copyStatus !== 'idle') {
            const timer = setTimeout(() => setCopyStatus('idle'), 2000);
            return () => clearTimeout(timer);
        }
    }, [copyStatus]);

    const handleCopy = () => {
        navigator.clipboard.writeText(contentToDisplay).then(() => {
            setCopyStatus('success');
        }, () => {
            setCopyStatus('error');
        });
    };

    const handleExportDocx = () => {
        const tabLabel = tabConfig.find(t => t.id === activeTab)?.label || 'Export';
        const filename = `${tabLabel.replace(/ & /g, '_').replace(/ /g, '-')}.doc`;

        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${tabLabel}</title></head><body>`;
        const footer = "</body></html>";
        const sourceHTML = header + convertContentToHtml(contentToDisplay) + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = filename;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    };

    const handleDownloadZip = async () => {
        if (!result) return;
        setIsZipping(true);

        try {
            const zip = new JSZip();

            const createDocContent = (title: string, content: string) => {
                const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${title}</title></head><body>`;
                const footer = "</body></html>";
                return header + convertContentToHtml(content) + footer;
            };

            const files = [
                { name: '01_Ma-tran-de.doc', title: 'Ma trận đề', content: result.matrix },
                { name: '02_Ban-dac-ta.doc', title: 'Bản đặc tả', content: result.specification },
                { name: '03_De-kiem-tra.doc', title: 'Đề kiểm tra', content: result.exam },
                { name: '04_Dap-an.doc', title: 'Đáp án & Hướng dẫn chấm', content: result.answerKey },
            ];

            for (const file of files) {
                const docContent = createDocContent(file.title, file.content);
                zip.file(file.name, docContent);
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'Bo-de-kiem-tra.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error("Error creating ZIP file:", error);
        } finally {
            setIsZipping(false);
        }
    };


    const copyButtonText = {
        idle: 'Sao chép',
        success: 'Đã sao chép!',
        error: 'Lỗi!',
    };

    const copyButtonIcon = {
        idle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
        success: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
        error: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 p-4 gap-4">
                 <div className="w-full sm:w-auto flex flex-wrap p-1.5 bg-slate-100 rounded-xl gap-4">
                    {tabConfig.map(({ id, label }) => (
                         <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 w-full sm:w-auto px-3 py-2 font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
                                activeTab === id
                                    ? 'bg-white text-indigo-700 shadow-md'
                                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                     <button onClick={onRegenerate} title="Tạo lại" className="p-2.5 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition duration-300 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v.001" />
                        </svg>
                    </button>
                    <button onClick={handleCopy} disabled={copyStatus !== 'idle'} className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition duration-300 shadow-sm disabled:cursor-wait ${copyStatus === 'success' ? 'bg-green-500' : copyStatus === 'error' ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{copyButtonIcon[copyStatus]}</svg>
                        <span>{copyButtonText[copyStatus]}</span>
                    </button>
                    <button onClick={handleExportDocx} className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition duration-300 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>.Docx</span>
                    </button>
                    <button
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-sm disabled:bg-slate-400 disabled:cursor-wait"
                    >
                        {isZipping ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                        <span>{isZipping ? 'Đang nén...' : 'Tải ZIP'}</span>
                    </button>
                </div>
            </div>
            
            <div id="print-area" className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 print:block hidden">{tabConfig.find(t=>t.id === activeTab)?.label}</h2>
                 <div className="prose max-w-none">
                    <ContentRenderer content={contentToDisplay} />
                 </div>
                 <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
                    <p className="italic font-bold text-red-600 text-sm text-center">
                        Lưu ý: Giáo viên cần kiểm tra nội dung trước khi sử dụng nội dung này !
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;