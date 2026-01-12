import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, MessageSquarePlus, Loader2, ArrowRight } from 'lucide-react';
import { generateGoalIdeas, generateVisionImage } from '../services/geminiService';
import { GoalSuggestion } from '../types';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (url: string, prompt: string) => void;
  onAddText: (text: string, category: string) => void;
}

type Tab = 'IMAGE' | 'TEXT';

const GeneratorModal: React.FC<GeneratorModalProps> = ({ isOpen, onClose, onAddImage, onAddText }) => {
  const [activeTab, setActiveTab] = useState<Tab>('TEXT');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGoals, setGeneratedGoals] = useState<GoalSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedGoals([]);

    try {
      if (activeTab === 'IMAGE') {
        const imageUrl = await generateVisionImage(prompt);
        onAddImage(imageUrl, prompt);
        setPrompt(''); // Clear prompt after successful add
        onClose();
      } else {
        const goals = await generateGoalIdeas(prompt);
        setGeneratedGoals(goals);
      }
    } catch (e: any) {
      setError(e.message || "Ocurrió un error al generar contenido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sparkles size={20} />
            <span>Asistente IA</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 mx-4 mt-4 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('TEXT')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'TEXT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquarePlus size={16} />
            Ideas de Metas
          </button>
          <button
            onClick={() => setActiveTab('IMAGE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'IMAGE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImageIcon size={16} />
            Generar Imagen
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'TEXT' ? '¿Sobre qué tema quieres inspirarte?' : 'Describe la imagen que visualizas'}
          </label>
          <div className="relative">
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
              placeholder={activeTab === 'TEXT' ? "Ej: Crecimiento profesional en 2024, Vida saludable, Viajes..." : "Ej: Una oficina moderna con vista al mar, un atardecer en París..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            {error && (
              <div className="absolute -bottom-6 left-0 text-xs text-red-500">{error}</div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-lg font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {activeTab === 'TEXT' ? 'Pensando...' : 'Creando arte...'}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generar
              </>
            )}
          </button>

          {/* Results Area for Text */}
          {activeTab === 'TEXT' && generatedGoals.length > 0 && (
            <div className="mt-6 space-y-3 animate-in slide-in-from-bottom-4 fade-in">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sugerencias (Click para agregar)</h3>
              <div className="grid gap-2">
                {generatedGoals.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                        onAddText(g.goal, g.category);
                        // Optional: Remove from list or show added state
                    }}
                    className="flex items-start text-left gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group bg-white shadow-sm"
                  >
                    <div className="mt-0.5 p-1 rounded bg-secondary/10 text-secondary text-xs font-bold shrink-0">
                      {g.category.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{g.goal}</span>
                    <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorModal;