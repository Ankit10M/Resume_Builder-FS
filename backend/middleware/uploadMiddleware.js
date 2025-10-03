import multer from 'multer';
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
// File Filter
const fileFilter =(req,file,cb)=>{
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Only .jpeg, .jpg, .png are allowed"),false)
    }
}

const upload = multer({storage,fileFilter})

export default upload;
