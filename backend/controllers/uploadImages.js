import fs from 'fs';
import path from 'path';
import Resume from '../models/resumeModel.js';
import upload from '../middleware/uploadMiddleware.js';
import { error } from 'console';

export const uploadResumeImages = async (req, res) => {
    try {
        //  configure Multer to Handle Images 
        upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])
            (req, res, async (err) => {
                if (err) {
                    console.error("Multer Error: ", err);

                    return res.status(400).json({ message: 'file Upload Field', error: err.message })
                }
                console.log("✅ Entered uploadResumeImages controller");
                console.log("➡️ req.files:", req.files);
                console.log("➡️ req.body:", req.body);
                console.log("➡️ req.params:", req.params);
                console.log("➡️ req.user:", req.user);
                const resumeId = req.params.id;
                const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })
                if (!resume) {
                    console.error('Resume not found', resumeId);
                    
                    return res.status(400).json({ message: "Resume Not found " })
                }
                //  use process cwd to locate uploads folder
                const uploadsFolders = path.join(process.cwd(), "uploads")
                const baseURL = `${req.protocol}://${req.get("host")}`;

                const newThumbnail = req.files.thumbnail?.[0];
                const newprofileImg = req.files.profileImage?.[0]

                
            console.log("📂 New thumbnail:", newThumbnail);
            console.log("📂 New profile image:", newprofileImg);
                if (newThumbnail) {
                    if (resume.thumbnailLink) {
                        const oldThumbnail = path.join(uploadsFolders, path.basename(resume.thumbnailLink))
                        if (fs.existsSync(oldThumbnail))
                            fs.unlinkSync(oldThumbnail)
                    }
                    resume.thumbnailLink = `${baseURL}/uploads/${newThumbnail.filename}`;
                }
                //     same for profilepreview images 
                if (newprofileImg) {
                    if (resume.profileInfo?.profilePreviewUrl) {
                        const oldprofile = path.join(uploadsFolders, path.basename(resume.profileInfo.profilePreviewUrl))
                        if (fs.existsSync(oldprofile))
                            fs.unlinkSync(oldprofile)
                    }
                    resume.profileInfo.profilePreviewUrl = `${baseURL}/uploads/${newprofileImg.filename}`;
                }
                await resume.save()
                console.log("Resume updated Successfully");
                
                res.status(200).json({ message: "Image Uploaded Successfully", thumbnailLink: resume.thumbnailLink, profilePreviewUrl: resume.profileInfo.profilePreviewUrl })
            })
    } catch (error) {
        console.error('Error Uploading image',error);
        res.status(500).json({ message: "Failed to Upload Image", error: err.message })

    }
}





