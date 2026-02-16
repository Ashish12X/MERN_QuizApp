import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Member() {
    let [email, setEmail] = useState("");
    let token = localStorage.getItem("token");
    let navigate=useNavigate();

    const handleSubmit = async (e) => {
        try {
            let res=await axios.post("https://api-quizapp-tinp.onrender.com/api/user/become-member", { email }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(res.data.success){
                toast.success("Email submitted successfully! You are now a member.");
                localStorage.setItem("isAdmin", "true");
                setEmail("");
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-center mb-12">
          Become a Member
        </h1>
        <p className="text-center text-xl">
          Join our community of learners and educators to access exclusive
          features and assign quizzes to your students.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Label className="bg-white w-[30vw] text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer">
            Enter Your Email to Get Started
          </Label>
          <Input
            className="bg-white w-[55vw] text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-102 transition cursor-pointer"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-4 justify-center mt-10">
            <button className="mt-8 px-8 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
            onClick={handleSubmit}>
            Join Now
        </button>
        </div>
        <ul className="mt-10 max-w-2xl mx-auto text-lg space-y-4">
          <li>• Create and manage unlimited quizzes</li>
          <li>• Assign quizzes directly to students</li>
          <li>• Track student progress and performance</li>
          <li>• Save time with automated evaluation</li>
        </ul>
      </div>
    </div>
  );
}