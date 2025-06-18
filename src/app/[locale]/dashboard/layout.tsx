"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Content", href: "/dashboard/content" },
    { name: "Media Library", href: "/dashboard/media" },
    // { name: "Blog", href: "/dashboard/blog" },
    { name: "Settings", href: "/dashboard/settings" },
    // { name: "Profile", href: "/dashboard/profile" },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Mobile sidebar */}
      <div
        className="fixed-top d-lg-none"
        style={{
          zIndex: 1040,
          visibility: sidebarOpen ? 'visible' : 'hidden',
          opacity: sidebarOpen ? '1' : '0',
          transition: 'opacity 0.3s ease-in-out',
          width: sidebarOpen ? '100%' : '0',
        }}
      >
        <div className="modal-backdrop fade show" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setSidebarOpen(false)} />
        <div className="sidebar" style={{ width: '250px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="sidebar-header">
            <span>Admin Dashboard</span>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={pathname === item.href ? "active" : ""}
                    style={{ textDecoration: 'none' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-header"style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/Logo2.png" alt="Djofo Logo" style={{ height: '102px', marginRight: '8px' }} />
          <span style={{ fontWeight: 600,  fontSize: '1.2rem', lineHeight: 1,}}>Djofo.bj</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "active" : ""}
                  style={{ textDecoration: 'none' }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
} 