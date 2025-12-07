import React from 'react';
import { useHandGesture } from './hooks/useHandGesture';
import HeartOfStars from './components/HeartOfStars';
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
  // The hook now returns a scale value based on mouse wheel events.
  const { scale } = useHandGesture();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 overflow-hidden p-4">
      <HeartOfStars scale={scale} />

      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-20">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">Interactive Star Heart</h1>
         <a href="https://github.com/srinivasvangapalla/Gesture-Heart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <GithubIcon className="w-7 h-7" />
        </a>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col items-center z-20">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm p-3 rounded-xl mb-4 text-center">
            <p className="text-lg font-medium text-white">Interactive Heart</p>
            <p className="text-sm text-gray-300">Click and drag to rotate. Use mouse wheel to zoom. Press Space to reset.</p>
        </div>
      </div>
    </div>
  );
};

export default App;