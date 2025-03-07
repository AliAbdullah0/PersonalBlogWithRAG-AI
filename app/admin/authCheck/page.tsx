import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FiServer } from "react-icons/fi";

export default async function AdminPage() {
  const cookieStore = cookies();
  const hasAdminToken = (await cookieStore).get("admin_token");

  if (!hasAdminToken) {
    redirect("/admin/login");
  }

  redirect('/admin/dashboard')

  return(
    <>
      <div className="flex w-full min-h-screen">
        <div className="flex w-full p-4 justify-center items-center">
        <Card className="w-full max-w-md border-none shadow-lg border-8 border-red-400">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-foreground">
            Posts Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            Redirecting You To Admin Dashboard
          </p>
          <div className="flex justify-center">
            <FiServer className="text-3xl"/>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </>
  )
}