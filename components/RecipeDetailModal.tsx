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
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
    >
      <div 
        className="bg-gray-100 rounded-t-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex-shrink-0 text-center relative border-b border-gray-200">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-300 rounded-full"></div>
          <h2 id="recipe-title" className="text-lg font-semibold text-gray-800 pt-4 truncate">{recipe.title}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300" aria-label="閉じる">
              <CloseIcon />
          </button>
        </header>
        
        <div className="p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 mt-1">{recipe.description}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 px-1">材料</h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index} className="p-3 text-gray-700">{ing}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 px-1">作り方</h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <ol className="list-decimal list-outside space-y-4 text-gray-700 p-4 pl-8">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <footer className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-100/80 backdrop-blur-lg">
           <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors text-base flex items-center justify-center gap-2 ${recipe.isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-800'}`}
              aria-label={recipe.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
            >
              {recipe.isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
              {recipe.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
