import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
    </div>
  );
};

interface CardProps {
  title: string;
  icon: React.ReactNode;
  isLoading: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, icon, isLoading, children }) => {
  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700/50 p-6 h-full flex flex-col transition-all duration-300 hover:border-pink-400/50 hover:shadow-pink-900/30">
      <div className="flex items-center mb-4">
        <div className="mr-3">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
      </div>
      <div className="flex-grow min-h-[150px] flex items-center justify-center">
        {isLoading ? <Loader /> : children}
      </div>
    </div>
  );
};
