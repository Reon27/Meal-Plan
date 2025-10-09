import React from 'react';
import type { Ingredient, Recipe, UserProfile } from '../types';
import { getRecipeSuggestions } from '../services/geminiService';
import RecipeCard from './RecipeCard';
import LoadingSpinner from './LoadingSpinner';

interface RecipeListProps {
  inventory: Ingredient[];
  profile: UserProfile;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ 
  inventory, profile, recipes, setRecipes, isLoading, setIsLoading, onToggleFavorite, onSelectRecipe 
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleFetchRecipes = async () => {
    if (inventory.length < 2) {
      setError("レシピを提案するには、少なくとも2つの材料が必要です。");
      return;
    }
    setError(null);
    setHasSearched(true);
    setIsLoading(true);
    try {
      const suggestedRecipes = await getRecipeSuggestions(inventory, profile);
      setRecipes(suggestedRecipes);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 px-1">冷蔵庫の中身から、あなたにぴったりのレシピを提案します。</p>

      <button
        onClick={handleFetchRecipes}
        disabled={isLoading || inventory.length < 2}
        className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm text-base"
      >
        {isLoading ? '検索中...' : '今日のレシピを探す'}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {isLoading && <LoadingSpinner />}
      
      {!isLoading && recipes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {recipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onToggleFavorite={onToggleFavorite} 
                onSelectRecipe={onSelectRecipe}
              />
            ))}
          </ul>
        </div>
      )}
      
      {!isLoading && recipes.length === 0 && hasSearched && !error && (
        <div className="text-center py-10 px-4 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">条件に合うレシピが見つかりませんでした。</p>
        </div>
      )}

      {!isLoading && !hasSearched && (
         <div className="text-center py-10 px-4 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">上のボタンを押してレシピを検索してください。</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
