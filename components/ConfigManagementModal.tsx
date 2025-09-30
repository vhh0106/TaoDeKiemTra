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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in" onClick={onClose}>
            <div
                className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 m-4 space-y-8 animate-scale-in border-0"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-transform duration-200 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-bold text-indigo-700 text-center mb-2 tracking-tight">Quản lý Cấu hình</h2>

                <div className="card bg-slate-50/80 border-0 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Lưu cấu hình hiện tại</h3>
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            value={newConfigName}
                            onChange={(e) => setNewConfigName(e.target.value)}
                            placeholder="VD: Tin học 5 Giữa kỳ 1"
                            className="flex-grow block w-full px-3 py-2 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm bg-white"
                        />
                        <button
                            onClick={handleSave}
                            disabled={!newConfigName.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <span className="inline-block align-middle">Lưu</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Cấu hình đã lưu</h3>
                    {Object.keys(configurations).length === 0 ? (
                        <p className="text-slate-500 text-center py-4">Chưa có cấu hình nào được lưu.</p>
                    ) : (
                        <ul className="divide-y divide-slate-200 max-h-60 overflow-y-auto border rounded-xl bg-white/80 shadow-sm">
                            {Object.keys(configurations).map(name => (
                                <li key={name} className="flex items-center justify-between p-3 hover:bg-indigo-50 transition-colors duration-150 rounded-lg">
                                    <span className="font-medium text-slate-700 truncate max-w-[60%]">{name}</span>
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
