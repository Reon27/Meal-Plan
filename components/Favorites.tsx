import React from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface FavoritesProps {
  favoriteRecipes: Recipe[];
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favoriteRecipes, onToggleFavorite, onSelectRecipe }) => {
  return (
    <div className="space-y-6">
       <p className="text-sm text-gray-600 px-1">保存したお気に入りのレシピ一覧です。</p>
      
      {favoriteRecipes.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {favoriteRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onToggleFavorite={onToggleFavorite}
                onSelectRecipe={onSelectRecipe}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">お気に入り登録されたレシピはありません。</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
