import express from 'express'
import { getUserProfile, getUsers, loginAdmin, loginUser, registrationUser, updateUserProfile, verifyAdmin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/admin/users', getUsers)
userRouter.post('/register', registrationUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin/login', loginAdmin)
userRouter.get('/admin/verify', verifyAdmin)
userRouter.get('/profile', getUserProfile)
userRouter.get('/profile', updateUserProfile)

export default userRouter;