import React, { useState, useEffect } from 'react';
import { Board, BoardItem, ItemType, NOTE_COLORS } from './types';
import Sidebar from './components/Sidebar';
import BoardItemCard from './components/BoardItemCard';
import GeneratorModal from './components/GeneratorModal';
import { Plus, Download, ImagePlus, StickyNote, Quote } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  // --- State ---
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // --- Effects ---
  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('vision_boards');
    if (saved) {
      const parsed = JSON.parse(saved);
      setBoards(parsed);
      if (parsed.length > 0) {
        setActiveBoardId(parsed[0].id);
      }
    } else {
      // Default initial board
      const initialBoard: Board = {
        id: uuidv4(),
        name: 'Mi Visión 2025',
        items: [],
        createdAt: Date.now()
      };
      setBoards([initialBoard]);
      setActiveBoardId(initialBoard.id);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem('vision_boards', JSON.stringify(boards));
    }
  }, [boards]);

  // --- Helpers ---
  const activeBoard = boards.find(b => b.id === activeBoardId);

  const updateActiveBoard = (updater: (board: Board) => Board) => {
    if (!activeBoardId) return;
    setBoards(prev => prev.map(b => b.id === activeBoardId ? updater(b) : b));
  };

  // --- Handlers ---
  const handleCreateBoard = (name: string) => {
    const newBoard: Board = {
      id: uuidv4(),
      name,
      items: [],
      createdAt: Date.now()
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  const handleDeleteBoard = (id: string) => {
    const newBoards = boards.filter(b => b.id !== id);
    setBoards(newBoards);
    if (activeBoardId === id && newBoards.length > 0) {
      setActiveBoardId(newBoards[0].id);
    } else if (newBoards.length === 0) {
       // Always keep one
       handleCreateBoard("Nuevo Tablero");
    }
  };

  const handleAddItem = (item: BoardItem) => {
    updateActiveBoard(board => ({
      ...board,
      items: [item, ...board.items] // Add to top
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    updateActiveBoard(board => ({
      ...board,
      items: board.items.filter(i => i.id !== itemId)
    }));
  };

  const onAddImage = (url: string, title: string) => {
    handleAddItem({
      id: uuidv4(),
      type: ItemType.IMAGE,
      content: url,
      title: title
    });
  };

  const onAddText = (text: string, category: string) => {
    // Pick a random color
    const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    handleAddItem({
      id: uuidv4(),
      type: ItemType.NOTE,
      content: text,
      title: category,
      color: color
    });
  };

  const handleExport = async () => {
    const element = document.getElementById('board-canvas');
    if (element) {
      try {
        const canvas = await html2canvas(element, { 
          backgroundColor: '#f3f4f6',
          scale: 2 // High res
        });
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = data;
          link.download = `vision-board-${activeBoard?.name}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (e) {
        console.error("Export failed", e);
        alert("No se pudo exportar la imagen.");
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-slate-800">
      <Sidebar 
        boards={boards} 
        activeBoardId={activeBoardId} 
        onSelectBoard={setActiveBoardId}
        onCreateBoard={handleCreateBoard}
        onDeleteBoard={handleDeleteBoard}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur px-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{activeBoard?.name}</h2>
            <p className="text-xs text-gray-500">
              {activeBoard?.items.length || 0} elementos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 font-medium text-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Agregar / Generar</span>
            </button>
            <button 
              onClick={handleExport}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
              title="Descargar imagen"
            >
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* Board Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8" id="board-scroll-area">
          {activeBoard && activeBoard.items.length > 0 ? (
            <div 
              id="board-canvas" 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)] pb-24"
            >
              {activeBoard.items.map(item => (
                <BoardItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
              ))}
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ImagePlus size={40} className="opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tu tablero está vacío</h3>
                <p className="text-center max-w-sm mb-6">
                  Comienza agregando tus metas, sueños e inspiraciones. Usa la IA para generar imágenes o sugerir frases.
                </p>
                <button 
                   onClick={() => setIsGeneratorOpen(true)}
                   className="text-primary hover:underline underline-offset-4 font-medium"
                >
                  Abrir Creador Mágico
                </button>
             </div>
          )}
        </div>

        {/* Floating Quick Actions (Optional, good for mobile) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl border border-gray-200 rounded-full px-4 py-2 flex items-center gap-4 sm:hidden z-20">
            <button onClick={() => setIsGeneratorOpen(true)} className="p-2 text-primary">
              <Plus size={24} />
            </button>
        </div>

      </main>

      <GeneratorModal 
        isOpen={isGeneratorOpen} 
        onClose={() => setIsGeneratorOpen(false)}
        onAddImage={onAddImage}
        onAddText={onAddText}
      />
    </div>
  );
};

export default App;