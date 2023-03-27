import cloudinary from 'cloudinary'
// import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});


const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(fileToUploads, (data) => {
           
            resolve(
                {
                    url: data.secure_url,
                },
                {
                    resource_type: "auto",
                }
            )
        })
        // cloudinary.uploader.upload(fileToUploads, {
        //     resource_type: "auto"
        // }).then((data) => {
        //     console.log("check data cloudinary ", data);
        //     resolve({
        //         url: data.url
        //     });
        // }).catch((error) => {
        //     console.error("Error uploading image to Cloudinary:", error);
        //     resolve(null);
        // });
    });
};

export default cloudinaryUploadImg