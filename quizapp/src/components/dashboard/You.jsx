import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function You() {
  const [totalQuiz, setTotalQuiz] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const loadData = async () => {
    try {
      let res = await axios.get(
        "https://api-quizapp-tinp.onrender.com/api/question/getQuizCount",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if(res.data.success){
        setTotalQuiz(res.data.quizLen);
        setTotalStudent(res.data.userLen)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.response?.statusText || "An error occurred. Please try again.",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div className="flex flex-col min-h-[90vh] justify-start items-center mt-10">
      <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-3xl p-12 border border-gray-100 hover:shadow-2xl transition">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wider">
              Total Quiz Created
            </h2>
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-3xl">
              📊
            </div>
          </div>
          <p className="mt-10 text-7xl font-extrabold text-gray-800">
            {totalQuiz}
          </p>
          <p className="text-lg text-gray-400 mt-4">Till today</p>
        </div>
        <div className="bg-white shadow-lg rounded-3xl p-12 border border-gray-100 hover:shadow-2xl transition">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wider">
              Total Students
            </h2>
            <div className="bg-green-100 text-green-600 p-4 rounded-full text-3xl">
              🎓
            </div>
          </div>
          <p className="mt-10 text-7xl font-extrabold text-gray-800">
            {totalStudent}
          </p>
          <p className="text-lg text-gray-400 mt-4">Registered users</p>
        </div>
      </div>
    </div>
  );
}
