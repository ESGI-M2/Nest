"use client";

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
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const password = formData.get("password");

    await api.post("/auth/register", {
      email,
      firstName,
      lastName,
      password,
    });

    router.push("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center mx-auto">
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input type="text" name="firstName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input type="text" name="lastName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" />
            </div>
            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <span>Déjà un compte? </span>
          &nbsp;
          <Link href="/login" className="text-blue-500 font-bold">
            Connectez vous
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
