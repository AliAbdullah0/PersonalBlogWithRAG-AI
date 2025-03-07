import { getPosts } from "@/actions/user.actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Post = Awaited<ReturnType<typeof getPosts>>; 

const PostsBar = async ({ id }: { id: string }) => {
  
    const posts = await getPosts();    

  return (
    <div className=" w-full max-w-xs mx-auto p-4 md:sticky z-10 md:top-24 top-5 md:mt-20 mt-3">
      <Card className="border-none shadow-lg bg-background rounded-xl">
        <CardHeader className="p-4 pb-2">
          <h2 className="text-xl font-semibold text-foreground">Related Posts</h2>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent className="p-0 px-4 pb-4">
          <ScrollArea className="h-fit max-h-[80vh]">
            {posts.length > 0 ? (
              <ul className="space-y-1">
                {posts.map((post) => (
                  <li key={post.id}>
                    <a
                      href={`/post/${post.id}`}
                      className={`block text-sm py-2 px-3 rounded-md ${
                        post.id === id
                          ? "bg-[#f9b800] text-black font-medium"
                          : "text-foreground hover:bg-gray-100 hover:text-primary"
                      } transition-colors`}
                    >
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground px-3">No posts found</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostsBar;