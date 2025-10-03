import express from 'express'
import {registerUser,loginUser, GetUserProfile} from '../controllers/Usercontroller.js'
import {protect} from '../middleware/authMiddleware.js'

const userRouter = express()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

// Protected Route as token will be required
userRouter.get('/profile',protect,GetUserProfile)

export default userRouter;



