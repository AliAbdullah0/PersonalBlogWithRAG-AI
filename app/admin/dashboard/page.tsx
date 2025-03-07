// app/admin/dashboard/page.tsx
"use client";
import { getPosts } from "@/actions/user.actions";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import UpdatePostForm from "@/components/UpdatePostForm";
import DeletePostDialog from "@/components/DeletePostClient";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

 
type Post = Awaited<ReturnType<typeof getPosts>>;

const Dashboard = () => {
  const [posts, setPosts] = useState<Post>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [model,setModel] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Error loading posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Real-time search
  useEffect(() => {
    const filtered = posts.filter((post) =>
      [post.title, post.content].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  if (error) {
    return (
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
            {error}
          </p>
          <div className="flex justify-center">
            <svg
              className="w-24 h-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/" onClick={()=>window.location.reload()}>Try Again</Link>
          </Button>
        </CardContent>
      </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen mt-12">
      <Sidebar />
      <div className="w-full p-6 bg-background">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="mb-2 flex md:flex-row flex-col gap-4 text-3xl font-extrabold mt-4 text-foreground">
              Admin Panel
            </h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 max-w-sm w-full"
          >
            <Input
              type="text"
              placeholder="Search by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              />
            <Button type="submit" variant="default" disabled>
              Search
            </Button>
          </form>
              </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden rounded-lg shadow-md bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <a href="#" className="block w-full h-full">
                  {post.image ? (
                    <img
                      alt={post.title}
                      src={post.image}
                      className="object-cover w-full h-48"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        No image available
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm font-medium text-primary">
                      Article
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="flex flex-col text-sm">
                        <p className="text-foreground font-medium">
                          {post.author}
                        </p>
                        <p className="text-muted-foreground">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString()
                            : "Date not available"}{" "}
                          - 6 min read
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full gap-3 mt-3">
                        <UpdatePostForm post={post}/>
                        <DeletePostDialog id={post.id}/>
                </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No posts found
            </p>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default Dashboard;