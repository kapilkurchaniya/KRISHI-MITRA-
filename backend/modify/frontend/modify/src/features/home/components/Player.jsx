import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { SongContext } from '../song.context.jsx';
import './Player.scss';

const moodFox = (mood) => {
  const emojis = {
    happy: '🦊😸',
    sad: '🦊😿', 
    angry: '🦊😠',
    fear: '🦊😱',
    surprise: '🦊😯',
    disgust: '🦊🤢',
    contempt: '🦊😏',
    neutral: '🦊😐'
  };
  return emojis[mood?.toLowerCase()] || '🦊🎵';
};

const Player = () => {
  const { song, songs, currentIndex, selectSong, nextSong, prevSong, loading } = useContext(SongContext);
  const audioRef = useRef(null);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showList, setShowList] = useState(false);

  const enableAudio = useCallback(() => {
    setAudioEnabled(true);
  }, []);

  const togglePlayPause = useCallback((e) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSongSelect = useCallback((idx, e) => {
    e.stopPropagation();
    selectSong(idx);
    setShowList(false);
  }, [selectSong]);

  const handlePrev = useCallback((e) => {
    e.stopPropagation();
    prevSong();
  }, [prevSong]);

  const handleNext = useCallback((e) => {
    e.stopPropagation();
    nextSong();
  }, [nextSong]);

  const handleSeek = useCallback((e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (audio && duration) {
      const newTime = (parseFloat(e.target.value) * duration) / 100;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  }, []);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      if (audioEnabled && isPlaying && song?.url) {
        audio.play().catch(console.log);
      }
    };
    const handleError = () => {
      console.error('Audio load error');
      setIsPlaying(false);
    };

    audio.volume = volume;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    if (song?.url) {
      audio.src = song.url;
      audio.load();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [song, volume, audioEnabled, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioEnabled && song?.url) {
      if (isPlaying) {
        audio.play().catch(e => {
          console.log('Play failed - user gesture required:', e);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audioEnabled, song]);

  if (loading) {
    return (
      <div className="player">
        <div className="spinner-large"></div>
        <p className="loading-text">Detecting your mood & loading songs...</p>
      </div>
    );
  }

  return (
    <div className="player-container">
      <div className="player" onClick={!audioEnabled ? enableAudio : undefined}>
        
        {!audioEnabled ? (
          <div className="enable-overlay">
            <div className="enable-content">
              <div className="fox-large">{moodFox(song?.mood)}</div>
              <p>Tap to unlock music magic ✨</p>
            </div>
          </div>
        ) : null}

        {/* Enhanced Mood + Song Display */}
        <div className="mood-song-display">
          <div className="mood-bar">
            <div className="fox-container">
              <span className="fox-emoji">{moodFox(song?.mood)}</span>
            </div>
            <span className="mood-label">{song?.mood?.toUpperCase() || 'DETECTING...'}</span>
          </div>
          {song?.title && (
            <div className="song-status">
              🎵 <strong>{song.title}</strong> <span>for your {song.mood} mood</span>
            </div>
          )}
        </div>

        {/* Song List Button */}
        <button 
          className="songs-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowList(prev => !prev);
          }}
        >
          <span>{songs.length}</span>
          <svg viewBox="0 0 24 24" height="16">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>

        {/* Songs Grid */}
        {showList && (
          <div className="songs-grid">
            {songs.map((s, idx) => (
              <button
                key={s.url}
                className={`song-item ${idx === currentIndex ? 'active-song' : ''}`}
                onClick={(e) => handleSongSelect(idx, e)}
              >
                <div className="song-poster">
                  <img src={s.posterUrl} alt={s.title} />
                </div>
                <div className="song-title">{s.title}</div>
              </button>
            ))}
          </div>
        )}

        {/* Current Track */}
        <div className="current-track">
          <div className="track-poster">
            <img src={song?.posterUrl || '/vite.svg'} alt={song?.title} />
          </div>
          <div className="track-info">
            <h2>{song?.title || 'Pick your vibe'}</h2>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button className="control-btn prev" onClick={handlePrev} disabled={songs.length <= 1}>
            <svg viewBox="0 0 24 24">
              <path d="M10.59 6L6 10.59 13.42 18l-3.41 3.41L18 14.83l4.42 4.42L20 18z"/>
            </svg>
          </button>

          <button className="control-btn play" onClick={togglePlayPause} disabled={!song?.url}>
            <svg viewBox="0 0 24 24" className={!isPlaying ? 'show' : ''}>
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg viewBox="0 0 24 24" className={isPlaying ? 'show' : ''}>
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>

          <button className="control-btn next" onClick={handleNext} disabled={songs.length <= 1}>
            <svg viewBox="0 0 24 24">
              <path d="m13.41 6 .59.59L9.83 12l4.17 5.41-.59.59L8 12z"/>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <span>{formatTime(currentTime)}</span>
          <div className="progress-bar-container">
            <input
              type="range"
              className="progress-slider"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              disabled={!song?.url || !duration}
            />
            <div className="progress-fill"></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <div className="volume-section">
          <button className="volume-btn">🔊</button>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default Player;

