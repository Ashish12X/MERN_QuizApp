import express from 'express';
import { becomeMember, checkAdmin, getProfile, getQuizAttempt, getRecord, login, logout, register, resendOtp, resetPass, updateProfile, verifyOtp } from '../controllers/userController.js';
import { authenticateUser } from '../middelware/auth.js';

let route=express.Router();

route.post('/register',register);
route.post('/verify',verifyOtp);
route.post('/resend-otp',resendOtp);
route.post('/login',login);
route.post('/logout',authenticateUser,logout);
route.post('/reset-password',resetPass);
route.post('/become-member',authenticateUser,becomeMember);
route.get('/is-admin', authenticateUser, checkAdmin);
route.get('/profile', authenticateUser, getProfile);
route.get('/getQuizAttempt', authenticateUser, getQuizAttempt);
route.get('/getRecord', authenticateUser, getRecord);
route.post('/update-profile', authenticateUser, updateProfile);
export default route;