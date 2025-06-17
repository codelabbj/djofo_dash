"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//   LayoutDashboard,
//   Briefcase,
//   Users,
//   MessageSquare,
//   FileText,
//   Settings,
//   Globe,
// } from "lucide-react";

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard/content",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Services",
//     href: "/dashboard/content/services",
//     icon: Briefcase,
//   },
//   {
//     name: "Portfolio",
//     href: "/dashboard/content/portfolio",
//     icon: Globe,
//   },
//   {
//     name: "Team",
//     href: "/dashboard/content/team",
//     icon: Users,
//   },
//   {
//     name: "Testimonials",
//     href: "/dashboard/content/testimonials",
//     icon: MessageSquare,
//   },
//   {
//     name: "Blog",
//     href: "/dashboard/content/blog",
//     icon: FileText,
//   },
//   {
//     name: "Settings",
//     href: "/dashboard/content/settings",
//     icon: Settings,
//   },
// ];

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
    // const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-card lg:flex">
        {/* <div className="flex h-16 items-center border-b px-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Content Management
          </h2>
        </div> */}
        <nav className="flex-1 space-y-1 p-4">
          {/* {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-accent-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })} */}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </div>
    </div>
  );
} 