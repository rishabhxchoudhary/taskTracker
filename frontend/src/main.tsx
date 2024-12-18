import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../pages/LoginPage.tsx";
import Register from "../pages/RegisterPage.tsx";
import { AuthProvider } from "../hooks/AuthContext.tsx";
import RequireAuth from "../layouts/RequireAuth.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="236262780667-lk4u27332miu48493pos2p3pqfg26nng.apps.googleusercontent.com">
      <AuthProvider>
        <NextUIProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <App />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </BrowserRouter>
        </NextUIProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
