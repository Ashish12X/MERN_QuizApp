import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function StudentQuizPage() {
  let data = useLocation()?.state?.record || [];
  let quizId = useLocation()?.state?.quizId || "";
  let info = data.filter((d) => d.quizId === quizId)[0].data;
  let questionIds = Object.keys(info || []);
  let answers = Object.values(info || {});
  let [questions, setQuestions] = useState([]);

  const loadData = async () => {
    try {
      let res = await axios.post(
        "https://api-quizapp-tinp.onrender.com/api/question/showQuestion",
        { questionIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res.data.success) {
        setQuestions(res.data.questions);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, [data]);
  return (
    <div className="flex flex-col bg-gray-100 justify-start items-center pt-10 min-h-[90vh]">
      <h1 className="text-3xl font-bold mb-8 text-center">Answers Review</h1>
      <div className="flex gap-6">
        {questions.map((data, idx) => {
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === data.correctAnswer;
          return (
            <div key={data._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg">
                  Q{idx + 1}. {data.question}
                </h4>
                {data.type === "MCQ" && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Wrong"}
                  </span>
                )}
              </div>
              {data.type === "MCQ" ? (
                <div className="flex flex-col gap-2">
                  {data.options.map((o, i) => {
                    const isRight = o === data.correctAnswer;
                    const isUserChoice = o === userAnswer;
                    return (
                      <div
                        key={i}
                        className={`px-4 py-2 rounded-lg border text-sm
                    ${
                      isRight
                        ? "bg-green-50 border-green-400"
                        : isUserChoice
                          ? "bg-red-50 border-red-400"
                          : "bg-gray-50"
                    }
                  `}
                      >
                        {o}
                      </div>
                    );
                  })}
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {data.correctAnswer}
                    </p>
                    <p>
                      <span className="font-medium">Your Answer:</span>{" "}
                      {userAnswer || "Not Attempted"}
                    </p>
                    <div className="flex justify-end"></div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 bg-gray-50 p-4 rounded-lg flex flex-col gap-3">
                  <p className="text-sm text-gray-600 font-medium">
                    Your Answer:
                  </p>
                  <p className="text-sm">{userAnswer || "Not Attempted"}</p>
                  <div className="flex justify-end"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
