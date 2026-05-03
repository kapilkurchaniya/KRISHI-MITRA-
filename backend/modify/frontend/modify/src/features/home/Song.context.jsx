import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const song = songs[currentIndex] || {};

  const selectSong = (index) => {
    setCurrentIndex(index);
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const setSongsList = (newSongs) => {
    setSongs(newSongs);
    if (newSongs.length > 0) setCurrentIndex(0);
  };

  return (
    <SongContext.Provider value={{ 
      song, 
      songs, 
      currentIndex, 
      loading, setLoading,
      selectSong,
      nextSong,
      prevSong,
      setSongs: setSongsList 
    }}>
      {children}
    </SongContext.Provider>
  );
};

