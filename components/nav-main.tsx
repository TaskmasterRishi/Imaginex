"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Brain, BrainCog, CreditCard, GalleryVerticalEnd, Image, Settings, SquareTerminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal,
  },
  {
    title: "Generate Image",
    url: "/image-generation",
    icon: Image,
  },
  {
    title: "My Models",
    url: "/models",
    icon: Brain,
  },
  {
    title: "Train Model",
    url: "/model-training",
    icon: BrainCog,
  },
  {
    title: "My Images",
    url: "/gallery",
    icon: GalleryVerticalEnd,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/account-settings",
    icon: Settings,
  },
];


export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.url}
              className={cn("rounded-md", pathname === item.url ? 'text-primary bg-primary/10 rounded-md' : 'text-muted-foreground')}
            >
              <SidebarMenuItem className={pathname === item.url ? 'bg-primary/5 rounded-md' : ''}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 50 }}
                >
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="hover:cursor-pointer"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            </Link>
          </motion.div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
