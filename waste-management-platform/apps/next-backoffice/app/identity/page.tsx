"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Briefcase, User as UserIcon, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function IdentityPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return <div className="p-8">{t("identity.loading")}</div>;
  }

  const roleColors = {
    SUPER_ADMIN: "destructive",
    ENTERPRISE_MANAGER: "default",
    CHAUFFEUR: "secondary",
  } as const;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("identity.title")}</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("identity.profile_title")}</CardTitle>
            <CardDescription>{t("identity.profile_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold">{user.firstName} {user.lastName}</p>
                <div className="mt-1">
                  <Badge variant={roleColors[user.role] || "default"}>
                    {t(`roles.${user.role}`)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              
              {user.enterpriseId && (
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{t("identity.enterprise_id")} {user.enterpriseId}</span>
                </div>
              )}
            </div>

            <div className="pt-6">
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("identity.sign_out")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
