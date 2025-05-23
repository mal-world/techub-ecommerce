import express from 'express'
import { getUsers, loginAdmin, loginUser, registrationUser, verifyAdmin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/admin/users', getUsers)
userRouter.post('/register', registrationUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin/login', loginAdmin)
userRouter.get('/admin/verify', verifyAdmin)

export default userRouter;