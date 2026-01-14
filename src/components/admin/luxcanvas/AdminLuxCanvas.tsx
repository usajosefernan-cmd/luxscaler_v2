import React, { useState, useEffect, useCallback } from 'react';
import ChatPanel from './components/ChatPanel';
import EditorPanel from './components/EditorPanel';
import { geminiService } from './services/geminiService';
import { Message, DocState } from './types';
import { getSupabaseClient } from '../../../services/authService';

// Initial Document Template
const INITIAL_DOC = `<!-- GEMINI 3 PRO: DOCUMENTO DE ARQUITECTURA DEL SISTEMA -->
<!-- ESTADO: BORRADOR | NIVEL DE SEGURIDAD: ALTO -->

# Especificación Técnica

## 1. Visión General
[El alcance del sistema está actualmente indefinido. Discutir con el Arquitecto para completar.]

## 2. Infraestructura Principal
- **Cómputo:** TBD (Por definir)
- **Base de Datos:** TBD
- **Caché:** TBD

## 3. Protocolos de Seguridad
- Autenticación: TBD
- Autorización (RLS): TBD

## 4. Análisis de Costes
[Pendiente]
`;

const INITIAL_MESSAGE: Message = {
  id: 1,
  role: 'ai',
  text: 'Gemini 3 Pro [KERNEL: v9.2.1-PREVIEW] inicializado. \n\nHe cargado el contexto global para Arquitectura de Sistemas Distribuidos. Estoy listo para operar como tu Arquitecto Principal. \n\nPodemos debatir sobre seguridad, optimizar costes o implementar esquemas de Supabase.\n\nCuando acordemos un cambio, actualizaré autónomamente el documento de la derecha. ¿Empezamos con la Capa de Datos?',
  timestamp: new Date().toLocaleTimeString(),
  stats: { tokens: 45, latency: '12ms', model: 'Gemini-3-Pro' }
};

export const AdminLuxCanvas = () => {
  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingLog, setThinkingLog] = useState<string[]>([]);

  const [docState, setDocState] = useState<DocState>({
    title: 'Espec_Arquitectura_v1.md',
    content: INITIAL_DOC,
    lastUpdated: new Date().toISOString()
  });

  const [appLink, setAppLink] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyVersions, setHistoryVersions] = useState<any[]>([]);

  // --- ACTIONS ---
  const handleSaveDocument = async () => {
    // Force Save
    await saveVersionToSupabase(docState.title, docState.content, '💾 Guardado Manual por Usuario');

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      text: `✅ Documento guardado manualmente en Supabase.`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const fetchHistory = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('document_versions')
      .select('id, created_at, word_count, change_summary, version_number')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setHistoryVersions(data);
    if (error) console.error("History error", error);
  };

  const handleShowHistory = () => {
    fetchHistory();
    setShowHistory(true);
  };

  const handleRestoreVersion = (version: any) => {
    // Logic to restore content (fetching full content first) could be added here
    // For now, simple interaction
    console.log("Would restore", version);
  };

  // ... (Effects and Helpers remain)

  // ... (Render)

  return (
    <div className="flex h-full w-full bg-[#050505] text-slate-300 font-mono overflow-hidden selection:bg-cyan-900/50 relative">

      {/* Left: Chat & Controls */}
      <ChatPanel
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        thinkingLog={thinkingLog}
        metrics={metrics}
      />

      {/* Right: Document Editor */}
      <EditorPanel
        docState={docState}
        setDocContent={(content) => setDocState(prev => ({ ...prev, content }))}
        setDocTitle={(title) => setDocState(prev => ({ ...prev, title }))}
        isTyping={isTyping}
        onSave={handleSaveDocument}
        appLink={appLink}
        setAppLink={setAppLink}
        onShowHistory={handleShowHistory}
      />

      {/* HISTORY MODAL (Simple Overlay) */}
      {showHistory && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-12">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">⏳ Historial de Versiones</h2>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {historyVersions.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No hay versiones guardadas aún.</div>
              ) : (
                historyVersions.map((v) => (
                  <div key={v.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors flex justify-between items-center group">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">v{v.version_number}</span>
                        <span className="text-slate-400 text-xs">{new Date(v.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-200">{v.change_summary || "Sin resumen"}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-1">{v.word_count} palabras</div>
                      {/* Restore button placeholder 
                                      <button className="text-xs text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">Restaurar</button> 
                                      */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// export default App;