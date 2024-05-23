import { Request, Response } from 'express';
import Album from '../models/album';
import { uploadImage, uploadAudio } from '../services/cloudinaryService';

let clients: Response[] = [];

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (!files || !files.coverImage || files.coverImage.length === 0 || !files.songs || files.songs.length === 0) {
      return res.status(400).send({ message: "Cover image and songs are required." });
    }

    const { title, artist, releaseDate } = req.body;
    const coverImageFile = files.coverImage[0];
    const songFiles = files.songs;

    const coverImageUrl = await uploadImage(coverImageFile.path);
    const songUrls = await Promise.all(songFiles.map(async (song) => {
      const songUrl = await uploadAudio(song.path);
      return {
        url: songUrl,
        title: song.originalname
      };
    }));

    const album = new Album({
      title,
      artist,
      releaseDate,
      coverImage: coverImageUrl,
      songs: songUrls
    });

    await album.save();

    res.status(201).send(album);

    // Notificar a los clientes conectados
    clients.forEach(client => client.json({ success: true, album }));
    clients = [];
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).send({ message: 'Error creating album', error: error.toString() });
  }
};

export const getAlbums = async (_req: Request, res: Response): Promise<void> => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching albums', error: error.message });
  }
};

export const waitForNewAlbum = (req: Request, res: Response) => {
  clients.push(res);
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
};

export const getAlbumById = async (req: Request, res: Response): Promise<void> => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      res.status(404).json({ message: 'Album not found' });
      return;
    }
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching album', error: error.message });
  }
};
