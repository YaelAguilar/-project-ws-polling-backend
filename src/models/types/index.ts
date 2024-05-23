import { Document, ObjectId } from 'mongoose';

export interface IAlbum extends Document {
  _id: ObjectId;
  title: string;
  artist: string;
  releaseDate: Date;
  coverImage: string;
  songs: string[];
}