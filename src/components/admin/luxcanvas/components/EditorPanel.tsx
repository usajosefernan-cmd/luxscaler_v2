import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position
} from 'reactflow';
import dagre from 'dagre';
import {
    FileText,
    Upload,
    Save,
    Wifi,
    Eye,
    Edit3,
    List,
    CheckCircle2,
    Clock,
    AlertCircle,
    Image as ImageIcon,
    Wand2,
    Share2
} from 'lucide-react';
import { DocState } from '../types';
import { geminiService } from '../services/geminiService';

interface EditorPanelProps {
    docState: DocState;
    setDocContent: (content: string) => void;
    setDocTitle: (title: string) => void;
    isTyping: boolean;
    onSave: () => void;
    appLink: string;
    setAppLink: (link: string) => void;
    onShowHistory: () => void;
}

// ... (Rest of code remains similar until Header)

const EditorPanel: React.FC<EditorPanelProps> = ({
    docState,
    setDocContent,
    setDocTitle,
    isTyping,
    onSave,
    appLink,
    setAppLink,
    onShowHistory
}) => {
    const [viewMode, setViewMode] = useState<'visual' | 'source'>('visual');
    const [showToc, setShowToc] = useState(true);

    // ... (Hooks remain same)

    return (
        <div className="flex-1 flex flex-col bg-[#f8f9fa] relative overflow-hidden h-full text-slate-800 font-sans">

            {/* HEADER */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-20">
                <div className="flex items-center gap-6">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <FileText size={20} className="text-blue-600" />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <input
                            value={docState.title}
                            onChange={(e) => setDocTitle(e.target.value)}
                            className="bg-transparent text-lg font-bold text-slate-800 focus:outline-none focus:underline decoration-blue-500 underline-offset-4 w-96 placeholder:text-slate-400"
                            placeholder="Documento Sin Título"
                        />
                        {/* APP LINK INPUT */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 group">
                            <Share2 size={12} className="text-slate-400 group-focus-within:text-blue-500" />
                            <input
                                value={appLink}
                                onChange={(e) => setAppLink(e.target.value)}
                                placeholder="https://tu-app-desplegada.com..."
                                className="bg-transparent focus:outline-none w-64 text-slate-500 hover:text-blue-600 focus:text-blue-700 transition-colors placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* HISTORY BUTTON */}
                    <button
                        onClick={onShowHistory}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver Historial de Versiones"
                    >
                        <Clock size={18} />
                    </button>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('visual')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Eye size={14} /> Vista Previa
                        </button>
                        <button
                            onClick={() => setViewMode('source')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'source' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Edit3 size={14} /> Código
                        </button>
                    </div>
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <Save size={14} /> GUARDAR
                    </button>
                </div>
            </div>

            <div className="flex-1 relative flex overflow-hidden">

                {/* TOC */}
                <div className={`border-r border-slate-200 bg-white flex flex-col transition-all duration-300 ease-in-out ${showToc ? 'w-64' : 'w-0 opacity-0'}`}>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tabla de Contenidos</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{sections.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {sections.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => handleScrollToSection(sec.id)}
                                className={`block w-full text-left text-xs py-1.5 px-2 rounded hover:bg-slate-50 truncate transition-colors ${sec.level === 1 ? 'font-bold text-slate-800' : 'pl-4 text-slate-600'}`}
                            >
                                {sec.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MAIN DOCUMENT */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 relative custom-scrollbar">

                    <button
                        onClick={() => setShowToc(!showToc)}
                        className="absolute top-4 left-4 z-10 p-2 bg-white border border-slate-200 text-slate-400 hover:text-blue-500 rounded shadow-sm transition-colors"
                        title="Toggle Index"
                    >
                        <List size={16} />
                    </button>

                    {/* AI STATUS */}
                    <div className="absolute top-4 right-8 flex flex-col items-end gap-2 pointer-events-none z-30">
                        <div className="bg-white/90 backdrop-blur border border-blue-100 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-slate-200/50">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 tracking-wider">SINCRONIZACIÓN_GEMINI: {isTyping ? 'ESCRIBIENDO' : 'LISTO'}</span>
                        </div>
                    </div>

                    <div className="max-w-[850px] mx-auto min-h-screen bg-white shadow-xl shadow-slate-200/50 my-8 px-12 py-16 transition-all">
                        {viewMode === 'source' ? (
                            <textarea
                                value={docState.content}
                                onChange={(e) => setDocContent(e.target.value)}
                                className="w-full h-full min-h-[800px] resize-none focus:outline-none font-mono text-sm leading-6 text-slate-600"
                                spellCheck="false"
                            />
                        ) : (
                            <div className="space-y-8">
                                {sections.map((section, idx) => (
                                    <div
                                        id={section.id}
                                        key={section.id}
                                        className={`
                                    relative pl-6 border-l-4 transition-all hover:bg-slate-50/50 rounded-r-lg p-2 group duration-500
                                    ${section.status === 'complete' ? 'border-emerald-400' : ''}
                                    ${section.status === 'pending' ? 'border-amber-400' : ''}
                                    ${section.status === 'comment' ? 'border-slate-300' : ''}
                                `}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            {section.level === 1 && <h1 className="text-3xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 w-full mt-8 mb-4">{section.title}</h1>}
                                            {section.level === 2 && <h2 className="text-xl font-bold text-slate-800 mt-6 flex items-center gap-3"><span className="text-slate-300 font-normal text-base">#{idx + 1}</span> {section.title}</h2>}
                                            {section.level >= 3 && <h3 className="text-md font-semibold text-slate-700 mt-4 uppercase tracking-wide">{section.title}</h3>}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <StatusBadge status={section.status} />
                                            </div>
                                        </div>

                                        {/* Infographic Button per Section */}
                                        {section.level >= 2 && <InfographicGenerator sectionTitle={section.title} />}

                                        {/* Advanced Content Renderer */}
                                        <SectionContentRenderer content={section.content} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="h-20"></div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="h-8 bg-slate-800 text-slate-400 flex items-center justify-between px-4 text-[10px] font-sans z-20">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-slate-300"><Wifi size={10} className="text-emerald-500" /> CONECTADO</span>
                    <span>utf-8</span>
                    <span>markdown+flow</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>{docState.content.split('\n').length} líneas</span>
                    <span>{docState.content.length} caracteres</span>
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                        <span>{completionPercentage}% Completado</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EditorPanel;