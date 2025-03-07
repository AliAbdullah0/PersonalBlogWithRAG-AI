"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const checkForToken = async ()=>{
    const cookiesStore = cookies()
    const hasCookie = (await cookiesStore).get('admin_token')
    if (!hasCookie) {
      redirect("/admin/login");
    }
  
    redirect('/admin/dashboard')
  }