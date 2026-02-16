import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Quiz() {
    let [quizId, setQuizId] = useState("");
    let navigate=useNavigate();

    const handleSubmit = async () => {
        try {
            let res = await axios.get(`https://api-quizapp-tinp.onrender.com/api/question/getQuizById/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            navigate(`/quizPage`, { state: { quizData: res.data.quiz } });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mt-10">Quiz Page</h1>
      <h4 className="mt-25 mb-5 text-2xl">Enter Quiz ID:</h4>
      <Input className={`w-[50vw] bg-white text-black text-center`} value={quizId} onChange={(e) => setQuizId(e.target.value)} />
      <Button className="mt-5 px-8 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition" onClick={handleSubmit}>
        Start Quiz
      </Button>
    </div>
  );
}
