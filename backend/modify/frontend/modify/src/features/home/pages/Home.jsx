import React, { useCallback } from 'react'
import FaceExpression from '../../expression/components/faceexpression'
import Player from '../components/Player'
import { UseSong } from '../hooks/UseSong'

const Home = () => {
  const { handleGetSongs } = UseSong();

  const handleMoodDetected = useCallback((mood) => {
    handleGetSongs({ mood });
  }, [handleGetSongs]);

  return (
    <>
    <FaceExpression onDetect={handleMoodDetected} />
    <Player />
    </>
  )
}

export default Home