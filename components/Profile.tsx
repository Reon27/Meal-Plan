import React from 'react';
import type { UserProfile } from '../types';
import { CheckIcon } from './icons';

interface ProfileProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const handleGoalChange = (newGoal: 'standard' | 'diet' | 'pregnancy') => {
    setProfile({ ...profile, goal: newGoal });
  };
  
  const options = [
    { value: 'standard', label: '標準' },
    { value: 'diet', label: 'ダイエット' },
    { value: 'pregnancy', label: '妊娠中' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 px-1">レシピ提案の目的を設定してください。</p>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {options.map((option) => (
             <label key={option.value} onClick={() => handleGoalChange(option.value as 'standard' | 'diet' | 'pregnancy')} className="flex justify-between items-center p-4 cursor-pointer active:bg-gray-100">
                <span className="text-gray-800 text-base">{option.label}</span>
                {profile.goal === option.value && <CheckIcon />}
              </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
