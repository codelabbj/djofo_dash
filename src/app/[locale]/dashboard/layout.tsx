"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BookOpen, FileText, Image, Settings, Home } from "lucide-react";
import { Header } from "@/components/header";
import { useTranslations } from 'next-intl';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: t('dashboard.navigation.dashboard'), href: "/dashboard", icon: Home },
    { name: t('dashboard.navigation.content'), href: "/dashboard/content", icon: FileText },
    { name: t('dashboard.navigation.media'), href: "/dashboard/media", icon: Image },
    { name: t('dashboard.navigation.subscriptions'), href: "/dashboard/subscriptions", icon: Users },
    { name: t('dashboard.navigation.formations'), href: "/dashboard/formations", icon: BookOpen },
    { name: t('dashboard.navigation.settings'), href: "/dashboard/settings", icon: Settings },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Desktop sidebar */}
      <div className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/Logo2.png" alt="Djofo Logo" style={{ height: '102px', marginRight: '8px' }} />
          <span style={{ fontWeight: 600,  fontSize: '1.2rem', lineHeight: 1,}}>Djofo.bj</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`${isActive ? "active" : ""} flex items-center gap-3`}
                    style={{ textDecoration: 'none' }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
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