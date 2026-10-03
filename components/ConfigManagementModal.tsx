import React, { useState } from 'react';
import type { ExamFormData } from '../types';

interface ConfigManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    configurations: Record<string, ExamFormData>;
    onSave: (name: string) => void;
    onLoad: (name: string) => void;
    onDelete: (name: string) => void;
}

const ConfigManagementModal: React.FC<ConfigManagementModalProps> = ({
    isOpen,
    onClose,
    configurations,
    onSave,
    onLoad,
    onDelete,
}) => {
    const [newConfigName, setNewConfigName] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (newConfigName.trim()) {
            onSave(newConfigName.trim());
            setNewConfigName('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-3 sm:p-4" onClick={onClose}>
            <div
                className="relative bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 m-2 sm:m-4 space-y-5 sm:space-y-6 rounded-2xl sm:rounded-3xl shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3.5 right-3.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform duration-200 p-1" aria-label="Đóng">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-400 text-center tracking-tight">Quản lý Cấu hình</h2>

                <div className="bg-slate-50/90 dark:bg-slate-850/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">Lưu cấu hình hiện tại</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                        <input
                            type="text"
                            value={newConfigName}
                            onChange={(e) => setNewConfigName(e.target.value)}
                            placeholder="VD: Tin học 5 Giữa kỳ 1"
                            className="flex-grow block w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 rounded-xl shadow-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        />
                        <button
                            onClick={handleSave}
                            disabled={!newConfigName.trim()}
                            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-xs hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="inline-block align-middle">Lưu</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Cấu hình đã lưu</h3>
                    {Object.keys(configurations).length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-4">Chưa có cấu hình nào được lưu.</p>
                    ) : (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-800 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white/80 dark:bg-slate-850/80 shadow-sm">
                            {Object.keys(configurations).map(name => (
                                <li key={name} className="flex items-center justify-between p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors duration-150 rounded-lg">
                                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[60%]">{name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onLoad(name)}
                                            className="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md shadow hover:scale-105 transition-transform duration-200"
                                        >
                                            Tải
                                        </button>
                                        <button
                                            onClick={() => onDelete(name)}
                                            className="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-md shadow hover:scale-105 transition-transform duration-200"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfigManagementModal;
