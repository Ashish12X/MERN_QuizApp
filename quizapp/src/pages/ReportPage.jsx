import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import axios from "axios";

export default function ReportPage() {
  let { state } = useLocation();
  let id = state?.id;
  let [score, setScore]=useState(0);
  let [totalMarks, setTotalMarks]=useState(0);
  let [loading, setLoading]=useState(false);
  let navigate=useNavigate();
  const percent = totalMarks
  ? Math.round((score / totalMarks) * 100)
  : 0;

  const series = [percent];
  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        track: {
          background: "#eee",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "24px",
            show: true,
          },
        },
      },
    },
    labels: ["Score"],
  };

  const loadReport=async()=>{
    try{
      setLoading(true);
      let res = await axios.get(
        `https://api-quizapp-tinp.onrender.com/api/question/showReport/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if(res.data.success){
        setScore(res.data.score);
        setTotalMarks(res.data.totalMarks);
      }else{
        toast.error(res.data.message);
      }
    }catch(error){
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadReport();
  },[id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-[10vh]">Your Scoreboard</h1>
      {!loading?
      <div className="h-[50vh] w-[40vw] bg-white rounded-2xl text-center">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={250}
        />
        <h4 className="text-center text-black">You Scored {score} out of {totalMarks}</h4>
        <Button className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition" onClick={()=>navigate('/')}>Return to Home Page</Button>
      </div>:
      <div className="mt-4 text-white text-lg font-semibold">Generating Report...</div>
      }
    </div>
  );
}
