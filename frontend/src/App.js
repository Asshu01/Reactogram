import "./App.css";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Postoverview from "./pages/posts";
import Profile from "./pages/profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  function DynamicRoutic() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (userData && token) { //when user is logged in
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate("/posts");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_FAILURE" });
        navigate("/login");
      }
    }, []);
    return (
      <Routes>
        <Route exact path="/" element={<Postoverview />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/posts" element={<Postoverview />} />
        <Route exact path="/profile" element={<Profile />} />
      </Routes>
    );
  }

  return (
    <div className="app-bg">
      <Router>
        <Navbar />
        <DynamicRoutic/>
      </Router>
    </div>
  );
}

export default App;
