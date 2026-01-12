export enum ItemType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  NOTE = 'NOTE'
}

export interface BoardItem {
  id: string;
  type: ItemType;
  content: string; // URL for image, text content for text
  title?: string; // Optional title for notes
  color?: string; // Background color for notes
  width?: string; // For grid spanning (col-span)
  height?: string; // For grid spanning (row-span)
}

export interface Board {
  id: string;
  name: string;
  items: BoardItem[];
  createdAt: number;
}

export interface GoalSuggestion {
  category: string;
  goal: string;
}

// Colors for sticky notes
export const NOTE_COLORS = [
  'bg-yellow-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-pink-100',
  'bg-purple-100',
  'bg-orange-100'
];
