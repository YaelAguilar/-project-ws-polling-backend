import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  coverImage: { type: String, required: true },
  songs: [{ type: String, required: true }]
});

const Album = mongoose.model('Album', albumSchema);

export default Album;
