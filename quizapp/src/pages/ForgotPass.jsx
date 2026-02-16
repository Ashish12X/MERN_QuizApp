import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function ForgotPass() {
    let navigate=useNavigate()
  let [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
  });
  let [sentOtp, setSentOtp] = useState(false);
  let [verifyOtp, setVerifyOtp] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("https://api-quizapp-tinp.onrender.com/api/user/resend-otp", {
        email: form.email,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setSentOtp(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("http://localhost:8000/api/user/verify", {
        email: form.email,
        otp: form.otp,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setVerifyOtp(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log(form);
    
    try {
      let res = await axios.post(
        "http://localhost:8000/api/user/reset-password",
        { email: form.email, password: form.password },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login')
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#F1F5F9]">
      <Card className="w-full text-[#1F2933] max-w-sm shadow-lg shadow-gray-300">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!sentOtp) return handleSendOtp(e);
            if (!verifyOtp) return handleVerifyOtp(e);
            return handleResetPassword(e);
          }}
        >
          <CardHeader className={`text-center`}>
            <CardTitle className={`text-[2.5vh]`}>
              Reset your password
            </CardTitle>
            <CardDescription>
              Enter your email below to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 mt-5">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="bg-[#F8FAFC]"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="m@example.com"
                  required
                />
              </div>
              {sentOtp && (
                <div className="grid gap-2 mt-5">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    className="bg-[#F8FAFC]"
                    id="otp"
                    type="text"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    placeholder="Enter OTP"
                    required
                  />
                </div>
              )}
              {verifyOtp && (
                <div className="grid gap-2 mt-5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    className="bg-[#F8FAFC]"
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              variant="outline"
              type="submit"
              className="w-full mt-10 bg-[#1E40AF] hover:bg-[#1D4ED8] hover:scale-105 hover:text-white transition-all duration-300 text-white"
            >
              {!sentOtp
                ? "Send OTP"
                : !verifyOtp
                  ? "Verify OTP"
                  : "Reset Password"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
