
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
      <div>
        <h2 className="text-lg font-semibold text-green-800 mb-2">お気に入りレシピ</h2>
        <p className="text-sm text-gray-600">保存したお気に入りのレシピ一覧です。</p>
      </div>
      
      {favoriteRecipes.length > 0 ? (
        <div className="space-y-4">
          {favoriteRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onToggleFavorite={onToggleFavorite}
              onSelectRecipe={onSelectRecipe}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">お気に入り登録されたレシピはありません。</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
