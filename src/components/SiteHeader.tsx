"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/game", label: "Game" },
  { href: "/lacak", label: "Cek Pesanan" },
  { href: "/bantuan", label: "Bantuan" },
];

const normalize = (value: string) => value.replace(/\/+$/, "") || "/";

export function SiteHeader() {
  const pathname = normalize(usePathname() || "/");
  const [open, setOpen] = useState(false);

  const isOn = (href: string) => {
    if (href === "/") return pathname === "/";
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (href === "/game" && (pathname.startsWith("/topup") || pathname.startsWith("/bayar")))
    );
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="hd">
        <div className="wrap flex h-[72px] items-center justify-between">
          <Logo />
          <nav className="nv hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isOn(item.href) ? "on" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/game"
              className="btn btn-pk hidden min-h-[44px] px-5 py-2 sm:inline-flex"
            >
              Top up <Icon name="arrow" className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-w h-[44px] min-h-[44px] w-[44px] p-0 lg:hidden"
              aria-label="Buka menu"
              aria-expanded={open}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mnav" role="dialog" aria-modal="true" aria-label="Menu navigasi">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-w h-[44px] min-h-[44px] w-[44px] p-0"
              aria-label="Tutup menu"
            >
              <Icon name="x" />
            </button>
          </div>
          <nav className="mt-6" aria-label="Navigasi mobile">
            {NAV.map((item) => (
              <Link key={item.href} className="ml block" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/game" className="btn btn-pk mt-auto w-full">
            Top up sekarang <Icon name="arrow" />
          </Link>
        </div>
      )}
    </>
  );
}
