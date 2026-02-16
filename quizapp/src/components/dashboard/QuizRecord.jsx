import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { toast } from "sonner";

export default function QuizRecord() {
  let [data, setdata] = useState([]);
  let [dates, setDates] = useState([]);
  let [info, setInfo] = useState([]);

  const series = [
    {
      name: "Quiz",
      data,
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "line",
    },

    stroke: {
      width: 5,
      curve: "smooth",
    },

    xaxis: {
      type: "datetime",
      categories: dates,
    },

    title: {
      text: "Quiz Created",
      align: "left",
      style: {
        fontSize: "16px",
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#FDD835"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
  };

  const loadRecord = async () => {
    try {
      let res = await axios.get(
        "https://api-quizapp-tinp.onrender.com/api/question/quizRecord",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res.data.success) {
        const quizzes = res.data.data;
        const info = {};
        quizzes.forEach((q) => {
          if (info[q.createdAt.slice(0, 10)]) {
            info[q.createdAt.slice(0, 10)] += 1;
          } else {
            info[q.createdAt.slice(0, 10)] = 1;
          }
        });
        setdata(Object.values(info));
        setDates(Object.keys(info));
        let ids = [];
        quizzes.forEach((q) => ids.push(q.quizId));
        let titles = [];
        quizzes.forEach((q) => titles.push(q.title));
        let attempts = [];
        quizzes.forEach((q) => attempts.push(q?.attemptedBy?.length || 0));
        setInfo([ids, titles, attempts]);
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
    loadRecord();
    
  }, []);

  return (
    <div>
      {info.length > 0 ? (
        <div className="flex flex-col justify-start items-center mt-10">
          <h1 className="text-2xl font-bold mb-10">Your Quiz Records</h1>
          <div className="grid grid-rows-2">
            <div>
              <Chart
                className="w-[60vw]"
                options={options}
                series={series}
                type="line"
                height={350}
              />
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[60vw]">
              {info[1]?.map((title, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-2 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {title}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      Quiz #{idx + 1}
                    </span>
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      {info[2][idx]} Attempts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[60vw] min-h-[90vh] bg-white rounded-xl shadow-md p-12 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl text-gray-500">📊</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Quiz Records Found
          </h2>
          <p className="text-gray-500 text-center">
            You didn't created any quizzes yet.
          </p>
        </div>
      )}
    </div>
  );
}
