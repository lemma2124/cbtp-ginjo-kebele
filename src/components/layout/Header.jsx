import React from "react";
import { Bell, Settings, Sun, Moon, User, Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";

const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Sidebar and Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full ethiopia-flag-gradient" />
            <h1 className="text-xl font-bold tracking-tight">Ginjo RFMS</h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 relative">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="text-xs font-medium"
            aria-label="Toggle language"
          >
            {language === "en" ? "አማ" : "EN"}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 z-50"
              style={{ position: "fixed" }}
            >
              <DropdownMenuLabel className="font-semibold text-base">
                {t("notifications")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="flex flex-col gap-2 p-2">
                  {user?.notifications?.length > 0 ? (
                    user.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-2 rounded-md p-2 hover:bg-blue-50 transition"
                      >
                        <div
                          className={`h-2 w-2 mt-2 rounded-full ${
                            notification.type === "event"
                              ? "bg-ethiopia-green"
                              : "bg-ethiopia-yellow"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t("noNotifications")}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full">
                  {t("markAllAsRead")}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 z-50"
                align="end"
                forceMount
                style={{ position: "fixed" }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.username}
                    </p>
                    <span className="text-xs leading-none text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
