"use client";

import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Globe, Menu } from "lucide-react";
import { useLocale } from "next-intl";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="header">
      <div className="header-controls">
         <button
        className="sidebar-mobile-toggle"
        onClick={onMenuClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginRight: "12px",
        }}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
        <button
          onClick={toggleTheme}
          className="header-control-button"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={toggleLanguage}
          className="header-control-button header-language-button"
          aria-label="Toggle language"
        >
          <Globe className="h-5 w-5" />
          <span className="language-text">
            {locale === "fr" ? "EN" : "FR"}
          </span>
        </button>
      </div>
    </div>
  );
} 