"use server"

import { prisma } from "@/lib/Prisma"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers";

export const createPost = async(formData:FormData)=>{
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const image = formData.get("image") as string
    const author = 'Ali Abdullah' as string
    const reference = formData.get("reference") as string

    try {
        const post = await prisma.post.create({
        data:{
            title,
            content,
            image,
            author,
            reference,
        }
    })
    revalidatePath('/posts')
    return {success:true,status:201}
} catch (error) {
    throw new Error("Error Creating Post")
}
}

export const deletePost = async (postId:string)=>{
    try {
        const post = await prisma.post.delete({
            where:{
                id:postId,
            }
        })

        return {success:true}
    } catch (error) {
        throw new Error("Error Deleting Post!")
    }
}

export const getPosts = async ()=>{
    try {
        const posts = await prisma.post.findMany({
            orderBy:{
                createdAt:'desc'
            }
        })
        // revalidatePath('/posts')
        return posts
    } catch (error) {
        console.log('Error in getPosts:',error);
        // return {success:false,status:404}
        notFound()
        throw error       
    }
}

export const updatePost = async (postId:string,formData:FormData)=>{
    try {
        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const reference = formData.get('reference') as string
        const image = formData.get('image') as string
        
        const post = await prisma.post.update({
            where:{
                id:postId
            },
            data:{
                title,
                content,
                reference,
                image
            }
        })

        if(!post) throw new Error("Post Not Found!")
        // revalidatePath('/')
        return post
    } catch (error) {
        notFound()
        throw error
    }
}

export const verifyAdmin = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const p = process.env.ADMIN_PASSWORD;
  const e = process.env.ADMIN_EMAIL;

  if (email === e && password === p) {
    (await cookies()).set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", 
      maxAge: 60 * 60 * 24, 
    });
    redirect("/admin/authCheck");
    return { success: true };
  } else {
    return { success: false };
  }
};

