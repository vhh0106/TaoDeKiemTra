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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 m-4 space-y-8 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h2 className="text-2xl font-bold text-indigo-700 text-center">Quản lý Cấu hình</h2>

                <div className="p-4 border rounded-lg bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Lưu cấu hình hiện tại</h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newConfigName}
                            onChange={(e) => setNewConfigName(e.target.value)}
                            placeholder="VD: Tin học 5 Giữa kỳ 1"
                            className="flex-grow block w-full px-3 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                        />
                        <button
                            onClick={handleSave}
                            disabled={!newConfigName.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            Lưu
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Cấu hình đã lưu</h3>
                    {Object.keys(configurations).length === 0 ? (
                        <p className="text-slate-500 text-center py-4">Chưa có cấu hình nào được lưu.</p>
                    ) : (
                        <ul className="divide-y divide-slate-200 max-h-60 overflow-y-auto border rounded-lg">
                            {Object.keys(configurations).map(name => (
                                <li key={name} className="flex items-center justify-between p-3 hover:bg-slate-50">
                                    <span className="font-medium text-slate-700">{name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onLoad(name)}
                                            className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                                        >
                                            Tải
                                        </button>
                                        <button
                                            onClick={() => onDelete(name)}
                                            className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition"
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
