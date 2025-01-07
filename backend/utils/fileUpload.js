import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.COULDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env. COULDINARY_SECRET_KEY
});

const uploadOnCloudianry = async (localFilePath)=>{
    try {
        if(!localFilePath)
            return null
        const response = cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto'
        })
        console.log('file uploaded successfully', (await response).url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null        
    }
}

export {uploadOnCloudianry}