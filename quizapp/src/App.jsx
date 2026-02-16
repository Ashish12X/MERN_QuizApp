import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPass from "./pages/ForgotPass";
import Dashboard from "./pages/Dashboard";
import Member from "./pages/Member";
import { toast } from "sonner";
import axios from "axios";
import Profile from "./pages/Profile";
import You from "./components/dashboard/You";
import QuizRecord from "./components/dashboard/QuizRecord";
import CreateQuiz from "./components/dashboard/CreateQuiz";
import StudentInfo from "./components/dashboard/StudentInfo";
import Quiz from "./pages/Quiz";
import ProtectedRoute from "./components/ProtectedRoute";
import My from "./components/dashboard/My";
import Report from "./components/dashboard/Report";
import QuizPage from "./pages/QuizPage";
import ReportPage from "./pages/ReportPage";
import Answer from "./components/Answer";
import StudentQuizPage from "./pages/StudentQuizPage";

function App() {
  const [logged, setLogged] = useState(false);
  const [admin, setIsAdmin] = useState(false);

  const isAdmin = async () => {
    try {
      const res = await axios.get("https://api-quizapp-tinp.onrender.com/api/user/is-admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setIsAdmin(res.data.success);
    } catch (error) {
      if (error.response?.data?.message === "Token has expired") {
        localStorage.clear();
        setLogged(false);
        setIsAdmin(false);
        toast.error("Session expired. Please login again.");
      }

      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLogged(true);
      isAdmin();
    }
  }, [logged]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar logged={logged} setLogged={setLogged} admin={admin} />
            <Home admin={admin} />
            <Footer />
          </>
        }
      />
      <Route
        path="/login"
        element={
          <>
            <Navbar logged={logged} setLogged={setLogged} admin={admin} />
            <Login setLogged={setLogged} />
            <Footer />
          </>
        }
      />
      <Route
        path="/signup"
        element={
          <>
            <Navbar logged={logged} setLogged={setLogged} admin={admin} />
            <Signup setLogged={setLogged} />
            <Footer />
          </>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <>
            <Navbar logged={logged} setLogged={setLogged} admin={admin} />
            <ForgotPass />
            <Footer />
          </>
        }
      />
      <Route
        path="/member"
        element={
          <>
            <ProtectedRoute admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <Member />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/profile"
        element={
          <>
            <ProtectedRoute admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <Profile />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/quiz"
        element={
          <>
            <ProtectedRoute admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <Quiz />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/quizPage"
        element={
          <>
            <ProtectedRoute admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <QuizPage />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/reportPage"
        element={
          <>
            <ProtectedRoute admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <ReportPage />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/answerPage"
        element={
          <>
            <ProtectedRoute adminOnly admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <Answer />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/studentQuizPage"
        element={
          <>
            <ProtectedRoute admin={admin}>
              <Navbar logged={logged} setLogged={setLogged} admin={admin} />
              <StudentQuizPage />
              <Footer />
            </ProtectedRoute>
          </>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <>
            <Navbar logged={logged} setLogged={setLogged} admin={admin} />
            <Dashboard admin={admin} />
            <Footer />
          </>
        }
      >
        <Route index element={<Navigate to={admin ? "you" : "my"} replace />} />
        <Route
          path="you"
          element={
            <ProtectedRoute adminOnly admin={admin}>
              <You />
            </ProtectedRoute>
          }
        />
        <Route
          path="quizzes"
          element={
            <ProtectedRoute adminOnly admin={admin}>
              <QuizRecord />
            </ProtectedRoute>
          }
        />
        <Route
          path="create"
          element={
            <ProtectedRoute adminOnly admin={admin}>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute adminOnly admin={admin}>
              <StudentInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="my"
          element={
            <ProtectedRoute admin={admin}>
              <My />
            </ProtectedRoute>
          }
        />
        <Route
          path="report"
          element={
            <ProtectedRoute admin={admin}>
              <Report />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
