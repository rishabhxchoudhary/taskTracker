import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Link,
  Input,
  CardBody,
} from "@nextui-org/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/AuthContext";
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Layout  from "../layouts/Layout";
import axios from "axios";

interface GoogleJWT {
  email: string;
  name: string;
  avatar: string;
}

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) {
      navigate("/");
    }
  }, [auth?.user, navigate]);

  const responseMessage = async (response: CredentialResponse) => {
    console.log(response);
    if (response.credential) {
      const decoded: GoogleJWT = jwtDecode(response.credential);
      console.log("Decoded JWT:", decoded);

      // send this data to backend using axios

      Cookies.set(
        "user",
        JSON.stringify({
          email: decoded.email,
          username: decoded.name,
          avatar: decoded.avatar,
        }),
        { expires: 7, sameSite: "Strict" }
      );

      auth?.login({
        email: decoded.email,
        username: decoded.name,
        avatar: decoded.avatar,
      });

      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-2xl text-center">Login</div>
          </CardHeader>
          <CardBody className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                required
              />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full">Login</Button>
            <Link href="#" className="text-sm text-center">
              Forgot Password?
            </Link>
          </CardFooter>
          <CardBody>
            <GoogleLogin onSuccess={responseMessage} />
          </CardBody>
        </Card>

        <div className="mt-4">
          <span className="text-sm">Don't have an account? </span>
          <Link href="/register">Sign up</Link>
        </div>
      </div>
    </Layout>
  );
}
