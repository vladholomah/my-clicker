import React, { useEffect, useRef } from 'react';

interface TurboVideoProps {
  isActive: boolean;
}

const TurboVideo: React.FC<TurboVideoProps> = ({ isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div className="turbo-video-container">
      <video
        ref={videoRef}
        src="/images/video.mp4"
        loop
        muted
        playsInline
        className="turbo-video"
      />
    </div>
  );
};

export default TurboVideo;