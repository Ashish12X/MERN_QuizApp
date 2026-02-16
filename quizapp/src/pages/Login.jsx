import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import { toast } from "sonner";
import axios from "axios";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login({ setLogged }) {
  let navigate = useNavigate();
  let [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("https://api-quizapp-tinp.onrender.com/api/user/login", form);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setLogged(true);
        navigate("/");
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
        <form onSubmit={handleSubmit}>
          <CardHeader className={`text-center`}>
            <CardTitle className={`text-[2.5vh]`}>
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <div
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    <HoverCard>
                      <HoverCardTrigger
                        onClick={() => navigate("/forgot-password")}
                      >
                        forgot your password?
                      </HoverCardTrigger>
                      <HoverCardContent>
                        By clicking on the link, you will receive an email with
                        instructions to reset your password.
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                <Input
                  className="bg-[#F8FAFC]"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              variant="outline"
              type="submit"
              className="w-full mt-10 bg-[#1E40AF] hover:bg-[#1D4ED8] hover:scale-105 hover:text-white transition-all duration-300 text-white"
            >
              Login
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
