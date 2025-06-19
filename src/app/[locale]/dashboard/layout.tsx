"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BookOpen, FileText, Image, Settings, Home, X, Search, ListChecks, Mic } from "lucide-react";
import { Header } from "@/components/header";
import { useTranslations } from 'next-intl';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const activeItemRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll active item into view when pathname changes
  useEffect(() => {
    if (activeItemRef.current && mounted) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [pathname, mounted]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const navigation = [
    { name: t('dashboard.navigation.dashboard'), href: "/dashboard", icon: Home },
    { name: t('dashboard.navigation.content'), href: "/dashboard/content", icon: FileText },
    { name: t('dashboard.navigation.media'), href: "/dashboard/media", icon: Image },
    { name: t('dashboard.navigation.subscriptions'), href: "/dashboard/subscriptions", icon: Users },
    { name: t('dashboard.navigation.formations'), href: "/dashboard/formations", icon: BookOpen },
    { name: t('dashboard.navigation.community'), href: "/dashboard/community", icon: Users },
    { name: t('dashboard.navigation.investigation'), href: "/dashboard/investigation", icon: Search },
    { name: t('dashboard.navigation.survey'), href: "/dashboard/survey", icon: ListChecks },
    { name: t('dashboard.navigation.podcast'), href: "/dashboard/podcast", icon: Mic },
    { name: t('dashboard.navigation.settings'), href: "/dashboard/settings", icon: Settings },
  ];

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleNavClick = (href) => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? "sidebar-mobile-open" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile close button */}
        <button
          className="sidebar-mobile-close d-lg-none"
          onClick={handleSidebarClose}
          aria-label="Close sidebar"
          type="button"
        >
          <X size={20} />
        </button>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <img 
              src="/Logo2.png" 
              alt="Djofo Logo" 
              style={{ height: '60px', width: 'auto' }} 
            />
            <span style={{ 
              fontWeight: 700,  
              fontSize: '1.3rem', 
              lineHeight: 1,
              background: 'linear-gradient(45deg, #fcd116, #fff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Djofo.bj
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" role="navigation">
          <ul role="list">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name} role="listitem">
                  <Link
                    ref={isActive ? activeItemRef : null}
                    href={item.href}
                    className={`${isActive ? "active" : ""} flex items-center gap-3`}
                    style={{ textDecoration: 'none' }}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleNavClick(item.href)}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="sr-only">Current page</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={handleSidebarClose}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main 
          className="page-content" 
          role="main"
          aria-label="Main content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}