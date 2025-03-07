import { prisma } from "@/lib/Prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import PostsBar from "@/components/PostsBar";

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: id },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      author: true,
      createdAt: true,
      reference: true,
    },
  });
  
  if (!post) {
    notFound();
  }


  return (
    <div className="min-h-screen flex mt-5 md:flex-row flex-col w-full justify-between bg-background text-foreground">
      <div className="mx-auto px-4 py-12 space-x-4 md:w-[70%] w-full">
        <Card className="border-none shadow-none">
          <CardHeader className="p-0">
            <h1 className="text-4xl md:text-5xl font-bold text-left mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {post.author || "Unknown Author"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date not available"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-8">
            {post.image && (
              <div className="mb-8 flex w-full justify-items-start">
                <img
                  src={post.image}
                  alt={post.title}
                  className="rounded-lg object-contain w-full"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none text-foreground">
              <p>{post.content}</p>
            </div>
          </CardContent>   
          {
            post.reference && 
            <CardFooter className="p-0 mt-12 flex flex-col items-start">
              <Separator className="mb-6" />
              <h2 className="text-2xl font-semibold mb-4">References</h2>
                    <Link
                      href={`https://www.${post.reference}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {post.reference}
                    </Link>
            </CardFooter>
            }

        </Card>
      </div>
      <div className="sticky md:top-10 md:w-[20%] w-full">
      <PostsBar id={post.id}/>
      </div>
    </div>
  );
};

export default BlogPage;