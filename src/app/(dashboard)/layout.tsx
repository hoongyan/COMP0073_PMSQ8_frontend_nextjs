import { Sidebar } from "@/components/SideBar/SideBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid gap-0 p-2 grid-cols-[200px_1fr]">
      <Sidebar />
      {children}
    </main>
  );
}
