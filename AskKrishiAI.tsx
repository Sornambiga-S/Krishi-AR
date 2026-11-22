import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, ChatMessage } from '../types';
import { aiService } from '../services/aiService';
import { 
  Bot, 
  Send, 
  Volume2, 
  RotateCcw,
  Glasses,
  Award
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface AskKrishiAIProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AskKrishiAI: React.FC<AskKrishiAIProps> = ({ setActiveTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello explorer! I am KrishiAR, your AI agricultural teacher. 🌿 I'm here to answer any questions about the crops, leaf symptoms, diseases, or experiments you're studying. What would you like to know?",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [ttsSpeaking, setTtsSpeaking] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'Why are these spots appearing?',
    'How does this disease spread?',
    'What does a healthy leaf look like?',
    'Why does the plant need sunlight?',
    'What happens if the plant gets too much water?',
    'How can I prevent this problem?'
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    playClick();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    try {
      const answer = await aiService.askFarmDoctor(q);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    } catch {
      setIsTyping(false);
    }
  };

  // Text to speech (TTS) synthesis
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (ttsSpeaking) {
      window.speechSynthesis.cancel();
      setTtsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setTtsSpeaking(false);
    utterance.onerror = () => setTtsSpeaking(false);

    setTtsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span>NATURAL LANGUAGE BOTANICAL TUTOR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          "Ask KrishiAR"
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80">
          "Ask anything about the plant you're exploring." Friendly explanations designed for students.
        </p>
      </div>

      {/* Main Chat Glass Container */}
      <div className="glass-panel rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col h-[560px]">
        
        {/* Chat Header Bar */}
        <div className="px-6 py-3.5 border-b border-emerald-500/20 bg-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5">
              <div className="w-full h-full bg-[#04140E] rounded-full flex items-center justify-center text-sm">
                🌱
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black"></span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                <span>KrishiAR Virtual Teacher</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  Online
                </span>
              </div>
              <div className="text-[11px] text-emerald-400/80 font-mono">
                Knowledge Base: Plant Pathology & Agronomy
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => { playClick(); setActiveTab('ar-learning'); }}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30"
              title="Inspect in AR"
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>AR View</span>
            </button>

            <button
              onClick={() => { playClick(); setActiveTab('quiz'); }}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-lime-500/20 hover:bg-lime-500/30 text-lime-300 text-xs font-semibold border border-lime-500/30"
              title="Test in Quiz"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>

            <button
              onClick={() => {
                playClick();
                if (ttsSpeaking) window.speechSynthesis.cancel();
                setMessages([
                  {
                    id: 'm1',
                    sender: 'ai',
                    text: "Chat reset! What plant question would you like to explore next?",
                    timestamp: 'Just now'
                  }
                ]);
              }}
              className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 hover:text-white"
              title="Clear Chat History"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm shrink-0 mt-0.5">
                    🤖
                  </div>
                )}

                <div className="space-y-1 max-w-[85%] sm:max-w-[75%]">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-emerald-950/50 border border-emerald-500/25 text-emerald-100 rounded-tl-sm'
                        : 'bg-emerald-500 text-black font-medium rounded-tr-sm shadow-md shadow-emerald-500/20'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>

                  <div className={`flex items-center space-x-2 text-[10px] font-mono text-emerald-400/60 ${isAi ? 'justify-start' : 'justify-end'}`}>
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-emerald-300 flex items-center space-x-1"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-400" />
                        <span>{ttsSpeaking ? 'Stop Audio' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-black font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
              <span>KrishiAR is synthesizing botanical insights...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Question Chips */}
        <div className="p-3 bg-emerald-950/30 border-t border-emerald-500/15 overflow-x-auto text-left">
          <div className="text-[10px] font-mono text-emerald-400/80 mb-1.5 uppercase font-semibold">
            Suggested questions:
          </div>
          <div className="flex items-center space-x-2 min-w-max">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sq)}
                className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/25 text-emerald-300 hover:border-emerald-400 hover:text-white text-xs whitespace-nowrap transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-emerald-950/60 border-t border-emerald-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuestion);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about plants, diseases, or farming..."
              className="flex-1 px-4 py-3 rounded-xl glass-input text-xs sm:text-sm placeholder-emerald-500/60"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isTyping}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
