import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createResume, deleteResume, getResume, getreusmebyId, updateResume } from '../controllers/resumeController.js'
import { uploadResumeImages } from '../controllers/uploadImages.js'

const resumeRouter = express.Router()
resumeRouter.post('/',protect,createResume)
resumeRouter.get('/',protect,getResume)
resumeRouter.get('/:id',protect,getreusmebyId)
resumeRouter.put('/:id',protect,updateResume)
resumeRouter.put('/:id/upload-images',protect,uploadResumeImages)

resumeRouter.delete('/:id',protect,deleteResume)

export default resumeRouter;
