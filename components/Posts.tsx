"use client";
import { getPosts } from "@/actions/user.actions";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SkeletonPost = () => (
  <div className="overflow-hidden rounded-lg shadow-md bg-gray-300 border border-border animate-pulse">
    <div className="w-full h-48 bg-muted/50 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-shimmer" />
    </div>
    <div className="p-4 space-y-4">
      <div className="h-4 w-20 bg-muted/50 rounded" />
      <div className="h-6 w-3/4 bg-muted/50 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted/50 rounded" />
        <div className="h-4 w-5/6 bg-muted/50 rounded" />
        <div className="h-4 w-2/3 bg-muted/50 rounded" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-4 w-24 bg-muted/50 rounded" />
        <div className="h-4 w-32 bg-muted/50 rounded" />
      </div>
    </div>
  </div>
);

type Post = Awaited<ReturnType<typeof getPosts>>;

const Posts = () => {
  const [posts, setPosts] = useState<Post>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

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

  useEffect(() => {
    const filtered = posts.filter((post) =>
      [post.title, post.content].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

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
      <div className="flex w-[87%] min-h-screen" id="blogs">
        <div className="w-full p-6 bg-background">
          <div className="flex items-end justify-between mb-8">
            <div className="flex md:flex-row items-center w-full justify-between flex-col gap-4">
              <h1 className="mb-2 text-3xl font-bold text-foreground" id="blogs">
                Latest Articles
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
                disabled
              />
              <Button type="submit" variant="default" disabled>
                Search
              </Button>
            </form>
            </div>

          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonPost key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[87%] min-h-screen">
      <div className="w-full p-6 bg-background">
        <div className="flex md:flex-row flex-col items-end justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Latest Articles
            </h1>
          </div>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.slice(0, visibleCount).map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
              <motion.article
                className="relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                {post.image ? (
                  <motion.img
                    alt={post.title}
                    src={post.image}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ) : (
                  <div className="absolute inset-0 h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      No image available
                    </span>
                  </div>
                )}

                <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
                  <div className="p-4 sm:p-6">
                    <motion.time
                      dateTime={post.createdAt?.toISOString()}
                      className="block text-xs text-white/90"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "Date not available"}
                    </motion.time>

                      <motion.h3
                        className="mt-0.5 text-lg text-white line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        {post.title}
                      </motion.h3>

                    <motion.p
                      className="mt-2 line-clamp-3 text-sm/relaxed text-white/95"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      {post.content}
                    </motion.p>
                  </div>
                </div>

              </motion.article>
              </Link>
            ))
          ) : (
            <div className="flex w-full items-center justify-center">
              No posts found
            </div>
          )}
        </div>

        {filteredPosts.length > visibleCount && (
          <div className="mt-8 flex justify-center">
            <Button onClick={handleShowMore}>Show More</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;