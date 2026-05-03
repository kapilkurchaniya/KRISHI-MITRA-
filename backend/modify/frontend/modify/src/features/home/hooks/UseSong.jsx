import { useContext } from "react";
import { SongContext } from "../song.context.jsx";
import { getSongs } from "../service/Song.api.jsx";

export const UseSong = () => {
  const context = useContext(SongContext);
  const { songs, loading, setLoading, setSongs } = context;

  const handleGetSongs = async ({mood}) => {
    setLoading(true);
    try {
      const response = await getSongs({mood});
      setSongs(response.songs || response);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  }
  return { songs, song: songs[0] || {}, loading, handleGetSongs };
}

