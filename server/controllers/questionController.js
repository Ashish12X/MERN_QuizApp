import { QuizIdEmail } from "../emails/QuizIdEmail.js";
import Questions from "../modals/questionModal.js";
import Quiz from "../modals/quizModal.js";
import User from "../modals/userModal.js";
import mongoose from "mongoose";

export const createQuestion = async (req, res) => {
  try {
    let { question, options, correctAnswer, marks, type, quizId } = req.body;
    if (type === "MCQ") {
      if (!question || !options || !correctAnswer || !marks || !quizId) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields for MCQ",
        });
      }
      let newQuestion = new Questions({
        userId: req.user._id,
        question,
        options,
        correctAnswer,
        marks,
        type,
        quizId,
      });
      await newQuestion.save();
      let user = await User.findById(req.user._id);
      user.questions.push(newQuestion._id);
      await user.save();
      return res.status(201).json({
        success: true,
        message: "Question created successfully",
        question: newQuestion,
      });
    } else if (type === "DESCRIPTIVE" || type === "Descriptive") {
      if (!question || !marks || !quizId) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all required fields for Descriptive question",
        });
      }
      let newQuestion = new Questions({
        userId: req.user._id,
        question,
        marks,
        type,
        quizId,
      });
      await newQuestion.save();
      let user = await User.findById(req.user._id);
      user.questions.push(newQuestion._id);
      await user.save();
      return res.status(201).json({
        success: true,
        message: "Descriptive question created successfully",
        question: newQuestion,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid question type. Must be either 'MCQ' or 'Descriptive'",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createQuizId = async (req, res) => {
  try {
    let uniqueQuizId;
    do {
      uniqueQuizId = Math.random().toString(36).substring(2, 10);
    } while (await Questions.exists({ quizId: uniqueQuizId }));
    return res.status(200).json({ success: true, quizId: uniqueQuizId });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    let { title, description, quizId, duration } = req.body;
    if (!quizId || !duration || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create a quiz",
      });
    }
    let questions = await Questions.find({ quizId });
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for the provided quiz ID",
      });
    }
    let totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    let totalQuestions = questions.length;
    let newQuiz = new Quiz({
      userId: req.user._id,
      title,
      description,
      totalMarks,
      totalQuestions,
      duration,
      quizId,
      questions: questions.map((q) => q._id),
      isPublished: true,
    });
    QuizIdEmail(req.user.email,quizId);
    await newQuiz.save();
    let user = await User.findById(req.user._id);
    user.totalQuizzesCreated += 1;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Quiz created successfully",
      newQuiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    let { quizId } = req.params;
    let quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found with the provided quiz ID",
      });
    }
    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuestionsByIds = async (req, res) => {
  try {
    let { quizId } = req.params;
    if (quizId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "quiz ID cannot be Empty",
      });
    }
    quizId = quizId.trim();
    let questions = await Questions.find({ quizId });
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for the provided quiz ID",
      });
    }
    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const data = req.body.answer;
    const { quizId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const alreadyAttempted = user.totalMarksObtained.some(
      (q) => q.quizId.toString() === quizId,
    );
    if (alreadyAttempted) {
      return res.status(400).json({
        success: false,
        message: "Quiz already attempted",
      });
    }
    const questionIds = Object.keys(data);
    const questions = await Questions.find({
      _id: { $in: questionIds },
    });
    let score = 0;
    questions.forEach((q) => {
      if (q.type === "MCQ" && q.correctAnswer === data[q._id]) {
        score += q.marks;
      }
    });
    await Quiz.updateOne(
      { quizId },
      { $addToSet: { attemptedBy: req.user._id } },
    );

    user.totalMarksObtained.push({ quizId, score, data });
    user.totalQuizzesAttempted = (user.totalQuizzesAttempted || 0) + 1;
    await user.save();
    res.status(200).json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const showReport = async (req, res) => {
  try {
    const { quizId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const quizResult = user.totalMarksObtained.find((q) => q.quizId === quizId);
    if (!quizResult) {
      return res.status(400).json({
        success: false,
        message: "Quiz not attempted",
      });
    }
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    return res.status(200).json({
      success: true,
      score: quizResult.score,
      totalMarks: quiz.totalMarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const quizRecord = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .select("title createdAt attemptedBy quizId")
      .sort({ createdAt: 1 });
    if (!quizzes.length) {
      return res.status(404).json({
        success: false,
        message: "No Quiz Created",
      });
    }
    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const studentRecord = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id }).select("quizId");
    const quizIds = quizzes.map((q) => q.quizId);
    const user = await User.find({ "totalMarksObtained.quizId": quizIds });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No Quiz Attempted By Students",
      });
    }
    let data = [];
    user.forEach((u) => {
      u.totalMarksObtained.forEach((m) => {
        if (quizIds.includes(m.quizId)) {
          data.push({
            userId: u._id,
            userName: u.userName,
            attempt: m,
          });
        }
      });
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const showQuestion = async (req, res) => {
  try {
    let { questionIds } = req.body;
    if (!questionIds || !questionIds.length) {
      return res.status(404).json({
        success: false,
        message: "User Didn't Answered the Question",
      });
    }
    let questions = await Questions.find({ _id: { $in: questionIds } });
    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No Question Found",
      });
    }
    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateScore = async (req, res) => {
  try {
    const { userId, quizId, questionId, newScore } = req.body;
    const ques = await Questions.findById(questionId);
    if (!ques)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    if (newScore > ques.marks)
      return res
        .status(400)
        .json({ success: false, message: "Exceeds question marks" });
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const attempt = user.totalMarksObtained.find((d) => d.quizId === quizId);
    if (!attempt)
      return res
        .status(404)
        .json({ success: false, message: "Attempt not found" });
    if (attempt.score + newScore > quiz.totalMarks) {
      return res.status(400).json({
        success: false,
        message: "Total score cannot exceed quiz total marks",
      });
    }
    attempt.score += newScore;
    await user.save();
    res.status(200).json({
      success: true,
      updatedScore: attempt.score,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizCount = async (req, res) => {
  try {
    let userId = req.user._id;
    const quiz = await Quiz.find({ userId });
    const quizLen = quiz.length;
    const quizId = quiz.map((q) => q.quizId);
    const users = await User.find({
      "totalMarksObtained.quizId": { $in: quizId },
    });
    const userLen=users.length;
    res.status(200).json({
      success: true,
      quizLen,
      userLen,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: err.message });
  }
};
