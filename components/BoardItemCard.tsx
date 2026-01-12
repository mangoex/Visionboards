import React from 'react';
import { BoardItem, ItemType } from '../types';
import { X, Type as TypeIcon, Image as ImageIcon } from 'lucide-react';

interface BoardItemProps {
  item: BoardItem;
  onDelete: (id: string) => void;
}

const BoardItemCard: React.FC<BoardItemProps> = ({ item, onDelete }) => {
  const isImage = item.type === ItemType.IMAGE;

  return (
    <div 
      className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        isImage ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'
      } ${!isImage ? item.color : 'bg-gray-100'} min-h-[160px] flex flex-col`}
    >
      {/* Type Indicator Icon (Subtle) */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-full text-xs">
        {isImage ? <ImageIcon size={14} className="text-gray-600" /> : <TypeIcon size={14} className="text-gray-600" />}
      </div>

      {/* Delete Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
      >
        <X size={16} />
      </button>

      {/* Content */}
      {isImage ? (
        <div className="w-full h-full relative">
          <img 
            src={item.content} 
            alt="Vision" 
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
             {item.title && <p className="text-white text-sm font-medium truncate">{item.title}</p>}
          </div>
        </div>
      ) : (
        <div className="p-5 flex flex-col h-full justify-between">
          <div className="font-handwriting text-slate-800 text-lg leading-relaxed font-medium" style={{ fontFamily: 'cursive' }}>
            "{item.content}"
          </div>
          {item.title && (
            <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500 border-t border-slate-200/50 pt-2">
              {item.title}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardItemCard;