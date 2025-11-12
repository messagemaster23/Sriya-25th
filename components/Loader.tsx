import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
    </div>
  );
};

export default Loader;
