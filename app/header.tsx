"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrolled } from "./lib/use-scrolled";

const navLinks = [
  { label: "ETF Finder", href: "https://compare.easyequities.co.za/finder" },
  { label: "Compare ETFs", href: "/" },
  { label: "Learn", href: "https://compare.easyequities.co.za/learn" },
  { label: "ETF News", href: "https://compare.easyequities.co.za/news" },
];

const WHITE_LOGO =
  "https://compare.easyequities.co.za/hubfs/EasyCompare/WhiteLogo.png";
const MAIN_LOGO =
  "https://compare.easyequities.co.za/hubfs/EasyCompare/MainLogo.png";

export default function Header() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-primary"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src={scrolled ? MAIN_LOGO : WHITE_LOGO}
            alt="EasyCompare"
            width={160}
            height={40}
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex flex-col gap-1 p-2 sm:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 transition-colors ${scrolled ? "bg-gray-700" : "bg-white"}`}
          />
          <span
            className={`block h-0.5 w-5 transition-colors ${scrolled ? "bg-gray-700" : "bg-white"}`}
          />
          <span
            className={`block h-0.5 w-5 transition-colors ${scrolled ? "bg-gray-700" : "bg-white"}`}
          />
        </button>
      </div>
      {mobileOpen && (
        <>
        <div
          className="fixed inset-0 z-[-1] sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
        <nav className="flex flex-col gap-2 px-4 pb-4 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        </>
      )}
    </header>
  );
}
