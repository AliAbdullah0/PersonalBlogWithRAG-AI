import { Sidebar } from "@/components/Sidebar";
import "../globals.css"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full">
        <aside className="w-fit">
        </aside>
        <section className="w-full flex justify-center">
        {children}
        </section>
    </main>
  );
}
