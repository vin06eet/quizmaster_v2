import express from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { uploadAndOcr } from '../middlewares/uploadAndOcr.middleware.js';
import {geminiApi} from '../controllers/gemini.controller.js';

const router = express.Router()

router.post('/upload', upload.single('file'), uploadAndOcr, geminiApi)

export default router
