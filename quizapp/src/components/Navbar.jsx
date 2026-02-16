import axios from "axios";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

export default function Navbar({ logged, setLogged, admin }) {
  const navigate=useNavigate();
  const handleLogout = async () => {
    try {
      let res = await axios.post(
        "https://api-quizapp-tinp.onrender.com/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("role");
        setLogged(false);
        navigate("/login");
        toast.success("Logged out successfully!");
      } else {
        toast.error(res.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };
  return (
    <div className="w-full bg-[#1E40AF] text-[#FFFFFF] py-[2vh] text-2xl flex">
      <div className="text-3xl font-bold pl-[10vw] pr-[50vw]">
        <span className="text-red-600">Q</span>
        <span>uzzer</span>
      </div>
      <div className="flex justify-around items-center w-[30vw]">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `${isActive ? "text-red-500 font-bold" : "text-white"} ${logged?"":"ml-[15vw]"}`
          }
        >
          Home
        </NavLink>
        {logged && (
          <NavLink
            to={"/profile"}
            className={({ isActive }) =>
              `${isActive ? "text-red-500 font-bold" : "text-white"}`
            }
          >
            Profile
          </NavLink>
        )}
        {logged &&  (
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              `${isActive ? "text-red-500 font-bold" : "text-white"}`
            }
          >
            Dashboard
          </NavLink>
        )}
        {!logged && (
          <NavLink
            to={"/login"}
            className={({ isActive }) =>
              `${isActive ? "text-red-500 font-bold" : "text-white"}`
            }
          >
            Login
          </NavLink>
        )}
        {logged && (
          <Button
            className="px-2 py-2 text-2xl font-semibold bg-red-500 rounded hover:bg-red-600 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}
