import Link from "next/link";

const navLinks = [
  { label: "ETF Finder", href: "/finder" },
  { label: "Compare ETFs", href: "/compare" },
  { label: "Learn", href: "/learn" },
  { label: "ETF News", href: "/news" },
];

export default function Header() {
  return (
    <header className="bg-primary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-white">
          EasyCompare
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
