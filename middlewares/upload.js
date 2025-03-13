import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../controllers/productController.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog_images",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload2 = multer({ storage });
export default upload2;