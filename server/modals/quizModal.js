import mongoose from "mongoose";

let quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
      unique: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions",
      },
    ],
    attemptedBy:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  { timestamps: true },
);

let Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;