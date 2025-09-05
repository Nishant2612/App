import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

const VideoPlayer = ({ isOpen, onClose, videoUrl, title = "Video Player" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const handlePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef) {
      videoRef.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef) {
      if (isMuted) {
        videoRef.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    const playerContainer = document.querySelector('.video-player-container');
    if (playerContainer) {
      if (!document.fullscreenElement) {
        playerContainer.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div 
        className="video-modal-content video-player-container" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: isFullscreen ? '100vw' : '900px',
          maxHeight: isFullscreen ? '100vh' : '600px',
          width: isFullscreen ? '100vw' : '90vw',
          height: isFullscreen ? '100vh' : 'auto',
          backgroundColor: '#000',
          borderRadius: isFullscreen ? '0' : '12px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div 
          style={{ 
            padding: '15px 20px', 
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: isFullscreen ? '100vh' : '500px',
          paddingTop: isFullscreen ? '0' : '50px'
        }}>
          {videoUrl && isYouTubeUrl(videoUrl) ? (
            // YouTube Embed
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}?autoplay=1&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ 
                position: 'absolute',
                top: isFullscreen ? 0 : 50,
                left: 0,
                width: '100%',
                height: isFullscreen ? '100%' : 'calc(100% - 50px)'
              }}
            />
          ) : videoUrl ? (
            // Direct Video File
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <video
                ref={setVideoRef}
                src={videoUrl}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'contain'
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              />
              
              {/* Custom Controls */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <button
                  onClick={handlePlay}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={toggleMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: '100px',
                    background: 'transparent'
                  }}
                />

                <div style={{ marginLeft: 'auto' }}>
                  <button
                    onClick={toggleFullscreen}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                  >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // No video URL provided
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'white',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Play size={64} style={{ opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '1.2rem' }}>Video not available</p>
              <p style={{ margin: 0, opacity: 0.7 }}>The video URL is not provided or invalid.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
