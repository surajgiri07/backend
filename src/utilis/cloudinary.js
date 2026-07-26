import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) { console.log("file  not found") }

        //upload the file on cloudinary 

        else {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
        }

        //file hgas been succesfully uploaded on cloudinary 

        console.log("file uploaded successsfully", response.url);
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath) //remove the file from the server
        return null;
    }
}

export { uploadOnCloudinary }