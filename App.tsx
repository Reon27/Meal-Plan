
import React, { useState, useMemo } from 'react';
import { UserType, View, UserProfile, Ingredient, MealSet, Recipe } from './types';
// FIX: Import missing icon components
import { UserIcon, FridgeIcon, SparklesIcon, BookOpenIcon, ChevronLeftIcon, TrashIcon, ClockIcon, FireIcon } from './components/icons';
import { suggestMealSets } from './services/geminiService';
import PfcChart from './components/PfcChart';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.INVENTORY);
  const [profile, setProfile] = useState<UserProfile>({
    userType: UserType.NORMAL,
    allergens: [],
  });
  const [inventory, setInventory] = useState<Ingredient[]>([
    { id: '1', name: '鶏もも肉', expiryDate: '2024-07-28' },
    { id: '2', name: '玉ねぎ', expiryDate: '2024-08-05' },
    { id: '3', name: 'にんじん', expiryDate: '2024-08-10' },
    { id: '4', name: '醤油' },
    { id: '5', name: 'みりん' },
  ]);
  const [saleItems, setSaleItems] = useState<Ingredient[]>([]);

  const [suggestions, setSuggestions] = useState<MealSet[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const expiringSoon = inventory.filter(item => {
        if (!item.expiryDate) return false;
        const diff = new Date(item.expiryDate).getTime() - new Date().getTime();
        return diff / (1000 * 3600 * 24) <= 3;
      });
      // For simplicity, we'll just send some filters. In a real app, these would be UI controls.
      const filters = ["時短", "作りやすさ重視"];
      const result = await suggestMealSets(profile, inventory, saleItems, filters, expiringSoon);
      setSuggestions(result);
      setView(View.SUGGESTIONS);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case View.PROFILE:
        return <ProfileSetup profile={profile} setProfile={setProfile} />;
      case View.SUGGESTIONS:
        return <SuggestionsView suggestions={suggestions} onSelectRecipe={recipe => { setSelectedRecipe(recipe); setView(View.RECIPE); }} />;
      case View.RECIPE:
        return selectedRecipe ? <RecipeView recipe={selectedRecipe} userType={profile.userType} onBack={() => { setSelectedRecipe(null); setView(View.SUGGESTIONS); }} /> : <div className="text-center p-4">レシピが選択されていません。</div>;
      case View.INVENTORY:
      default:
        return <InventoryManager 
                  inventory={inventory} 
                  setInventory={setInventory}
                  saleItems={saleItems}
                  setSaleItems={setSaleItems}
                  onGetSuggestions={handleGetSuggestions}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 flex flex-col">
      {isLoading && <Loader />}
      {error && <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 animate-pulse">{error}</div>}
      
      <main className="flex-grow pb-20">
        <div className="max-w-2xl mx-auto">
          {renderView()}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-md max-w-2xl mx-auto">
        <div className="flex justify-around">
          <NavItem icon={<FridgeIcon />} label="冷蔵庫" active={view === View.INVENTORY} onClick={() => setView(View.INVENTORY)} />
          <NavItem icon={<SparklesIcon />} label="献立提案" active={view === View.SUGGESTIONS || view === View.RECIPE} onClick={() => setView(View.SUGGESTIONS)} />
          <NavItem icon={<UserIcon />} label="プロフィール" active={view === View.PROFILE} onClick={() => setView(View.PROFILE)} />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 w-full transition-colors duration-200 ${active ? 'text-emerald-500' : 'text-slate-500 hover:text-emerald-400'}`}>
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

// --- Component Definitions ---
// For better organization, these would be in separate files in a larger project.

const ProfileSetup: React.FC<{ profile: UserProfile; setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const [allergensInput, setAllergensInput] = useState(profile.allergens.join(', '));
  
  const handleSave = () => {
      const allergens = allergensInput.split(',').map(a => a.trim()).filter(Boolean);
      setProfile({ ...profile, allergens });
      alert('プロフィールを保存しました。');
  };

  return (
      <div className="p-4 space-y-6 bg-white min-h-screen">
          <h1 className="text-2xl font-bold text-slate-800">プロフィール設定</h1>
          <div className="space-y-2">
              <label className="font-semibold text-slate-600">ユーザータイプ</label>
              <div className="flex space-x-2">
                  {Object.values(UserType).map(type => (
                      <button 
                          key={type} 
                          onClick={() => setProfile({ ...profile, userType: type })}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${profile.userType === type ? 'bg-emerald-500 text-white shadow' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                      >
                          {type}
                      </button>
                  ))}
              </div>
          </div>
          <div className="space-y-2">
              <label htmlFor="allergens" className="font-semibold text-slate-600">アレルギー（カンマ区切り）</label>
              <input 
                  id="allergens"
                  type="text" 
                  value={allergensInput}
                  onChange={e => setAllergensInput(e.target.value)}
                  placeholder="例: えび, かに, 卵"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
          </div>
          <button onClick={handleSave} className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg">
              保存する
          </button>
      </div>
  );
};


const InventoryManager: React.FC<{
  inventory: Ingredient[];
  setInventory: (i: Ingredient[]) => void;
  saleItems: Ingredient[];
  setSaleItems: (i: Ingredient[]) => void;
  onGetSuggestions: () => void;
}> = ({ inventory, setInventory, saleItems, setSaleItems, onGetSuggestions }) => {
  const [newItemName, setNewItemName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [newSaleItemName, setNewSaleItemName] = useState('');
  
  const addItem = (list: Ingredient[], setList: (i: Ingredient[]) => void, name: string, expiry?: string) => {
      if(name.trim() === '') return;
      const newItem: Ingredient = { id: crypto.randomUUID(), name: name.trim() };
      if (expiry) newItem.expiryDate = expiry;
      setList([...list, newItem]);
  };
  
  const removeItem = (list: Ingredient[], setList: (i: Ingredient[]) => void, id: string) => {
      setList(list.filter(item => item.id !== id));
  };
  
  const getExpiryColor = (dateStr?: string) => {
      if (!dateStr) return 'text-slate-400';
      const diff = new Date(dateStr).getTime() - new Date().getTime();
      const days = diff / (1000 * 3600 * 24);
      if (days <= 3) return 'text-red-500 font-bold';
      if (days <= 7) return 'text-amber-500 font-semibold';
      return 'text-slate-500';
  };

  return (
      <div className="p-4 space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">冷蔵庫の中身</h1>

          <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2 text-emerald-700">食材を追加</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="食材名 (例: 鶏もも肉)" className="flex-grow p-2 border rounded-md"/>
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="p-2 border rounded-md"/>
                  <button onClick={() => { addItem(inventory, setInventory, newItemName, expiryDate); setNewItemName(''); setExpiryDate(''); }} className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition">+</button>
              </div>
              <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {inventory.map(item => (
                      <li key={item.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                          <span>{item.name}</span>
                          <div className="flex items-center gap-2">
                              <span className={`text-sm ${getExpiryColor(item.expiryDate)}`}>{item.expiryDate ? `~${item.expiryDate}` : '期限なし'}</span>
                              <button onClick={() => removeItem(inventory, setInventory, item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2 text-amber-700">今日の特売品</h2>
              <div className="flex gap-2">
                  <input type="text" value={newSaleItemName} onChange={e => setNewSaleItemName(e.target.value)} placeholder="特売品を追加 (例: 豚バラブロック)" className="flex-grow p-2 border rounded-md"/>
                  <button onClick={() => { addItem(saleItems, setSaleItems, newSaleItemName); setNewSaleItemName(''); }} className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition">+</button>
              </div>
              <ul className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                   {saleItems.map(item => (
                      <li key={item.id} className="flex justify-between items-center bg-amber-50 p-2 rounded-md">
                          <span>{item.name}</span>
                          <button onClick={() => removeItem(saleItems, setSaleItems, item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                      </li>
                  ))}
              </ul>
          </div>

          <button onClick={onGetSuggestions} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg text-lg flex items-center justify-center">
              <SparklesIcon /> <span className="ml-2">AIで献立を提案してもらう</span>
          </button>
      </div>
  );
};

const SuggestionsView: React.FC<{ suggestions: MealSet[]; onSelectRecipe: (recipe: Recipe) => void }> = ({ suggestions, onSelectRecipe }) => {
  if (suggestions.length === 0) {
    return (
      <div className="text-center p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">献立提案</h1>
        <p className="text-slate-500">冷蔵庫の食材からAIが献立を提案します。「冷蔵庫」タブから食材を登録して提案を開始してください。</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
       <h1 className="text-2xl font-bold text-slate-800">AIからの献立提案</h1>
       {suggestions.map((mealSet, index) => (
           <div key={mealSet.id} className="bg-white p-4 rounded-lg shadow-lg space-y-3 border border-slate-200">
                <h2 className="text-xl font-bold text-emerald-700">提案 {index + 1}</h2>
                <RecipeCard recipe={mealSet.main} type="主菜" onClick={() => onSelectRecipe(mealSet.main)} />
                <RecipeCard recipe={mealSet.side} type="副菜" onClick={() => onSelectRecipe(mealSet.side)} />
                <RecipeCard recipe={mealSet.soup} type="汁物" onClick={() => onSelectRecipe(mealSet.soup)} />
           </div>
       ))}
    </div>
  );
};

const RecipeCard: React.FC<{ recipe: Recipe; type: string; onClick: () => void }> = ({ recipe, type, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all duration-200 shadow-sm">
        <div className="flex justify-between items-center">
            <div>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">{type}</span>
                <p className="font-semibold text-slate-800 mt-1">{recipe.recipeName}</p>
                <p className="text-sm text-slate-500 truncate">{recipe.description}</p>
            </div>
            <ChevronLeftIcon />
        </div>
    </button>
);


const RecipeView: React.FC<{ recipe: Recipe; userType: UserType; onBack: () => void; }> = ({ recipe, userType, onBack }) => {
  const [servings, setServings] = useState(1);
  const [isCookingMode, setIsCookingMode] = useState(false);

  const adjustIngredientAmount = (amount: string, factor: number) => {
      if (factor === 1) return amount;
      const match = amount.match(/(\d+(\.\d+)?)/);
      if (match) {
          const num = parseFloat(match[1]);
          const newAmount = (num * factor).toFixed(1).replace(/\.0$/, '');
          return amount.replace(match[1], newAmount);
      }
      return amount;
  };
  
  const cookingModeClass = isCookingMode ? 'text-2xl leading-relaxed' : '';

  return (
    <div className={`p-4 bg-white min-h-screen ${cookingModeClass}`}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center text-emerald-600 font-semibold hover:text-emerald-800">
          <ChevronLeftIcon />
          <span>提案一覧に戻る</span>
        </button>
        <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm text-slate-600">クッキングモード</span>
            <div className="relative">
                <input type="checkbox" checked={isCookingMode} onChange={() => setIsCookingMode(!isCookingMode)} className="sr-only"/>
                <div className={`block w-12 h-6 rounded-full transition ${isCookingMode ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCookingMode ? 'translate-x-6' : ''}`}></div>
            </div>
        </label>
      </div>

      <h1 className={`${isCookingMode ? 'text-4xl' : 'text-3xl'} font-bold text-slate-800 mb-2`}>{recipe.recipeName}</h1>
      <p className="text-slate-600 mb-4">{recipe.description}</p>
      
      <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
          <span><ClockIcon /> {recipe.cookingTime}分</span>
          {recipe.calories && <span><FireIcon /> {recipe.calories} kcal</span>}
      </div>

      {recipe.specialNotes && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg" role="alert">
          <p className="font-bold">💡 AIからのアドバイス</p>
          <p>{recipe.specialNotes}</p>
        </div>
      )}

      {userType === UserType.DIET && recipe.pfc && (
          <div className="mb-6">
              <h2 className={`font-bold text-slate-700 mb-2 ${isCookingMode ? 'text-2xl' : 'text-xl'}`}>PFCバランス</h2>
              <PfcChart data={recipe.pfc} />
          </div>
      )}

      <div className="mb-6">
        <h2 className={`font-bold text-slate-700 mb-2 ${isCookingMode ? 'text-2xl' : 'text-xl'}`}>材料</h2>
        <div className="flex items-center gap-4 mb-2">
            <span>分量:</span>
            <div className="flex space-x-1">
            {[1, 2, 3, 4].map(s => (
                <button key={s} onClick={() => setServings(s)} className={`px-3 py-1 rounded-full text-sm ${servings === s ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                    {s}人前
                </button>
            ))}
            </div>
        </div>
        <ul className="list-none space-y-2 bg-slate-50 p-4 rounded-lg">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex justify-between border-b border-slate-200 py-1">
              <span>{ing.name}</span>
              <span className="font-medium text-slate-600">{adjustIngredientAmount(ing.amount, servings)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className={`font-bold text-slate-700 mb-2 ${isCookingMode ? 'text-2xl' : 'text-xl'}`}>作り方</h2>
        <ol className="list-decimal list-inside space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="text-slate-700 leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};


export default App;
