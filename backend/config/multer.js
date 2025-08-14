import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = "Jobnexus";
    if (file.fieldname === "profile_picture") folder = "profile_pictures";
    else if (file.fieldname === "media") folder = "posts_media";

    return {
      folder,
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "auto", 
    };
  },
});

const upload = multer({ storage });
export default upload;
