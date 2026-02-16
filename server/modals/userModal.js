import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    pinCode: {
      type: String,
      default: "",
    },
    profileId: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "Admin"],
      default: "user",
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions",
      },
    ],
    totalQuizzesCreated: {
      type: Number,
      default: 0,
    },
    totalQuizzesAttempted: {
      type: Number,
      default: 0,
    },
    totalMarksObtained: [
      {
        quizId: {
          type:String,
          required:true
        },
        score: {
          type: Number,
        },
        data:{
          type:Object
        }
      },
    ],
  },
  { timestamps: true },
);

let User = mongoose.model("users", userSchema);
export default User;
