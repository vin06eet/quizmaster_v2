import express from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { uploadOnCloudinary } from '../utils/fileUpload.js'

const router = express.Router()

router.post('/upload', upload.single('file'), async (req, res)=>{
    try {
        if (!req.file)
            return res.status(400).json({ error: 'No file uploaded' });
        const localFilePath = req.file.path
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath)
        if(!cloudinaryResponse)
            return res.status(404).json({error: 'Failed to upload file'})
        res.status(200).json({
            message: 'File uploaded successfully',
            url: cloudinaryResponse.secure_url
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

export default router
