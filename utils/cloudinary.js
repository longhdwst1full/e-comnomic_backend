import cloudinary from 'cloudinary'
// import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});


const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(fileToUploads, (result) => {

            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
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


const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

export { cloudinaryUploadImg, cloudinaryDeleteImg }