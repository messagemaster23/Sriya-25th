import React from 'react';
import Loader from './Loader';

interface GreetingCardProps {
  greeting: string;
  isLoading: boolean;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ greeting, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700 min-h-[150px] flex items-center justify-center p-6 transition-all duration-300">
      {isLoading ? (
        <Loader />
      ) : (
        <p className="text-center text-lg md:text-xl text-gray-300 italic">
          {greeting || 'Your creative greeting will appear here... ✨'}
        </p>
      )}
    </div>
  );
};

export default GreetingCard;
