import { Card, CardHeader, CardFooter, Button, Link, Input } from "@nextui-org/react";
import React from "react";
import Layout from "../layouts/Layout";

export default function Register() {
  return (
    <Layout>
      <div className="flex flex-col h-screen justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-2xl text-center">Register</div>
          </CardHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input id="password" type="password" required />
            </div>
          </div>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full">Register</Button>
          </CardFooter>
        </Card>
        <div className="mt-4">
          <span className="text-sm">Already have an account? </span>
          <Link href="/login">
            Log in
          </Link>
        </div>
      </div>
    </Layout>
  )
}