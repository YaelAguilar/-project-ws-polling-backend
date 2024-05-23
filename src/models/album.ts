import mongoose, { Schema, Document } from 'mongoose';

interface Song {
  url: string;
  title: string;
}

export interface IAlbum extends Document {
  title: string;
  artist: string;
  releaseDate: Date;
  coverImage: string;
  songs: Song[];
}

const SongSchema: Schema = new Schema({
  url: { type: String, required: true },
  title: { type: String, required: true }
});

const AlbumSchema: Schema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  coverImage: { type: String, required: true },
  songs: { type: [SongSchema], required: true }
});

const Album = mongoose.model<IAlbum>('Album', AlbumSchema);

export default Album;
