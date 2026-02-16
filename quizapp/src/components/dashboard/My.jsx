import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function My() {
  const [totalAttempt, setTotalAttempt] = useState(0);
  const loadData=async()=>{
    try{
      let res = await axios.get(
        "https://api-quizapp-tinp.onrender.com/api/user/getQuizAttempt",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if(res.data.success){
        setTotalAttempt(res.data.totalAttempts);
      }
    }catch(error){
      toast.error(
        error.response?.data?.message || error.response?.statusText || "An error occurred. Please try again.",
      )
    }
  }

  useEffect(() => {
      loadData();
    }, []);
  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center px-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl p-12 text-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-12">My Dashboard</h1>
        <p className="text-blue/80 text-xl mb-4">
          Total Quiz Attempted By You
        </p>
        <h2 className="text-7xl font-extrabold text-blue-500">{totalAttempt}</h2>
      </div>
    </div>
  );
}
