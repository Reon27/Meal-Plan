import React from 'react';
import type { Recipe } from '../types';
import { HeartIcon, HeartFilledIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onToggleFavorite, onSelectRecipe }) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onToggleFavorite(recipe.id);
  };
  
  return (
    <div
      onClick={() => onSelectRecipe(recipe)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-green-900 pr-2">{recipe.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{recipe.description}</p>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="flex-shrink-0 p-2 -mr-2 -mt-2 rounded-full text-red-500 hover:bg-red-100 transition"
            aria-label={recipe.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
          >
            {recipe.isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
