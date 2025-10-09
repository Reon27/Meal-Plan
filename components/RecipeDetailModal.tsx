import React from 'react';
import type { Recipe } from '../types';
import { CloseIcon, HeartIcon, HeartFilledIcon } from './icons';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (recipeId: string) => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose, onToggleFavorite }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 pt-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-4">
              <h2 id="recipe-title" className="text-2xl font-bold text-green-900">{recipe.title}</h2>
              <p className="text-gray-600 mt-1">{recipe.description}</p>
            </div>
            <div className="flex items-center space-x-0">
              <button
                onClick={() => onToggleFavorite(recipe.id)}
                className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                aria-label={recipe.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
              >
                {recipe.isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
              </button>
              <button onClick={onClose} className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition" aria-label="閉じる">
                <CloseIcon />
              </button>
            </div>
          </div>
        </header>
        
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-800 border-b-2 border-green-200 pb-2 mb-3">材料</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-800 border-b-2 border-green-200 pb-2 mb-3">作り方</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
