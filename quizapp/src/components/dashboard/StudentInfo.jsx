import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function StudentInfo() {
  const [data, setData] = useState([]);
  let navigate = useNavigate();

  const handleData = (Answer, quizId, userId) => {
    navigate("/answerPage", { state: { Answer, quizId, userId } });
  };

  const loadStudentRecord = async () => {
    try {
      let res = await axios.get(
        "https://api-quizapp-tinp.onrender.com/api/question/studentRecord",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res.data.success) {
        const grouped = res.data.data.reduce((acc, curr) => {
          const found = acc.find((u) => u.userId === curr.userId);
          if (found) {
            found.attempts.push(curr.attempt);
          } else {
            acc.push({
              userId: curr.userId,
              userName: curr.userName,
              attempts: [curr.attempt],
            });
          }
          return acc;
        }, []);
        setData(grouped);
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
    loadStudentRecord();
  }, []);
  return (
    <div>
      {data.length > 0 ? (
        <div className="flex flex-col justify-start items-center mt-10">
          <h1 className="text-2xl font-bold mb-10">Students Records</h1>
          <div className="w-[60vw] min-h-[70vh] flex flex-col gap-8">
            {data?.map((d, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {d.userName}
                    </h2>
                    <p className="text-sm text-gray-400">ID: {d.userId}</p>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-gray-600 px-4 py-2">
                    <span>Quiz ID</span>
                    <span>Score</span>
                    <span>Action</span>
                  </div>
                  {d.attempts.map((m, id) => (
                    <div
                      key={id}
                      className="grid grid-cols-3 px-4 py-2 text-sm border-t hover:bg-gray-50 transition"
                    >
                      <span className="truncate">{m.quizId}</span>
                      <span className="font-medium">{m.score}</span>
                      <button
                        onClick={() => handleData(m.data, m.quizId, d.userId)}
                        className="text-indigo-600 hover:underline"
                      >
                        View Answers
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-[60vw] min-h-[90vh] bg-white rounded-xl shadow-md p-12 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl text-gray-500">👨‍🎓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Students Found
          </h2>
          <p className="text-gray-500 text-center">
            You haven’t created any quizzes yet, so no students have attempted
            them.
          </p>
        </div>
      )}
    </div>
  );
}
