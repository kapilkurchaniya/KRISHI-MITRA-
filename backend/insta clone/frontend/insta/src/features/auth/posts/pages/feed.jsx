import React from 'react'
import '../style/feed.scss'

 export const Feed = () => {
  return (
    <main className="feed-page">
      <h1>Feed Page</h1>
      <div className="feed">
        <div className="posts">
          <div className="post">

          <div className="user">
            <img src="https://unsplash.com/photos/person-walking-in-red-and-green-light-kj4Q_u1PmT8" alt="" />
            <p>Username</p>
          </div>
          <img src="https://unsplash.com/photos/a-blurry-photo-of-a-man-in-black-and-white-ecmXj9aMRu0" alt="" />
          <div className="bottom">
            <p className="cation">cation here </p>
          </div>
          </div>
        </div>

      </div>
    </main>

  )
}
