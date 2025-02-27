import { Router } from 'express';
import {
  registerUser,
  updateUser,
  changeRole,
  deleteUser,
  loginUser,
  calculateEfficiency,
  // forgotPassword,
} from '../controllers/User.controllers.js';
const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.put('/update/:id', updateUser);
userRouter.put('/changeRole/:id', changeRole);
userRouter.delete('/delete/:id', deleteUser);
userRouter.post('/login', loginUser);
// userRouter.post('/forgotPassword', forgotPassword);
userRouter.get('/calculateEfficiency', calculateEfficiency);

export default userRouter;
