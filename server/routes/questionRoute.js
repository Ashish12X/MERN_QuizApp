import express from "express";
import { createQuestion, createQuiz, createQuizId, getQuestionsByIds, getQuizById, getQuizCount, quizRecord, showQuestion, showReport, studentRecord, submitQuiz, updateScore } from "../controllers/questionController.js";
import { authenticateUser, authorizeAdmin } from "../middelware/auth.js";

let route = express.Router();

route.post("/create",authenticateUser ,authorizeAdmin ,createQuestion );
route.get("/getQuizId", authenticateUser, authorizeAdmin, createQuizId);
route.post("/createQuiz", authenticateUser, authorizeAdmin, createQuiz);
route.get("/getQuizById/:quizId", authenticateUser, getQuizById);
route.get("/getQuestionsByIds/:quizId", authenticateUser, getQuestionsByIds);
route.post("/submitQuiz/:quizId",authenticateUser ,submitQuiz );
route.get("/showReport/:quizId", authenticateUser, showReport)
route.get("/quizRecord", authenticateUser,authorizeAdmin , quizRecord)
route.get("/studentRecord", authenticateUser,authorizeAdmin , studentRecord)
route.post("/showQuestion", authenticateUser , showQuestion)
route.put("/updateScore", authenticateUser,authorizeAdmin , updateScore)
route.get("/getQuizCount", authenticateUser,authorizeAdmin , getQuizCount)

export default route;