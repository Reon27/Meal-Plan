
import React from 'react';
import type { View } from '../types';
import { FridgeIcon, RecipeBookIcon, HeartIcon, SettingsIcon } from './icons';

interface NavBarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  view: View;
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}> = ({ label, view, currentView, setView, children }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </button>
  );
};

const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] max-w-md mx-auto">
      <div className="flex justify-around">
        <NavItem label="冷蔵庫" view="inventory" currentView={currentView} setView={setView}>
          <FridgeIcon />
        </NavItem>
        <NavItem label="レシピ" view="recipes" currentView={currentView} setView={setView}>
          <RecipeBookIcon />
        </NavItem>
        <NavItem label="お気に入り" view="favorites" currentView={currentView} setView={setView}>
          <HeartIcon />
        </NavItem>
        <NavItem label="設定" view="profile" currentView={currentView} setView={setView}>
          <SettingsIcon />
        </NavItem>
      </div>
    </nav>
  );
};

export default NavBar;
