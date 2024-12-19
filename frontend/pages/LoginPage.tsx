import React, { useEffect } from "react";
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
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Layout  from "../layouts/Layout";
import { GoogleJWT } from "../types/types";
import { googleLogin } from "../src/api/auth";


export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) {
      navigate("/");
    }
  }, [auth?.user, navigate]);

  const loginWithGoogle = async (response: CredentialResponse) => {
    console.log(response);
    if (response.credential) {
      const decoded: GoogleJWT = jwtDecode(response.credential);
      console.log("Decoded JWT:", decoded);

      // send this data to backend using axios
      const data = await googleLogin(decoded);
      console.log("Data", data)
      
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

  const loginFunction = async ()=>{
      const data = {
        "email": "rishabh26072003@gmail.com",
        "name": "Rishabh Kumar",
        "avatar": "https://lh3.googleusercontent.com/a/ACg8ocIoFnLXXusZy7z4N5ZGsUo9oZ4osbAOdDza1t7xw0se5a3ZtX1d=s96-c",
    }
    const data2 = await googleLogin(data);
    console.log("Data", data2)

  }

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
            <Button className="w-full" onPress={loginFunction}>Login</Button>
            <Link href="#" className="text-sm text-center">
              Forgot Password?
            </Link>
          </CardFooter>
          <CardBody>
            <GoogleLogin onSuccess={loginWithGoogle} />
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
