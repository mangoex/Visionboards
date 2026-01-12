import React, { useState } from 'react';
import { Board } from '../types';
import { Plus, Layout, Trash2 } from 'lucide-react';

interface SidebarProps {
  boards: Board[];
  activeBoardId: string | null;
  onSelectBoard: (id: string) => void;
  onCreateBoard: (name: string) => void;
  onDeleteBoard: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  boards, 
  activeBoardId, 
  onSelectBoard, 
  onCreateBoard,
  onDeleteBoard
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim());
      setNewBoardName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Vision AI
        </h1>
        <p className="text-xs text-gray-500 mt-1">Tu futuro, visualizado.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Mis Tableros</div>
        
        {boards.map(board => (
          <div 
            key={board.id}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeBoardId === board.id 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => onSelectBoard(board.id)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Layout size={18} className={activeBoardId === board.id ? 'text-primary' : 'text-gray-400'} />
              <span className="truncate">{board.name}</span>
            </div>
            {boards.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBoard(board.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-400 transition-all"
                title="Eliminar tablero"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}

        {isCreating ? (
          <form onSubmit={handleCreateSubmit} className="mt-2 p-2 bg-gray-50 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
            <input
              autoFocus
              type="text"
              placeholder="Nombre del tablero..."
              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary mb-2"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
              >
                Crear
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center gap-2 p-3 text-sm text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg border border-dashed border-gray-300 hover:border-primary/40 transition-all mt-2"
          >
            <Plus size={16} />
            <span>Nuevo Tablero</span>
          </button>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-center text-gray-400">
          Potenciado por Gemini 2.5 & 3
        </div>
      </div>
    </div>
  );
};

export default Sidebar;