"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ScanLine, 
  Trash2, 
  BarChart3, 
  Settings, 
  Truck,
  Leaf
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  
  const routes = [
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/classifications",
      label: t("nav.classifications"),
      icon: <ScanLine className="h-5 w-5" />,
    },
    {
      href: "/waste-items",
      label: t("nav.waste_items"),
      icon: <Trash2 className="h-5 w-5" />,
    },
    {
      href: "/collectors",
      label: t("nav.collectors"),
      icon: <Truck className="h-5 w-5" />,
    },
    {
      href: "/analytics",
      label: t("nav.analytics"),
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      href: "/settings",
      label: t("nav.settings"),
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-success">
          <Leaf className="h-6 w-6" />
          <span className="text-xl tracking-tight text-foreground">{t("nav.brand_name")}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {routes.map((route) => {
             const active = pathname === route.href || pathname.startsWith(`${route.href}/`);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  active ? "bg-muted text-success hover:text-success font-semibold" : "hover:bg-muted"
                )}
              >
                <div className="flex gap-2 items-center">
                  {route.icon}
                  {route.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4 flex justify-between items-center text-xs text-muted-foreground">
        <span>{t("nav.copyright")}</span>
        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{t("nav.version")}</span>
      </div>
    </aside>
  );
}
