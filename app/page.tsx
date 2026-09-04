import { FooterNote } from "@/components/FooterNote";
import { Header } from "@/components/Header";
import { SwapDesk } from "@/components/SwapDesk";
import { Tape } from "@/components/Tape";
import { VaultRail } from "@/components/VaultRail";

export default function HomePage() {
  return (
    <div>
      <Header />
      <Tape />
      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage">Base · B20 desk</p>
          <h1 className="mt-2 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
            Swap the names. Fee prints the vault. Points pull the slip.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">
            A 0.50 percent desk fee is split onchain. Eighty percent restocks NVIDIA, Apple,
            Meta, and Alphabet tokens. Activity points come from volume, daily check-in, and
            missions.
          </p>
          <div className="mt-8">
            <SwapDesk />
          </div>
        </div>
        <VaultRail />
      </main>
      <FooterNote />
    </div>
  );
}
