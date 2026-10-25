"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import type { IconName } from "@/lib/icons";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/game", label: "Game", icon: "pad" },
  { href: "/lacak", label: "Pesanan", icon: "search" },
  { href: "/bantuan", label: "Bantuan", icon: "help" },
];

const normalize = (value: string) => value.replace(/\/+$/, "") || "/";

export function MobileTabBar() {
  const pathname = normalize(usePathname() || "/");

  const isOn = (href: string) => {
    if (href === "/") return pathname === "/";
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (href === "/game" && (pathname.startsWith("/topup") || pathname.startsWith("/bayar")))
    );
  };

  return (
    <nav className="tabbar" aria-label="Navigasi cepat">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} className={isOn(tab.href) ? "on" : undefined}>
          <Icon name={tab.icon} />
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
