"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name } from "@coinbase/onchainkit/identity";

const links = [
  { href: "/", label: "Desk" },
  { href: "/missions", label: "Missions" },
  { href: "/activity", label: "Tape" },
];

export function Header() {
  const path = usePathname();

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          Gachapad
        </Link>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={path === l.href ? "text-oxblood" : "text-ink/70 hover:text-ink"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Wallet>
          <ConnectWallet className="rounded-none border border-ink bg-ink px-3 py-1.5 text-sm text-paper hover:bg-ink/90">
            <Avatar className="h-4 w-4" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </div>
    </header>
  );
}
