import mongoose from "mongoose";

let questionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: function () {
          return this.type === "MCQ";
        },
      },
    ],
    correctAnswer: {
      type: String,
      required: function () {
        return this.type === "MCQ";
      },
    },
    marks: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["MCQ", "DESCRIPTIVE"],
      default: "MCQ",
    },
    quizId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

let Questions = mongoose.model("Questions", questionSchema);

export default Questions;
