import { Hero } from "@/components/Hero";
import Posts from "@/components/Posts";

export default async function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center -mt-16">
      <Hero/>
      <Posts/>
    </main>
  );
}
