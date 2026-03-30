import Image from "next/image";
import Link from "next/link";

const WHITE_LOGO =
  "https://compare.easyequities.co.za/hubfs/EasyCompare/WhiteLogo.png";

const navLinks = [
  { label: "ETF Finder", href: "https://compare.easyequities.co.za/finder" },
  { label: "Compare ETFs", href: "/" },
  { label: "Learn", href: "https://compare.easyequities.co.za/learn" },
  { label: "ETF News", href: "https://compare.easyequities.co.za/news" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Image
                src={WHITE_LOGO}
                alt="EasyCompare"
                width={160}
                height={40}
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Compare Funds side by side and make your investment choice #Easier.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Navigate
            </h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Contact
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li>
                <a
                  href="tel:0879406000"
                  className="transition-colors hover:text-accent"
                >
                  087 940 6000
                </a>
              </li>
              <li>
                <a
                  href="mailto:helpme@easyequities.co.za"
                  className="transition-colors hover:text-accent"
                >
                  helpme@easyequities.co.za
                </a>
              </li>
              <li>
                WeWork, 173 Oxford Road, Rosebank, Gauteng, 2196
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/40">
            First World Trader (Pty) Ltd t/a EasyEquities (Reg No.
            1999/021265/07) is an authorized Financial Services Provider (FSP
            22588) and registered credit provider (NCRCP 12294). The contents of
            this website are for information purposes only and must not be
            construed as financial advice. For complaints policy, conflict of
            interest management policy and FAIS disclosures, visit{" "}
            <a
              href="https://www.easyequities.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-white/60"
            >
              www.easyequities.co.za
            </a>
            .
          </p>
          <p className="mt-4 text-xs text-white/40">
            &copy; {new Date().getFullYear()} EasyEquities. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
