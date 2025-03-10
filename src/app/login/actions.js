"server only";
import { redirect } from "next/navigation";
import { createSession } from "../_lib/session";
export async function login(prevState, formData) {
    const email = formData.get("userid");
    const role = formData.get("role");
    const password = formData.get("password");
    await createSession(email, role, password);
    
    redirect('/home');
}