import { useContext} from "react";
import { SongContext } from "../song.context.jsx";
import { getSongs } from "../service/Song.api.jsx";

export const UseSong = () => {
  const context = useContext(SongContext);
  const { song , loading ,setSong, setLoading } = context;

  const handleGetSongs = async ({mood}) => {
    setLoading(true);
  
      const response = await getSongs({mood});
      setSong(response.songs || response[0] || response);
      setLoading(false);
  }
  return ({ song, loading, handleGetSongs });
}

