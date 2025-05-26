import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export default async function HomePage() {
    const cookieStore = await cookies();
    const token = await cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );
    } catch (e) {
        console.error('erreur:' + e)
        redirect("/login");
    }

    redirect("/chat");
}