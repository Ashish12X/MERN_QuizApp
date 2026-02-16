import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
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
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Singup({setLogged}) {
  let navigate=useNavigate();
  let [otp, setOtp] = useState("");
  let [verifying, setVerifying] = useState(false);
  let [success_, setSuccess] = useState(false);
  let [loading, setLoading] = useState(false);
  let [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://api-quizapp-tinp.onrender.com/api/user/register",
        form,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        setSuccess(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setVerifying(true);
      const res = await axios.post(
        `https://api-quizapp-tinp.onrender.com/api/user/verify`,
        { email: form.email, otp },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        toast.success("OTP verified successfully! You are logged in.");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "User");
        setSuccess(false);
        setLogged(true);
        navigate('/');
      } else {
        toast.error(
          res.data.message || "OTP verification failed. Please try again.",
        );
      }
    } catch (error) {
      return toast.error(
        error.response?.data?.message ||
          "An error occurred during OTP verification.",
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(
        `https://api-quizapp-tinp.onrender.com/api/user/resend-otp`,
        { email: form.email },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(res.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while resending OTP.",
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#F1F5F9]">
      <Card className="w-full text-[#1F2933] max-w-sm shadow-lg shadow-gray-300">
        <CardHeader className={`text-center`}>
          <CardTitle className={`text-[2.5vh]`}>
            Create to your account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  className="bg-[#F8FAFC] focus:ring-2 focus:ring-blue-500"
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="bg-[#F8FAFC] focus:ring-2 focus:ring-blue-500"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  className="bg-[#F8FAFC] focus:ring-2 focus:ring-blue-500"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              variant="outline"
              type="submit"
              className="w-full mt-2 bg-[#1E40AF] hover:bg-[#1D4ED8] hover:scale-105 hover:text-white transition-all duration-300 text-white"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardFooter>
        </form>
        <Dialog
          open={success_}
          onOpenChange={(open) => !open && setSuccess(false)}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                Verify your email address by entering the OTP sent to your
                email. This step is crucial to ensure the security of your
                account and to confirm that you have access to the provided
                email address.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOtpSubmit}>
              <FieldGroup>
                <Field>
                  <Input id="email" name="email" disabled value={form.email} />
                </Field>
                <Field>
                  <button
                    type="button"
                    className="text-blue-500 text-sm relative left-26 top-6"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    className={`mb-5 border-gray-700`}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={verifying}
                  className=" bg-[#1E40AF] hover:bg-[#1D4ED8] text-white"
                >
                  {verifying ? "Verifying..." : "Verify OTP"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </Card>
    </div>
  );
}
