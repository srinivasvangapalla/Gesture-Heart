
import React from 'react';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVisible: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef, isVisible }) => {
  return (
    <div className={`absolute bottom-24 right-4 z-30 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <video
        ref={videoRef}
        className="w-48 h-36 rounded-lg shadow-2xl object-cover transform -scale-x-100"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default CameraFeed;
