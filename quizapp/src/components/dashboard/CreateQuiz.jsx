import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateQuiz() {
  const token = localStorage.getItem("token");
  let [type, setType] = useState("MCQ");
  let [quizId, setQuizId] = useState("");
  const [form, setForm] = useState({ title: "", description: "", duration: 0 });
  const [questions, setQuestions] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: "",
  });
  const [allQuestions, setAllQuestions] = useState([]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      if (!quizId) {
        return toast.error("Quiz ID not generated. Please try again.");
      }
      if (type === "MCQ") {
        if (
          !questions.question ||
          questions.options.some((opt) => !opt) ||
          !questions.correctAnswer ||
          !questions.marks
        ) {
          return toast.error("All fields are required for MCQ type.");
        }
      } else {
        if (!questions.question || !questions.marks) {
          return toast.error("All fields are required for Descriptive type.");
        }
      }
      let res = await axios.post(
        "https://api-quizapp-tinp.onrender.com/api/question/create",
        {
          ...questions,
          quizId,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.data.success) {
        toast.error(res.data.message || "Failed to add question");
      }
      setAllQuestions([...allQuestions, res.data.question]);
      toast.success("Question added successfully");
      setQuestions({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: "",
      });
      setType("MCQ");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const getQuizId = async () => {
    try {
      let res = await axios.get(
        "https://api-quizapp-tinp.onrender.com/api/question/getQuizId",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        setQuizId(res.data.quizId);
      } else {
        toast.error(res.data.message || "Failed to generate quiz ID");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const handleCreateQuiz = async (e) => {
    let token = localStorage.getItem("token");
    e.preventDefault();
    try {
      let res = await axios.post(
        "https://api-quizapp-tinp.onrender.com/api/question/createQuiz",
        {
          ...form,
          quizId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Quiz created successfully");
      } else {
        toast.error(res.data.message || "Failed to create quiz");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  useEffect(() => {
    getQuizId();
  }, []);
  return (
    <div className="flex flex-col justify-start items-center mt-10">
      <h1 className="text-xl font-semibold mb-10">Create Quiz</h1>
      <form>
        <div className="w-[50vw] border border-gray-300 p-4 rounded-lg">
          <label className="ml-5">About Quiz</label>
          <input
            type="text"
            placeholder="Quiz Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 mb-4 mt-2 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Quiz Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md h-24"
          ></textarea>
          <label className="ml-5">Duration of Quiz</label>
          <input
            type="number"
            placeholder="Duration (in minutes)"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: parseInt(e.target.value) || 0 })
            }
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
        </div>
        {allQuestions.length !== 0 &&
          allQuestions.map((ques, index) =>
            ques.type === "MCQ" ? (
              <div
                key={index}
                className="w-[50vw] border border-gray-300 p-4 mb-4 rounded-lg mt-6"
              >
                <label>Question {index + 1}: </label>
                <input
                  type="text"
                  value={ques.question}
                  disabled
                  className="w-full p-2 mb-4 mt-2 border border-gray-300 rounded-md"
                />
                <label>Options:</label>
                <input
                  type="text"
                  value={ques.options[0]}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={ques.options[1]}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={ques.options[2]}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={ques.options[3]}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <label>Correct Answer: </label>
                <input
                  type="text"
                  value={ques.correctAnswer}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <label>Marks: </label>
                <input
                  type="number"
                  value={ques.marks}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </div>
            ) : (
              <div
                key={index}
                className="w-[50vw] border border-gray-300 p-4 mb-4 rounded-lg mt-6"
              >
                <label>Question {index + 1}: </label>
                <input
                  type="text"
                  value={ques.question}
                  disabled
                  className="w-full p-2 mb-4 mt-2 border border-gray-300 rounded-md"
                />
                <label>Marks: </label>
                <input
                  type="number"
                  value={ques.marks}
                  disabled
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </div>
            ),
          )}
        <div className="w-[50vw] border border-gray-300 p-4 mb-4 rounded-lg mt-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              disabled={!quizId}
              onClick={handleAddQuestion}
              className="group relative ml-5 flex items-center justify-center gap-2 
             w-56 py-2 rounded-xl 
             bg-gradient-to-r from-blue-600 to-indigo-600 
             text-white font-semibold 
             shadow-md hover:shadow-xl 
             hover:scale-105 active:scale-95 
             transition-all duration-300"
            >
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Add Question
            </button>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value);

                if (value === "DESCRIPTIVE") {
                  setQuestions({
                    question: "",
                    options: [],
                    correctAnswer: "",
                    marks: "",
                  });
                } else {
                  setQuestions({
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                    marks: "",
                  });
                }
              }}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select Question Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Question Types</SelectLabel>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="DESCRIPTIVE">Descriptive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            {type === "MCQ" ? (
              <div>
                <input
                  type="text"
                  placeholder="Question"
                  value={questions.question}
                  onChange={(e) =>
                    setQuestions({ ...questions, question: e.target.value })
                  }
                  className="w-full p-2 mb-4 mt-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Option 1"
                  value={questions.options[0]}
                  onChange={(e) => {
                    const newOption = [...questions.options];
                    newOption[0] = e.target.value;
                    setQuestions({ ...questions, options: newOption });
                  }}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Option 2"
                  value={questions.options[1]}
                  onChange={(e) => {
                    const newOption = [...questions.options];
                    newOption[1] = e.target.value;
                    setQuestions({ ...questions, options: newOption });
                  }}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Option 3"
                  value={questions.options[2]}
                  onChange={(e) => {
                    const newOption = [...questions.options];
                    newOption[2] = e.target.value;
                    setQuestions({ ...questions, options: newOption });
                  }}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Option 4"
                  value={questions.options[3]}
                  onChange={(e) => {
                    const newOption = [...questions.options];
                    newOption[3] = e.target.value;
                    setQuestions({ ...questions, options: newOption });
                  }}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={questions.correctAnswer}
                  onChange={(e) =>
                    setQuestions({
                      ...questions,
                      correctAnswer: e.target.value,
                    })
                  }
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Marks"
                  value={questions.marks}
                  onChange={(e) =>
                    setQuestions({
                      ...questions,
                      marks: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Question"
                  value={questions.question}
                  onChange={(e) =>
                    setQuestions({ ...questions, question: e.target.value })
                  }
                  className="w-full p-2 mb-4 mt-4 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Marks"
                  value={questions.marks}
                  onChange={(e) =>
                    setQuestions({
                      ...questions,
                      marks: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <Button
          type="submit"
          onClick={handleCreateQuiz}
          className="group relative ml-5 flex items-center justify-center gap-2 
     w-56 py-2 rounded-xl mb-4
     bg-gradient-to-r from-blue-600 to-indigo-600 
     text-white font-semibold 
     shadow-md hover:shadow-xl 
     hover:scale-105 active:scale-95 
     transition-all duration-300"
        >
          Create Quiz
        </Button>
      </form>
    </div>
  );
}
