import { AppSidebar } from "@/components/app-sidebar";
import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-fit flex items-center gap-4 px-4 my-4">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Logo variant="dark" />
          </div>
        </header> 
        </div>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
