"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export const handleLogout = async ()=>{
      const cookie = cookies();
      (await cookie).delete('admin_token')  
      redirect('/')
}
