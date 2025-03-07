import { prisma } from "@/lib/Prisma"

export const searchposts = async(query: string) => {
    try{
        const posts = await prisma.post.findMany({})
    if(!posts.length) return "No relevant posts found!"
    return posts.map(post => `ID:${post.id}\nTitle:${post.title}\nContent:${post.content}\nAuthor:${post.author}\nReference:${post.reference || ''}\nImage:${post.image || ''}`) 
    }catch(error){
        throw new Error("Error Searching Posts")    
    } 
}
