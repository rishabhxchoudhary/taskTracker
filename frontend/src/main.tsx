import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../pages/LoginPage.tsx";
import Register from "../pages/RegisterPage.tsx";
import { AuthProvider } from "../hooks/AuthContext.tsx";
import RequireAuth from "../layouts/RequireAuth.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from '../pages/Home.tsx'
import Project from '../pages/Project.tsx'
import TaskPage from '../pages/TaskPage.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="236262780667-lk4u27332miu48493pos2p3pqfg26nng.apps.googleusercontent.com">
      <AuthProvider>
        <NextUIProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/project"
                element={
                  <RequireAuth>
                      <Project />
                  </RequireAuth>
                }
              />
              <Route
                path="/task/:taskid"
                element={
                  <RequireAuth>
                      <TaskPage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </NextUIProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
