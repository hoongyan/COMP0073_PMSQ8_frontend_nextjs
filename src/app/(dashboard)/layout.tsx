import { Sidebar } from "@/components/SideBar/SideBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid gap-4 p-4 grid-cols-[300px_1fr]">
      <Sidebar />
      {children}
    </main>
  );
}
