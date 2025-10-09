import React from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, goal: event.target.value as 'standard' | 'diet' | 'pregnancy' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-green-800 mb-2">設定</h2>
        <p className="text-sm text-gray-600">レシピ提案の目的を設定してください。</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-md font-semibold text-gray-800 mb-3">目的</h3>
        <div className="space-y-2">
          <label className="flex items-center p-3 rounded-lg hover:bg-green-50 transition cursor-pointer">
            <input
              type="radio"
              name="goal"
              value="standard"
              checked={profile.goal === 'standard'}
              onChange={handleGoalChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">標準</span>
          </label>
          <label className="flex items-center p-3 rounded-lg hover:bg-green-50 transition cursor-pointer">
            <input
              type="radio"
              name="goal"
              value="diet"
              checked={profile.goal === 'diet'}
              onChange={handleGoalChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">ダイエット</span>
          </label>
           <label className="flex items-center p-3 rounded-lg hover:bg-green-50 transition cursor-pointer">
            <input
              type="radio"
              name="goal"
              value="pregnancy"
              checked={profile.goal === 'pregnancy'}
              onChange={handleGoalChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">妊娠中</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Profile;
