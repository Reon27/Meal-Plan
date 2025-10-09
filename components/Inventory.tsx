
import React, { useState } from 'react';
import type { Ingredient } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface InventoryProps {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setInventory([...inventory, { id: crypto.randomUUID(), name: newItem.trim() }]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-green-800 mb-2">冷蔵庫の中身</h2>
        <p className="text-sm text-gray-600">持っている食材を追加してください。2つ以上入力するとレシピを検索できます。</p>
      </div>
      
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="例：豚肉、たまねぎ"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
        />
        <button type="submit" className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center shadow">
          <PlusIcon />
        </button>
      </form>
      
      {inventory.length > 0 ? (
        <ul className="space-y-2">
          {inventory.map(item => (
            <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
              <span className="text-gray-700">{item.name}</span>
              <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
         <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">まだ食材がありません。</p>
            <p className="text-gray-500 mt-1 text-sm">上の入力欄から追加してください。</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
