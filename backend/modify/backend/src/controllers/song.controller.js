const Songmodel = require('../models/song.model');
const upload = require('../middleware/upload.middleware');
const id3 = require('node-id3');
const storageService  = require('../services/stroage.service');

async function uploadSong(req, res) {
  const songbuffer = req.file.buffer;
  const tags =  await id3.read(songbuffer)
  const mood = req.body.mood;

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songbuffer,
      fileName: req.file.originalname + "_" + Date.now() + ".mp3",
      folder: "songs"
    }),
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      fileName: tags.title + "_poster.jpg",
      folder: "posters"
    })
  ]);

  const song = await Songmodel.create({
    url: songFile.url,
    posterUrl: posterFile.url,
    title: tags.title,
    mood
  });

  res.status(201).json({ 
    message: 'Song uploaded successfully', song });
  
}

async function getSongs(req, res) {
  const { mood } = req.query;
  
  const songs = await Songmodel.find({ mood });

  res.status(200).json({ songs });
}

module.exports = {
  uploadSong,
  getSongs
};

