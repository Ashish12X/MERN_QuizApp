import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard({ admin }) {
  const role = admin ? "Admin" : "User";;

  return (
    <div className="grid grid-cols-[25%_auto] gap-5">
      <div className="bg-gray-200 flex flex-col items-center pt-15 gap-y-6">
        {role === "Admin" ? (
          <>
            <NavLink className={({ isActive }) => `${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-700"} text-2xl py-2 px-10 rounded`} to="/dashboard/you">Dashboard</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-700"} text-2xl py-2 px-10 rounded`} to="/dashboard/quizzes">Quizzes Record</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-700"} text-2xl py-2 px-10 rounded`} to="/dashboard/create">Create Quiz</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-700"} text-2xl py-2 px-10 rounded`} to="/dashboard/students">Students Record</NavLink>
          </>
        ) : (
          <>
            <NavLink className={({ isActive }) => `${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-700"} text-2xl py-2 px-10 rounded`} to="/dashboard/my">My Dashboard</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "text-gray-700"} text-2xl py-2 px-10 rounded`} to="/dashboard/report">My Attempts</NavLink>
          </>
        )}
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
