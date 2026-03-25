"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Menu, User, Earth } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  
  const initials = user 
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "??";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", lng);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <button className="text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t("nav.toggle_sidebar")}</span>
        </button>
        <span className="font-semibold text-lg text-success flex items-center gap-2">{t("nav.brand_name")}</span>
      </div>
      
      <div className="flex-1 md:flex-none"></div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-r pr-4 mr-1">
          <button onClick={() => changeLanguage('en')} className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>EN</button>
          <button onClick={() => changeLanguage('fr')} className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'fr' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>FR</button>
          <button onClick={() => changeLanguage('ar')} className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>AR</button>
        </div>

        <button 
          className="relative text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("nav.notifications")}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive border border-card" />
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("nav.toggle_theme")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {user && (
          <Link href="/identity">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-primary/20 transition-colors">
              <span className="text-xs font-semibold text-primary">{initials}</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
