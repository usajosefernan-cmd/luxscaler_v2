import React, { useState, useEffect, useCallback } from 'react';
import ChatPanel from './components/ChatPanel';
import EditorPanel from './components/EditorPanel';
import { geminiService } from './services/geminiService';
import { Message, DocState } from './types';
import { getSupabaseClient } from '../../../services/authService';
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

  const [metrics, setMetrics] = useState({ cpu: 12, ram: 45, net: '1.2' });

  // --- EFFECTS ---

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

  // --- HANDLERS ---

  // --- HELPERS ---
  const countWords = (str: string) => str.trim().split(/\s+/).length;

  const handleToolUpdate = useCallback((newContent: string, changeLog: string) => {
    setDocState(prev => {
      const currentCount = countWords(prev.content);
      const newCount = countWords(newContent);
      const diff = newCount - currentCount;

      console.log(`🛡️ DOC UPDATE: ${currentCount} -> ${newCount} words (Diff: ${diff})`);

      // CRITICAL GUARD: Prevent massive data loss (tolerance -5%? No, user said NO DECREASE).
      // User said: "El contador de palabras SOLO puede SUBIR o mantenerse. NUNCA bajar."
      // We will apply strict mode.

      if (newCount < currentCount) {
        const errorMsg = `⚠️ SEGURIDAD DE DATOS: Actualización rechazada. \nPérdida de contenido detectada: ${currentCount} -> ${newCount} palabras.\nRegla: El contenido nunca debe disminuir. Usa 'appendSection' o revisa el truncado.`;

        // Asynchronously notify UI via messages (cannot call setMessages directly comfortably inside functional update if we want clean logic, 
        // but we can use a ref or side effect. For now, we will assume setMessages is safe to call here or use a layout effect).
        // Actually, calling setMessages inside setDocState callback is bad practice.
        // We will move logic outside.
        return prev;
      }

      return {
        ...prev,
        content: newContent,
        lastUpdated: new Date().toISOString()
      };
    });

    // Check logic again for side effects (messages)
    setDocState(currentState => {
      const currentCount = countWords(currentState.content);
      const newCountVal = countWords(newContent);

      if (newCountVal < currentCount) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'system',
          text: `🔴 **BLOQUEO DE SEGURIDAD**: Intento de reducir el documento rechazado (${currentCount} -> ${newCountVal} palabras). \nEl sistema ha protegido tus datos. Pide a la IA que use métodos incrementales.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
        return currentState; // Return same state
      }

      // Success Update
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'system',
        text: `> DOCUMENTO ACTUALIZADO: ${changeLog} (+${newCountVal - currentCount} palabras)`,
        timestamp: new Date().toLocaleTimeString()
      }]);

      return {
        ...currentState,
        content: newContent,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

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

  return (
    <div className="flex h-full w-full bg-[#050505] text-slate-300 font-mono overflow-hidden selection:bg-cyan-900/50">

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
      />

    </div>
  );
};

// export default App;