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
      <p className="text-sm text-gray-600 px-1">持っている食材を追加してください。2つ以上入力するとレシピを検索できます。</p>
      
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="例：豚肉、たまねぎ"
          className="flex-grow p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition text-base"
        />
        <button type="submit" aria-label="追加" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center shadow-sm active:bg-green-700">
          <PlusIcon />
        </button>
      </form>
      
      <div className="bg-white rounded-lg border border-gray-200">
        {inventory.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {inventory.map(item => (
              <li key={item.id} className="flex justify-between items-center p-3">
                <span className="text-gray-800 text-base">{item.name}</span>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 px-4">
              <p className="text-gray-500">冷蔵庫は空です</p>
              <p className="text-gray-500 mt-1 text-sm">上の入力欄から食材を追加してください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
