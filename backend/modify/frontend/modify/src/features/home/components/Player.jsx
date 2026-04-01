import React, { useRef, useState, useEffect } from 'react';
import { UseSong } from '../hooks/UseSong.jsx';
import './Player.scss';

const Player = () => {
  const { song, loading } = UseSong();
  const audioRef = useRef(null);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const enableAudio = () => {
    if (!audioEnabled) {
      console.log('Enabling audio playback');
      setAudioEnabled(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio && song?.url) {
      audio.volume = volume;
      audio.src = song.url;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      const handleCanPlay = () => {
        // Auto-play when song is ready, but only if audio is enabled
        if (song?.url && audioEnabled) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                setIsPlaying(false);
              });
          }
        }
      };

      const handleError = () => {
        setIsPlaying(false);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [song, volume, audioEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioEnabled) {
      const playPromise = isPlaying ? audio.play() : audio.pause();
      
      if (isPlaying && playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [isPlaying, audioEnabled]);

  const togglePlayPause = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (!song?.url) {
      return;
    }

    setIsPlaying(prev => !prev);
  };

  const handleSeek = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const audio = audioRef.current;
    const newTime = (e.target.value * duration) / 100;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="player loading">
        <div className="spinner"></div>
        <p>Loading your vibe...</p>
      </div>
    );
  }

  return (
    <div className="player" onClick={enableAudio}>
      
      {!audioEnabled && (
        <div className="audio-notice">
          <p>Click anywhere to enable audio</p>
        </div>
      )}
      {/* Poster */}
      <div className="player-poster">
        <img
          src={song?.posterUrl}
          alt={song?.title}
          key={song?.url}
        />
      </div>

      {/* Song Info */}
      <div className="player-info">
        <h3>{song?.title || "No Song"}</h3>
        <p className="mood">{song?.mood || "Unknown Mood"}</p>
      </div>

      {/* Controls */}
      <div className="player-controls">

        {/* Play Button */}
        <button className="play-btn" onClick={togglePlayPause}>
          {isPlaying ? '❚❚' : '▶'}
        </button>

        {/* Progress */}
        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="progress-bar"
          />

          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <div className="volume-container">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-bar"
          />
        </div>

      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default Player;