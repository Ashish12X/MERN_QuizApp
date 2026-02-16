import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const [record, setRecord] = useState([]);
  const chartData =
    record?.map((r) => ({
      quiz: r.quizId,
      score: r.score,
    })) || [];
  const navigate = useNavigate();

  const showQuiz = async (quizId) => {
    navigate("/studentQuizPage", { state: { record, quizId } });
  };

  const loadData = async () => {
    try {
      let res = await axios.get("https://api-quizapp-tinp.onrender.com/api/user/getRecord", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setRecord(res.data.record);
      } else {
        toast(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.statusText ||
          "An error occurred. Please try again.",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      {record.length > 0 ? (
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-3xl font-semibold mb-8 text-gray-800">
            My Quiz Records
          </h1>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {record?.map((data, i) => (
                <div
                  key={i}
                  className="border shadow-xl rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 hover:shadow-none"
                  onClick={() => showQuiz(data.quizId)}
                >
                  <div>
                    <p className="text-gray-500 text-sm">Quiz ID</p>
                    <p className="font-medium">{data.quizId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Score</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {data.score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart fill="#1E40AF" data={chartData}>
                  <XAxis dataKey="quiz" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-3xl font-semibold mb-8 text-gray-800">
            My Quiz Records
          </h1>
          <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl text-gray-500">📄</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Records Found
            </h2>
            <p className="text-gray-500">
              You haven’t attempted any quizzes yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
