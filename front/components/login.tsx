"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authContext } from "@/context/authContext";
import api from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const { setUser } = useContext(authContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await api.post("/auth/login", {
      email,
      password,
    });

    if (result.status !== 200) {
      console.error("Login failed");
      return;
    }

    window.localStorage.setItem("token", result.data.access_token);
    window.localStorage.setItem("user", JSON.stringify(result.data.user));
    setUser(result.data.user);

    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center mx-auto">
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <span>Pas encore de compte? </span>
          &nbsp;
          <Link href="/register" className="text-blue-500 font-bold">
            Inscrivez vous
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
