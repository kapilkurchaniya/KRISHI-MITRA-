import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState({
   
        "url": "https://ik.imagekit.io/pdlee33i0/songs/1d3e1b52878a9759b394c0db050a052dcc53e180_76Q7t_EM-.mp3_1774698374572_4-XWHEMhy.mp3",
        "posterUrl": "https://ik.imagekit.io/pdlee33i0/posters/Sha_Dobara__From___Mismatched_____Season_3___Season_3__poster_VK1kTLRrL.jpg",
        "title": "Sha Dobara (From ''Mismatched'') [Season 3] (Season 3)",
        "mood": "sad",
    
    });

    const [loading, setLoading] = useState(false);

    return (
        <SongContext.Provider value={{ song, setSong ,loading, setLoading}}>
            {children}
        </SongContext.Provider>
    );
};