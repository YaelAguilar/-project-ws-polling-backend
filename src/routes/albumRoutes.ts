import express from 'express';
import { createAlbum, getAlbums, waitForNewAlbum } from '../controllers/albumController';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'songs', maxCount: 10 }]), createAlbum);
router.get('/', getAlbums);
router.get('/notifications', waitForNewAlbum);

export default router;
