import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserProvider from "./context/UserContext";
import DashBoardPage from "./pages/DashBoardPage";
import EditResume from "./components/EditResume";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="/resume/:resumeId" element={<EditResume />} />
      </Routes>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      ></Toaster>
    </UserProvider>
  );
};

export default App;
