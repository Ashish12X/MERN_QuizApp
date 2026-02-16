import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Quiz from "./Quiz";
import Timer from "@/components/Timer";

export default function QuizPage() {
  let quizData = useLocation().state?.quizData;
  let totalQuestions = quizData ? quizData.questions.length : 0;
  let [count, setCount] = useState(0);
  let [answer, setAnswer] = useState([]);
  let [questions, setQuestions] = useState([]);
  let navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      let res = await axios.post(
        `https://api-quizapp-tinp.onrender.com/api/question/submitQuiz/${quizData.quizId}`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      let id = quizData.quizId;
      if (res.data.success) {
        toast.success("Quiz Submitted Successfully..");
        navigate("/reportPage", { state: { id } });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (count + 1 < totalQuestions) {
      setCount((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleUploadQuestions = async () => {
    try {
      let res = await axios.get(
        `https://api-quizapp-tinp.onrender.com/api/question/getQuestionsByIds/${quizData.quizId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setQuestions(res.data.questions);
    } catch (error) {
      toast.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (quizData) {
      handleUploadQuestions();
    }
  }, [quizData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mt-10">Best of Luck!</h1>
      {quizData ? (
        <div className="mt-10 w-full max-w-3xl bg-white text-black p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-[70%_auto]">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{quizData.title}</h2>
              <p className="mb-4">{quizData.description}</p>
              <p className="mb-4">Total Marks: {quizData.totalMarks}</p>
              <p className="mb-4">Total Questions: {totalQuestions}</p>
              <p className="mb-4">Duration: {quizData.duration} minutes</p>
              <h3 className="text-xl font-semibold mb-3">Questions:</h3>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl">Time Remaining</p>
              <Timer duration={quizData.duration} onFinish={handleSubmit} />
            </div>
          </div>
          {questions.map((q, index) => {
            if (index === count) {
              return (
                <form key={q._id} className="mb-6" onSubmit={handleNext}>
                  <p className="font-semibold text-lg">
                    {index + 1}. {q.question}
                  </p>
                  {q.type === "MCQ" ? (
                    <ul className="list-disc list-inside mt-2">
                      {q.options.map((option, idx) => (
                        <li key={idx}>
                          <input
                            type="radio"
                            id={`option-${q._id}-${idx}`}
                            className="mr-2"
                            value={option}
                            onChange={(e) =>
                              setAnswer({ ...answer, [q._id]: e.target.value })
                            }
                          />
                          <label htmlFor={`option-${q._id}-${idx}`}>
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <textarea
                      className="w-full mt-2 p-2 border rounded"
                      placeholder="Type your answer here..."
                      onChange={(e) =>
                        setAnswer({ ...answer, [q._id]: e.target.value })
                      }
                    ></textarea>
                  )}
                  <Button
                    className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
                    type="submit"
                  >
                    {index + 1 === totalQuestions
                      ? "Submit Quiz"
                      : "Next Question"}
                  </Button>
                </form>
              );
            }
          })}
        </div>
      ) : (
        <p className="mt-10">No quiz data available.</p>
      )}
    </div>
  );
}
