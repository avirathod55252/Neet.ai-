import React, { useState, useRef, useEffect } from 'react';
import { getChatResponseStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Upload, User, Bot, Loader2, Image as ImageIcon, X } from 'lucide-react';

export const DoubtSolver: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your NEET Prep AI. Stuck on a Physics numerical or confusing Bio concept? Ask me, or upload a photo of the question!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isStreaming) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsStreaming(true);

    // Prepare image part if exists
    let imagePart = undefined;
    if (selectedImage && imagePreview) {
       // Extract base64
       const base64Data = imagePreview.split(',')[1];
       imagePart = {
          inlineData: {
             data: base64Data,
             mimeType: selectedImage.type
          }
       };
       // Clear image after sending
       clearImage();
    }

    // Add placeholder for model response
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isLoading: true
    }]);

    try {
      // Build history for context (excluding the message we just sent manually)
      // Filter out the initial welcome message (id: '1') to avoid sending a model-first history
      // which can cause API errors.
      const history = messages
        .filter(m => m.id !== '1')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const result = await getChatResponseStream(history, newUserMsg.text, imagePart);

      let fullText = '';
      
      // Iterate directly over the result (it is the AsyncIterable), not result.stream
      for await (const chunk of result) {
        const textChunk = chunk.text; // Access .text property, not method
        
        if (textChunk) {
          fullText += textChunk;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId 
              ? { ...msg, text: fullText, isLoading: false }
              : msg
          ));
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text: "I encountered an error connecting to the AI. Please check your network or API key.", isLoading: false }
          : msg
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.text}
                {msg.isLoading && (
                  <span className="inline-block w-2 h-2 ml-1 bg-slate-400 rounded-full animate-bounce"></span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img src={imagePreview} alt="Selected" className="h-20 w-auto rounded-lg border border-slate-300 shadow-sm" />
            <button 
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
           <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              id="image-upload"
              onChange={handleImageSelect}
              disabled={isStreaming}
            />
            <label 
              htmlFor="image-upload"
              className={`flex items-center justify-center w-12 h-12 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-emerald-600 cursor-pointer transition-colors ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ImageIcon className="w-5 h-5" />
            </label>
           </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a doubt or paste a question..."
            className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isStreaming}
            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-600 text-white transition-all shadow-md hover:shadow-emerald-200 hover:bg-emerald-700 ${
              (!input.trim() && !selectedImage) || isStreaming ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};