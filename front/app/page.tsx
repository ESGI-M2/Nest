import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export default async function HomePage() {
    const token = await cookies().get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );
    } catch {
        redirect("/login");
    }

    redirect("/chat");
}
