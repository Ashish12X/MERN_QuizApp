import User from "./../modals/userModal.js";
import bcrypt from "bcrypt";
import { sentOtpMail } from "../emails/verifyEmail.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      userName: name,
      email,
      password: hashedPassword,
    });
    let otp = Math.floor(100000 + Math.random() * 900000);
    newUser.otp = otp;
    let otpExpiry = Date.now() + 10 * 60 * 1000;
    newUser.otpExpiry = otpExpiry;
    sentOtpMail(email, otp);
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let { otp, email } = req.body;
    if (!otp || !email) {
      return res
        .status(400)
        .json({ success: false, message: "OTP and email are required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    user.isVerified = true;
    user.isLoggedIn = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User verified successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    sentOtpMail(email, otp);
    await user.save();
    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User not verified" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    user.isLoggedIn = true;
    await user.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        token,
        role: user.role,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPass = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.isLoggedIn = false;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const becomeMember = async (req, res) => {
  try {
    let userEmail = req.user.email;
    let { email } = req.body;
    if (email !== userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "You can only update your own role" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.role === "Admin") {
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });
    }
    user.role = "Admin";
    await user.save();
    res.status(200).json({ success: true, message: "User is now a member" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAdmin = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: req.user.role === "Admin",
      message:
        req.user.role === "Admin" ? "User is an admin" : "User is not an admin",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { password, __v, ...safeUser } = req.user._doc;
    if (!safeUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: {
        message: "User profile fetched successfully",
        user: {
          ...safeUser,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let userEmail = req.user.email;
    let { name, email, phone, address, city, state, country, pinCode } =
      req.body;
    if (email && email !== userEmail) {
      return res.status(400).json({
        success: false,
        message: "You are not allowed to update email",
      });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.userName = name || user.userName;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.pinCode = pinCode || user.pinCode;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizAttempt = async (req, res) => {
  try {
    let id = req.user._id;
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let totalAttempts = user.totalQuizzesAttempted;
    res
      .status(200)
      .json({
        success: true,
        message: "Quiz Attempt Count Fetched",
        totalAttempts,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecord=async(req,res)=>{
  try{
    let id=req.user._id;
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let record=user.totalMarksObtained;
    res
      .status(200)
      .json({
        success: true,
        message: "User Data Fetched Successfully",
        record,
      });
  }catch(error){
    res.status(500).json({ success: false, message: error.message });
  }
}
