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

import { ProjectLibrary } from './components/ProjectLibrary';
import { Grid } from 'lucide-react';

export const AdminLuxCanvas = () => {
  // --- STATE ---
  const [activeView, setActiveView] = useState<'library' | 'editor'>('library');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingLog, setThinkingLog] = useState<string[]>([]);

  const [docState, setDocState] = useState<DocState>({
    title: 'Espec_Arquitectura_v1.md',
    content: INITIAL_DOC,
    lastUpdated: new Date().toISOString()
  });

  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<any>(null); // To store repo info

  const [appLink, setAppLink] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyVersions, setHistoryVersions] = useState<any[]>([]);
  const [availableDocs, setAvailableDocs] = useState<string[]>([]);
  const [showDocSelector, setShowDocSelector] = useState(false);

  // --- ACTIONS ---
  const handleOpenDocumentFromLibrary = async (docId: string, title: string, project: any) => {
    setCurrentDocId(docId);
    setCurrentProject(project);
    await handleLoadDocument(title); // Reuse existing load logic for content
    setActiveView('editor');
  };

  const handlePushToGithub = async () => {
    if (!currentProject?.github_repo_url) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'system',
        text: `⚠️ **Error**: Este proyecto no está vinculado a GitHub.`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      return;
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      text: `🐙 Iniciando Push a GitHub (${currentProject.github_repo_url})...`,
      timestamp: new Date().toLocaleTimeString()
    }]);

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.functions.invoke('lux-git-sync', {
        body: {
          repoUrl: currentProject.github_repo_url,
          filePath: docState.title, // Use title as filename
          content: docState.content,
          message: `Update ${docState.title} via LuxCanvas`
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'system',
        text: `✅ **Push Exitoso**: [Ver en GitHub](${data.html_url}) commit: \`${data.commit.substring(0, 7)}\``,
        timestamp: new Date().toLocaleTimeString()
      }]);

    } catch (err: any) {
      console.error("Git Sync Error", err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'system',
        text: `❌ **Error en Push**: ${err.message || "Fallo en Edge Function"}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleSaveDocument = async () => {
    // Force Save
    await saveVersionToSupabase(docState.title, docState.content, '💾 Guardado Manual por Usuario');
    await fetchDocuments(); // Refresh list to show new title if changed

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      text: `✅ Documento guardado manualmente en Supabase.`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const fetchDocuments = async () => {
    const supabase = getSupabaseClient();
    // Hack allowing distinct titles on client side since distinct on column is tricky in simple query builder without raw SQL or Views
    // We fetch last 50 versions to get recent active docs
    const { data, error } = await supabase
      .from('document_versions')
      .select('document_title, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      // Extract unique titles
      const titles = Array.from(new Set(data.map(d => d.document_title)));
      setAvailableDocs(titles);
    }
  };

  const fetchHistory = async () => {
    if (!docState.title) return;
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('document_versions')
      .select('id, created_at, word_count, change_summary, version_number')
      .eq('document_title', docState.title) // FILTER BY CURRENT DOC
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setHistoryVersions(data);
    if (error) console.error("History error", error);
  };

  const handleLoadDocument = async (title: string) => {
    const supabase = getSupabaseClient();
    // Fetch latest version content
    const { data, error } = await supabase
      .from('document_versions')
      .select('content, change_summary')
      .eq('document_title', title)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setDocState({
        title: title,
        content: data.content,
        lastUpdated: new Date().toISOString()
      });
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'system',
        text: `📂 Documento cargado: **${title}** (Último cambio: ${data.change_summary})`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setShowDocSelector(false);
    }
  };

  const handleNewDocument = () => {
    setDocState({
      title: 'Nuevo_Documento_v1.md',
      content: INITIAL_DOC,
      lastUpdated: new Date().toISOString()
    });
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      text: `📄 Nuevo documento inicializado.`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // refresh docs on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleShowHistory = () => {
    fetchHistory();
    setShowHistory(true);
  };

  const handleRestoreVersion = (version: any) => {
    // Logic to restore content (fetching full content first) could be added here
    // For now, simple interaction
    console.log("Would restore", version);
  };

  // --- RESTORED LOGIC ---
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 45, net: '1.2' });

  // Simulate system "life" metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30) + 10,
        ram: Math.floor(Math.random() * 200) + 40,
        net: (Math.random() * 5).toFixed(1)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- HELPERS ---
  const countWords = (str: string) => str.trim().split(/\s+/).length;

  const saveVersionToSupabase = async (title: string, content: string, log: string) => {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('document_versions').insert({
        document_title: title,
        content: content,
        change_summary: log,
        document_id: currentDocId
      });
      console.log("💾 Versión guardada en Supabase");
    } catch (err) {
      console.error("Error guardando versión:", err);
    }
  };

  const handleToolUpdate = useCallback((action: string, data: any) => {
    setDocState(prev => {
      let nextContent = prev.content;
      let changeLog = "";

      if (action === 'UPDATE') {
        nextContent = data.content;
        changeLog = data.changeLog;
      } else if (action === 'APPEND') {
        nextContent = prev.content + `\n\n## ${data.title}\n\n${data.content}`;
        changeLog = `➕ Sección Añadida: ${data.title}`;
      } else {
        return prev;
      }

      // 🛡️ SECURITY GUARD
      const currentWordCount = countWords(prev.content);
      const nextWordCount = countWords(nextContent);
      const diff = nextWordCount - currentWordCount;

      console.log(`🛡️ TRANSACCIÓN: ${currentWordCount} -> ${nextWordCount} palabras (Diff: ${diff})`);

      if (nextWordCount < currentWordCount) {
        console.error("⛔ ACTUALIZACIÓN BLOQUEADA POR PÉRDIDA DE DATOS.");
        setTimeout(() => {
          setMessages(msgs => [...msgs, {
            id: Date.now(),
            role: 'system',
            text: `🔴 **BLOQUEO**: Intento de reducir contenido rechazado (${currentWordCount} -> ${nextWordCount}). Usa Append.`,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }, 0);
        return prev;
      }

      // ✅ SUCCESS
      saveVersionToSupabase(prev.title, nextContent, changeLog);

      setTimeout(() => {
        setMessages(msgs => [...msgs, {
          id: Date.now(),
          role: 'system',
          text: `> DOC ACTUALIZADO: ${changeLog} (+${diff} palabras).\n💾 Backup en Supabase OK.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 0);

      return {
        ...prev,
        content: nextContent,
        lastUpdated: new Date().toISOString()
      };
    });
  }, [currentDocId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setThinkingLog(['Cifrando payload...', 'Transmitiendo a Núcleo Neuronal...', 'Ventana de contexto: 128k activa']);

    try {
      // 2. Call Gemini
      const response = await geminiService.sendMessage(
        userMsg.text,
        docState.content,
        handleToolUpdate
      );

      // 3. Add AI Response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString(),
        stats: response.stats
      }]);

    } catch (error) {
      console.error("Interaction failed", error);
    } finally {
      setIsTyping(false);
      setThinkingLog([]);
    }
  };

  /**
   * RENDER LOGIC
   * We swap between ProjectLibrary and Editor
   */
  if (activeView === 'library') {
    return <ProjectLibrary onOpenDocument={handleOpenDocumentFromLibrary} />;
  }

  return (
    <div className="flex h-full w-full bg-[#050505] text-slate-300 font-mono overflow-hidden selection:bg-cyan-900/50 relative">

      {/* BACK TO PROJECTS BUTTON */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setActiveView('library')}
          className="bg-black/80 hover:bg-blue-900/80 text-white p-2 rounded-lg border border-slate-700 hover:border-blue-500 transition-all shadow-xl backdrop-blur-md"
          title="Volver a Proyectos"
        >
          <Grid size={20} />
        </button>
      </div>

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
        availableDocs={availableDocs}
        onLoadDocument={handleLoadDocument}
        onNewDocument={handleNewDocument}
        showDocSelector={showDocSelector}
        setShowDocSelector={setShowDocSelector}

        // NEW PROPS
        onPushToGithub={handlePushToGithub}
        hasGithubRepo={!!currentProject?.github_repo_url}
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