import React, { useState, useEffect, useCallback } from 'react';
import ChatPanel from './components/ChatPanel';
import EditorPanel from './components/EditorPanel';
import { geminiService } from './services/geminiService';
import { Message, DocState } from './types';

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

const App = () => {
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

  const handleToolUpdate = useCallback((newContent: string, changeLog: string) => {
    setDocState(prev => ({
      ...prev,
      content: newContent,
      lastUpdated: new Date().toISOString()
    }));

    // Add a system event message to chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      text: `> EVENTO DEL SISTEMA: Documento actualizado correctamente.\n> REGISTRO DE CAMBIOS: ${changeLog}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
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
    <div className="flex h-screen bg-[#050505] text-slate-300 font-mono overflow-hidden selection:bg-cyan-900/50">
      
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

export default App;