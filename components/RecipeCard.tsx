import React from 'react';
import type { Recipe } from '../types';
import { HeartIcon, HeartFilledIcon, ChevronRightIcon } from './icons';

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
    <li
      onClick={() => onSelectRecipe(recipe)}
      className="flex items-center p-3 pl-4 cursor-pointer active:bg-gray-100"
    >
      <button
        onClick={handleFavoriteClick}
        className="p-2 text-red-500"
        aria-label={recipe.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
      >
        {recipe.isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
      </button>
      <div className="flex-grow mx-3">
        <h3 className="font-semibold text-base text-gray-900">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{recipe.description}</p>
      </div>
      <div className="text-gray-300">
        <ChevronRightIcon />
      </div>
    </li>
  );
};

export default RecipeCard;
