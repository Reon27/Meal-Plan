import React, { useState } from 'react';
import { View, Ingredient, Recipe, UserProfile } from './types';
import Inventory from './components/Inventory';
import RecipeList from './components/RecipeList';
import Favorites from './components/Favorites';
import Profile from './components/Profile';
import NavBar from './components/NavBar';
import RecipeDetailModal from './components/RecipeDetailModal';

const pageTitles: Record<View, string> = {
  inventory: '冷蔵庫',
  recipes: 'レシピ提案',
  favorites: 'お気に入り',
  profile: '設定',
};

export default function App() {
  const [view, setView] = useState<View>('inventory');
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ goal: 'standard' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleFavorite = (recipeId: string) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
     if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe({ ...selectedRecipe, isFavorite: !selectedRecipe.isFavorite });
    }
  };
  
  const favoriteRecipes = recipes.filter(r => r.isFavorite);

  const renderView = () => {
    switch (view) {
      case 'inventory':
        return <Inventory inventory={inventory} setInventory={setInventory} />;
      case 'recipes':
        return <RecipeList 
                  inventory={inventory} 
                  profile={profile} 
                  recipes={recipes}
                  setRecipes={setRecipes}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onToggleFavorite={toggleFavorite}
                  onSelectRecipe={setSelectedRecipe}
                />;
      case 'favorites':
        return <Favorites 
                  favoriteRecipes={favoriteRecipes} 
                  onToggleFavorite={toggleFavorite}
                  onSelectRecipe={setSelectedRecipe} 
                />;
      case 'profile':
        return <Profile profile={profile} setProfile={setProfile} />;
      default:
        return <Inventory inventory={inventory} setInventory={setInventory} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col max-w-md mx-auto">
      <header className="bg-gray-100/80 backdrop-blur-lg sticky top-0 z-10 pt-safe-top">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-black">{pageTitles[view]}</h1>
        </div>
      </header>
      
      <main className="flex-grow w-full p-4 pt-0">
        {renderView()}
      </main>
      
      <div className="pb-safe-bottom">
        <NavBar currentView={view} setView={setView} />
      </div>

      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onToggleFavorite={toggleFavorite} 
        />
      )}
    </div>
  );
}